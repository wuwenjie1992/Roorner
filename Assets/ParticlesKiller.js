#pragma strict

function Start () {

}

function Update () {

	if (!particleSystem.IsAlive()){
		Destroy (gameObject);
	}

}