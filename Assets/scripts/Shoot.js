#pragma strict

var pointerTexture:Texture2D;
var weaponGO:GameObject;
var weaponScript:Weapon;

function Start () {

	for (child in transform){
	
		var typedChild : Transform = child as Transform;
		// get typed  answers.unity3d.com/questions/373838/
		//implicit-downcast-warning.html
		if (typedChild.gameObject.tag == "weapon"){
			weaponGO = typedChild.gameObject;
			break;
		}
	}
	if (weaponGO != null){
		weaponScript = weaponGO.GetComponent(Weapon);
	}
}

function Update () {
	if (Input.GetButton ("Fire1")) {
		if (weaponScript != null){
			weaponScript.TryToShoot(Input.GetButtonDown("Fire1"));
		}
	}
}

//画准星
function OnGUI (){
	var pointerRect:Rect = new Rect (((Screen.width - pointerTexture.width) / 2.0f), ((Screen.height - pointerTexture.height) / 2.0f), pointerTexture.width, pointerTexture.height);
	GUI.DrawTexture(pointerRect, pointerTexture);
}