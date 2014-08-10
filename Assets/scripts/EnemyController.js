#pragma strict

var life:int = 100;
var patrol:boolean = true; //巡逻
var isPatrolling:boolean = true; //巡逻
var patrolPoints:Transform [];	//巡逻点数组,需要赋值
var realPatrolPoints:Vector3 [];
var	patrolPointIndex:int;

var characterController:CharacterController; //角色控制器
var target:Transform;	//目标

var gravitySpeed:float = 0.0f;
var jumpSpeed:float = 10.0f;
var maxJumps:int = 3;
var nJumps:int = 0;
var movementSpeed:float = 10.0f; //移动速度
var rotationSpeedX:float = 2.0f;
var rotationSpeedY:float = 4.0f;
var cameraXRange:float = 60.0f;
var lastMovementVertical:float = 1.0f;
var lastMovementHorizontal:float = 0.0f;
var visionField:float = 10.0f;
var shootField:float = 5.0f;

var weaponGO:GameObject;	//武器对象
var weaponScript:Weapon;	//武器脚本

function Start() {

	characterController = gameObject.GetComponent(CharacterController);
	
	if (target == null){
		target = GameObject.FindWithTag("player").transform;
	}
	
	for(var child:Transform in transform){
	
		if(child.gameObject.tag == "weapon"){
			weaponGO = child.gameObject;
			break;
   	 	}
	}
	//http://answers.unity3d.com/questions/285133/
	//find-child-of-a-game-object-using-tag.html
	
	if (weaponGO != null){
		weaponScript = weaponGO.GetComponent(Weapon);
	}
	
	//将已经赋值的训练点，再赋给realPatrolPoints三维向量数组
	patrolPointIndex = 0;
	
	if (patrolPoints != null && patrolPoints.Length > 0){
		
		realPatrolPoints = new Vector3[patrolPoints.Length];
		
		for(var i = 0; i < patrolPoints.Length; ++i){
			var patrolPoint:Transform = patrolPoints[i];
			realPatrolPoints[i] = patrolPoint.position;
			Destroy(patrolPoint.gameObject);
		}
	}else{
		realPatrolPoints = null;
	}
	patrolPoints = null;
}

function Update() {

	updateGravity(false);

	var sqrDistance:float = Vector3.SqrMagnitude(target.position - transform.position);
	//长度的平方 Returns the squared length of this vector
		
	if (sqrDistance < (visionField * visionField)) {	//如果在视野里
		isPatrolling = false;	//停止巡逻
		var canShoot:boolean = (sqrDistance < (shootField * shootField));
		updateFollowTarget(canShoot); //追击目标
		} else {
			isPatrolling = true;
			updateMovement(); //巡逻移动
		}
}

function updateGravity(isu:boolean){

	if(isu){
		if (!characterController.isGrounded) { // 未碰地面
			gravitySpeed += Physics.gravity.y * Time.deltaTime;	//刚性物体的y方向的重力×每帧间隔
			if (nJumps == 0) {
				nJumps = 1;
			}
			var moveSpeed:Vector3 = new Vector3 (0.0f, this.gravitySpeed, 0.0f);
			characterController.Move (moveSpeed * Time.deltaTime);	//绝对移动
		}
		//bool jump = Input.GetButtonDown("Jump");
		var jump:boolean = false;
		if ((characterController.isGrounded || nJumps < maxJumps) && jump) {
			gravitySpeed = jumpSpeed;
			nJumps++;
		}
	}
}

//追击目标
function updateFollowTarget(canShoot:boolean){
	//注视方向，目标与自己的差
	var lookDirec:Vector3 = (target.position - transform.position); 
	lookDirec.y = 0.0f;
	transform.rotation = Quaternion.LookRotation(lookDirec);//注视旋转，盯住目标
		
	if (lookDirec.sqrMagnitude > (shootField*shootField*0.5f)){ //两者距离平方小于视野平方的一半
		var movement:Vector3 = (lookDirec.normalized * movementSpeed);//规范化，向量方向保持，长度为1
		movement.y = 0.0f;
		characterController.Move(movement*Time.deltaTime); //朝着目标方向移动
	}
		
	if (canShoot && weaponScript != null){
		weaponScript.TryToShoot(); //开始射击
	}
}

