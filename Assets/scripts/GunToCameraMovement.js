#pragma strict

var cameraToFollow:Camera;
var weapon:Transform;
var speed:float = 25.0f;


function Start () {
	cameraToFollow = Camera.main;
}

function Update () {

	var eulerRotationTo:Vector3 = cameraToFollow.transform.rotation.eulerAngles;
	eulerRotationTo.y += 180.0f;
	eulerRotationTo.x = -eulerRotationTo.x;
	var rotationTo:Quaternion = Quaternion.Euler(eulerRotationTo);
	weapon.transform.rotation = Quaternion.Lerp(weapon.transform.rotation, rotationTo, 0.5f*Time.deltaTime*speed);

}