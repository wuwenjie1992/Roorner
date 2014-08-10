#pragma strict

var bulletPrefab:GameObject;
var shootPoint:Transform;
var shootForce:float = 66.0f;
var shotsPerSecond:int = 6;
var timeSinceLastShoot:float = 0.0f;

var fire_sound:AudioClip;

function Start () {

}

function Update () {
	timeSinceLastShoot += Time.deltaTime;
}

function TryToShoot(){
	TryToShoot(false);
}

function TryToShoot(forceShoot:boolean){

	if (forceShoot || (timeSinceLastShoot >= (1.0/shotsPerSecond))){
	
		timeSinceLastShoot = 0.0f;
		var pos:Vector3 = shootPoint.position;
		var direction:Vector3 = -transform.forward;
		var bullet:GameObject = Instantiate (bulletPrefab, pos, Camera.main.transform.rotation);
		gameObject.audio.PlayOneShot(fire_sound,0.4);
		bullet.rigidbody.AddForce (direction * shootForce, ForceMode.Impulse);
		//Add an instant force impulse to the rigidbody, using its mass.
	}
}