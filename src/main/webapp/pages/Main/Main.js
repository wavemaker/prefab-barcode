/*
 * Use App.getDependency for Dependency Injection
 * eg: var DialogService = App.getDependency('DialogService');
 */

/*
 * This function will be invoked when any of this prefab's property is changed
 * @key: property name
 * @newVal: new value of the property
 * @oldVal: old value of the property
 */
Prefab.onPropertyChange = function(key, newVal, oldVal) {

    // debugger;
    // switch (key) {
    //     case "startbuttonicon":
    //         Prefab.Widgets.Scannerbtn.iconclass = Prefab.startbuttonicon ? Prefab.startbuttonicon : '';
    //         break;
    //     case "cancelbuttonicon":
    //         Prefab.Widgets.stop.iconclass = Prefab.cancelbuttonicon ? Prefab.cancelbuttonicon : '';
    //         break;
    // }
};


Prefab.openFullscreen = function(elem) {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();
    }
}

Prefab.closeFullscreen = function() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { /* Firefox */
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE/Edge */
        document.msExitFullscreen();
    }
}


Prefab.stop = function() {
    if (Prefab.initialized) {
        Prefab.codeReader.reset();
        Prefab.videoEl.remove();
        Prefab.initialized = false;
        Prefab.Widgets.stop.show = false;
        Prefab.closeFullscreen();
    }

}


Prefab.initialized = false;

Prefab.start = function() {
    Prefab.initializeScanner();

}

Prefab.initializeScanner = function() {
    let selectedDeviceId;
    Prefab.codeReader = new ZXing.BrowserBarcodeReader()
    console.log('ZXing code reader initialized')
    Prefab.codeReader.getVideoInputDevices().then((videoInputDevices) => {
            console.log('Devices', videoInputDevices);
            Prefab.videoEl = document.createElement('video');
            Prefab.videoEl.id = "video";
            Prefab.videoContainerEl = Prefab.Widgets.container1.getNativeElement();
            Prefab.videoContainerEl.appendChild(Prefab.videoEl);


            Prefab.codeReader.decodeOnceFromVideoDevice(undefined, 'video').then((result) => {
                Prefab.stop();
                Prefab.datavalue = result.text;
                Prefab.onSuccess(result.text);
            }).catch((err) => {
                console.error("Error", err);
                Prefab.stop();
            });
            Prefab.initialized = true;
            Prefab.openFullscreen(Prefab.videoContainerEl);
            Prefab.Widgets.stop.show = true;
            console.log(`Started continous decode from camera`)
            Prefab.datavalue = '';
        })
        .catch((err) => {
            console.error("Some error occurred", err);
            Prefab.stop();
        });

}

Prefab.onReady = function() {
    // this method will be triggered post initialization of the prefab.
    Prefab.Widgets.Scannerbtn.iconclass = Prefab.startbuttonicon ? Prefab.startbuttonicon : '';
    Prefab.Widgets.stop.iconclass = Prefab.cancelbuttonicon ? Prefab.cancelbuttonicon : '';

};



Prefab.ScannerbtnClick = function($event, widget) {
    Prefab.onBeforescan();
    Prefab.initializeScanner();
};

Prefab.stopClick = function($event, widget) {
    Prefab.stop();
};