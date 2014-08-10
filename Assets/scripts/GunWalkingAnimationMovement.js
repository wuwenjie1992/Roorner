#pragma strict


var weapon:Transform;
var _x:float;
var  _y:float;

function Start () {
	_x = 0.0f;
	_y = 0.0f;

}

function Update () {

}

//LateUpdate is called after all Update functions have been called
function LateUpdate (){
		
	var playerPos:Vector3 = transform.position;
	var weaponPos:Vector3 = (playerPos + (transform.rotation * new Vector3 (0.4f, 1.46f, 0.3f)));
		
	var movementVertical:float = Input.GetAxis ("Vertical");
	var movementHorizontal:float = Input.GetAxis ("Horizontal");
		
	if (Mathf.Abs(movementVertical) > 0.3f || Mathf.Abs(movementHorizontal) > 0.3f) {
	
		var velocity:float = 0.025f;
		if (Input.GetKey(KeyCode.LeftShift) || Input.GetKey(KeyCode.RightShift)){
			velocity *= 2.0f;
		}
			
		var offsetX:float = (Mathf.Sin (_x * 8.0f) * velocity);
		var offsetY:float = (Mathf.Cos (_y * 16.0f) * velocity);
		
		weaponPos.x += offsetX;
		weaponPos.y += offsetY;
		
		_x += Time.deltaTime;
		_y += Time.deltaTime;
	}
		
	weapon.position = weaponPos;
}