//巡逻移动
function updateMovement(){
	
	if (patrol && isPatrolling && (realPatrolPoints != null) && (realPatrolPoints.Length > 0)){
		var nextPatrolPoint:Vector3 = realPatrolPoints[patrolPointIndex];
		updateMovementToPosition(nextPatrolPoint); //前往下一个巡逻点
	}else{
		updateMovementRandomly(); //随机移动
	}
}

function updateMovementRandomly(){ //随机移动

	var rotationY:float = Random.Range (-0.15f, 0.15f) * rotationSpeedY;//返回随机浮点数，min～max
	transform.Rotate (0.0f, rotationY, 0.0f); //随机旋转
	
	if (Random.value > 0.99) { //Returns a random number between [0.0,1.0] 
		changeDirection(); //改变方向
	}
	//float rotationX = 0.0f * this.rotationSpeedX;
	//cameraCurrRotationX = Mathf.Clamp(cameraCurrRotationX-rotationX, -cameraXRange, cameraXRange);
	//Camera.main.transform.localRotation = Quaternion.Euler(cameraCurrRotationX, 0.0f, 0.0f);
	
	lastMovementVertical += (Random.Range (-0.5f, 0.5f) * Time.deltaTime);//纵向的
		if (lastMovementVertical < -1.0f) {
			lastMovementVertical = -1.0f;
		} else if (lastMovementVertical > 1.0f) {
			lastMovementVertical = 1.0f;
		}
		
	lastMovementHorizontal += (Random.Range (-0.15f, 0.15f) * Time.deltaTime);//横向的
		if (lastMovementHorizontal < -1.0f) {
			lastMovementHorizontal = -1.0f;
		} else if (lastMovementHorizontal > 1.0f) {
			lastMovementHorizontal = 1.0f;
		}
		
	var movementVertical:float = lastMovementVertical * movementSpeed;
	var movementHorizontal:float = lastMovementHorizontal * movementSpeed;
		
	if (!characterController.isGrounded) {
		movementVertical *= 0.5f;
		movementHorizontal *= 0.5f;
	}
		
	//bool sprint = Input.GetKey(KeyCode.LeftShift) || Input.GetKey(KeyCode.RightShift);
	var sprint:boolean = false; //冲刺
	if (sprint) {
		movementVertical *= 2.0f;
		movementHorizontal *= 2.0f;
	}
	var moveSpeed:Vector3 = transform.rotation * (new Vector3(movementHorizontal, 0.0f, movementVertical));
	characterController.Move(moveSpeed * Time.deltaTime);
}

function updateMovementToPosition(position:Vector3){

	var direction:Vector3 = (position - transform.position);
	transform.rotation = Quaternion.LookRotation(direction);
	var movement:Vector3 = (direction.normalized * movementSpeed);
	movement.y = 0.0f;
	characterController.Move(movement*Time.deltaTime);
	
	if (direction.sqrMagnitude < 1.0f){ //如果目标距离小于一米，下一个训练点
		patrolPointIndex = ((patrolPointIndex+1) % realPatrolPoints.Length);
	}
}

function LateUpdate(){
		
	if (characterController.isGrounded) {
		gravitySpeed = 0.0f;
		nJumps = 0;
	}
}

function changeDirection(){
	transform.rotation = Quaternion.Euler(0.0f, Random.Range (0.0f, 360.0f), 0.0f);
	//设置脚本所在对象的【旋转角度】 Euler 返回一个旋转角度
}
	
function OnControllerColliderHit (hit:ControllerColliderHit){
	
	if (hit.gameObject.tag == "map-walls") { //如果碰到墙壁，改变方向，旋转
		
		//注视方向，目标与自己的
		//print("map-walls1:"+transform.eulerAngles + "法线:" +hit.normal);
		var lookDirec:Vector3 = new Vector3 (0.0f, 0.0f, 0.0f) - hit.normal;
		lookDirec.y = 0.0f;
		transform.rotation = Quaternion.LookRotation(lookDirec);//注视旋转，盯住目标
		
		//CharacterController: Don’t try to move a character controller within a OnControllerCollider event.
		//spillmakerlauget.no/forums/forum/spillmakerlauget/generell-diskusjon/104-unity-3d-tips
		
		//寻路 放射线 往空的地方走 看到地板
		//Transform.LookAt 注视 地板
		//旋转物体，这样向前向量指向target的当前位置
		//var a = transform.eulerAngles;
		
		//print("map-walls2:"+transform.eulerAngles + "法线:" +hit.normal);
		
	}
}

function applyDamage (damage:int){
	life -= damage;
	if (life <= 0) {
		Destroy (gameObject);
	}
}