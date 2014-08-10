#pragma strict

var movementSpeed:float = 30.0f;
var rotationSpeedX:float = 1.0f;
var rotationSpeedY:float = 2.0f;
var cameraXRange:float = 60.0f;
	
var jumpSpeed:float = 10.0f;
var maxJumps:int = 3;
var nJumps:int = 0;

var characterController:CharacterController;
var cameraCurrRotationX:float = 0.0f;
var gravitySpeed:float = 0.0f;

function Start () {
	characterController = gameObject.GetComponent(CharacterController);
	Screen.showCursor = false;
}

function Update () {

	var rotationY:float = Input.GetAxis("Mouse X") * rotationSpeedY;
	transform.Rotate(0.0f, rotationY, 0.0f);
		
	var rotationX:float = Input.GetAxis("Mouse Y") * rotationSpeedX;
	cameraCurrRotationX = Mathf.Clamp(cameraCurrRotationX-rotationX, -cameraXRange, cameraXRange);
	Camera.main.transform.localRotation = Quaternion.Euler(cameraCurrRotationX, 0.0f, 0.0f);
		
	var movementVertical:float = Input.GetAxis("Vertical") * movementSpeed;
	var movementHorizontal:float = Input.GetAxis("Horizontal") * movementSpeed;
		
	if (!characterController.isGrounded){
		
		movementVertical *= 0.5f;
		movementHorizontal *= 0.5f;
			
		gravitySpeed += Physics.gravity.y * Time.deltaTime;
		if (nJumps == 0){
			nJumps = 1;
		}
	}
		
	if (Input.GetKey(KeyCode.LeftShift) || Input.GetKey(KeyCode.RightShift)){
	
		movementVertical *= 2.0f;
		movementHorizontal *= 2.0f;
	}
		
	if ((characterController.isGrounded || nJumps < maxJumps) && Input.GetButtonDown("Jump")){
			
		gravitySpeed = jumpSpeed;
		nJumps++;
	}
		
	var moveSpeed:Vector3 = transform.rotation * (new Vector3(movementHorizontal, this.gravitySpeed, movementVertical));
	characterController.Move(moveSpeed * Time.deltaTime);
}

function LateUpdate(){
	if (characterController.isGrounded){
		gravitySpeed = 0.0f;
		nJumps = 0;
	}
}
