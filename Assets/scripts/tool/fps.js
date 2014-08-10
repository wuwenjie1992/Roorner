#pragma strict

//http://game.ceeger.com/Script/Time/Time.realtimeSinceStartup.html
// A FPS counter. 一个FPs计时器
// It calculates frames/second over each updateInterval,
// so the display does not keep changing wildly.
//在每个updateInterval间隔处计算，帧/秒，这样显示就不会随意的改变

var updateInterval = 0.5;
private var lastInterval : double; // Last interval end time 最后间隔结束时间
private var frames = 0; // Frames over current interval 超过当前间隔帧
private var fps : float; // Current FPS //当前FPS

function Start() {
	lastInterval = Time.realtimeSinceStartup;
	frames = 0;
}

function OnGUI () {
	// Display label with two fractional digits
	//在标签显示两位小数
	GUILayout.Label("FPS:" + fps.ToString("f2"));
}

function Update() {
	++frames;
	var timeNow = Time.realtimeSinceStartup;
	if( timeNow > lastInterval + updateInterval ){
		fps = frames / (timeNow - lastInterval);
		frames = 0;
		lastInterval = timeNow;
	}
}