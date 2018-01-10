var org;
(function (org) {
    var ssatguru;
    (function (ssatguru) {
        var babylonjs;
        (function (babylonjs) {
            var component;
            (function (component) {
                var Axis = BABYLON.Axis;
                var Color3 = BABYLON.Color3;
                var Matrix = BABYLON.Matrix;
                var Mesh = BABYLON.Mesh;
                var MeshBuilder = BABYLON.MeshBuilder;
                var Path2 = BABYLON.Path2;
                var Quaternion = BABYLON.Quaternion;
                var Space = BABYLON.Space;
                var StandardMaterial = BABYLON.StandardMaterial;
                var Vector3 = BABYLON.Vector3;
                var ActionType;
                (function (ActionType) {
                    ActionType[ActionType["TRANS"] = 0] = "TRANS";
                    ActionType[ActionType["ROT"] = 1] = "ROT";
                    ActionType[ActionType["SCALE"] = 2] = "SCALE";
                })(ActionType || (ActionType = {}));
                var EditControl = (function () {
                    function EditControl(mesh, camera, canvas, scale, eulerian) {
                        var _this = this;
                        this.local = true;
                        this.snapT = false;
                        this.snapR = false;
                        this.transSnap = 1;
                        this.rotSnap = Math.PI / 18;
                        this.axesLen = 0.4;
                        this.axesScale = 1;
                        //how close to an axis should we get before we can pck it 
                        this.pickWidth = 0.02;
                        //axes visibility
                        this.visibility = 0.75;
                        //how far away from camera should the edit control appear to be
                        this.distFromCamera = 2;
                        //vector from camera to edit control
                        this.cameraTOec = new Vector3(0, 0, 0);
                        this.cameraNormal = new Vector3(0, 0, 0);
                        //rotate the rotation guides so that they are facing the camera
                        this.ecMatrix = new Matrix();
                        //edit control to camera vector
                        this.ecTOcamera = new Vector3(0, 0, 0);
                        this.prevState = "";
                        this.hidden = false;
                        this.actionListener = null;
                        this.actionStartListener = null;
                        this.actionEndListener = null;
                        this.pDown = false;
                        this.pointerIsOver = false;
                        this.editing = false;
                        this.snapRX = 0;
                        this.snapRY = 0;
                        this.snapRZ = 0;
                        this.snapTV = new Vector3(0, 0, 0);
                        this.transBy = new Vector3(0, 0, 0);
                        //rotate differently if camera is too close to the rotation plane
                        this.rotate2 = false;
                        this.snapS = false;
                        this.snapSX = 0;
                        this.snapSY = 0;
                        this.snapSZ = 0;
                        this.snapSA = 0;
                        this.snapSV = new Vector3(0, 0, 0);
                        this.scaleSnap = 0.25;
                        this.scale = new Vector3(0, 0, 0);
                        this.eulerian = false;
                        this.snapRA = 0;
                        //TODO REMOVE
                        //vector normal to camera in world frame of reference
                        this.cN = new Vector3(0, 0, 0);
                        //rotation axis based on camera orientation
                        this.rotAxis = new Vector3(0, 0, 0);
                        this.transEnabled = false;
                        this.rotEnabled = false;
                        this.scaleEnabled = false;
                        this.guideSize = 180;
                        this.localX = new Vector3(0, 0, 0);
                        this.localY = new Vector3(0, 0, 0);
                        this.localZ = new Vector3(0, 0, 0);
                        this.tSnap = new Vector3(this.transSnap, this.transSnap, this.transSnap);
                        //few temp vectors & matrix
                        this.tv1 = new Vector3(0, 0, 0);
                        this.tv2 = new Vector3(0, 0, 0);
                        this.tv3 = new Vector3(0, 0, 0);
                        this.tm = new Matrix();
                        this.mesh = mesh;
                        this.mainCamera = camera;
                        this.canvas = canvas;
                        this.axesScale = scale;
                        if (eulerian !== null) {
                            this.eulerian = eulerian;
                        }
                        else {
                            this.eulerian = false;
                        }
                        this.checkQuaternion();
                        this.scene = mesh.getScene();
                        this.actHist = new ActHist(mesh, 10);
                        mesh.computeWorldMatrix(true);
                        this.boundingDimesion = this.getBoundingDimension(mesh);
                        this.ecRoot = new Mesh("EditControl", this.scene);
                        this.ecRoot.rotationQuaternion = Quaternion.Identity();
                        this.ecRoot.visibility = 0;
                        this.ecRoot.isPickable = false;
                        this.createMaterials(this.scene);
                        var guideAxes = this.createCommonAxes();
                        guideAxes.parent = this.ecRoot;
                        var pickPlanes = this.createPickPlanes();
                        pickPlanes.parent = this.ecRoot;
                        this.pointerdown = function (evt) { return _this.onPointerDown(evt); };
                        this.pointerup = function (evt) { return _this.onPointerUp(evt); };
                        this.pointermove = function (evt) { return _this.onPointerMove(evt); };
                        //use canvas rather than scene to handle pointer events
                        //scene cannot have mutiple eventlisteners for an event
                        //with canvas one will have to do ones own pickinfo generattion.
                        canvas.addEventListener("pointerdown", this.pointerdown, false);
                        canvas.addEventListener("pointerup", this.pointerup, false);
                        canvas.addEventListener("pointermove", this.pointermove, false);
                        this.setLocalAxes(mesh);
                        this.renderer = function () { return _this.renderLoopProcess(); };
                        this.scene.registerBeforeRender(this.renderer);
                    }
                    //make sure that if eulerian is set to false then mesh's rotation is in quaternion
                    //throw error and exit if not so.
                    EditControl.prototype.checkQuaternion = function () {
                        if (!this.eulerian) {
                            if ((this.mesh.rotationQuaternion == null) || (this.mesh.rotationQuaternion == undefined)) {
                                throw "Error: Eulerian is set to false but the mesh's rotationQuaternion is not set.";
                            }
                        }
                    };
                    EditControl.prototype.setAxesScale = function () {
                        this.ecRoot.position.subtractToRef(this.mainCamera.position, this.cameraTOec);
                        Vector3.FromFloatArrayToRef(this.mainCamera.getWorldMatrix().asArray(), 8, this.cameraNormal);
                        //get distance of edit control from the camera plane 
                        //project "camera to edit control" vector onto the camera normal
                        var parentOnNormal = Vector3.Dot(this.cameraTOec, this.cameraNormal) / this.cameraNormal.length();
                        var s = Math.abs(parentOnNormal / this.distFromCamera);
                        Vector3.FromFloatsToRef(s, s, s, this.ecRoot.scaling);
                        //Vector3.FromFloatsToRef(s,s,s,this.pALL.scaling);
                    };
                    EditControl.prototype.setAxesRotation = function () {
                        if (this.local) {
                            if (this.eulerian) {
                                var rot = this.mesh.rotation;
                                this.ecRoot.rotationQuaternion.copyFrom(BABYLON.Quaternion.RotationYawPitchRoll(rot.y, rot.x, rot.z));
                            }
                            else {
                                this.ecRoot.rotationQuaternion = this.mesh.rotationQuaternion;
                            }
                        }
                    };
                    EditControl.prototype.rotRotGuides = function () {
                        if (this.local) {
                            this.ecRoot.getWorldMatrix().invertToRef(this.ecMatrix);
                            Vector3.TransformCoordinatesToRef(this.mainCamera.position, this.ecMatrix, this.ecTOcamera);
                            this.pALL.lookAt(this.ecTOcamera, 0, 0, 0, Space.LOCAL);
                        }
                        else {
                            this.mainCamera.position.subtractToRef(this.ecRoot.position, this.ecTOcamera);
                            this.pALL.lookAt(this.mainCamera.position, 0, 0, 0, Space.WORLD);
                        }
                        var rotX = Math.atan(this.ecTOcamera.y / this.ecTOcamera.z);
                        if (this.ecTOcamera.z >= 0) {
                            this.rX.rotation.x = -rotX;
                        }
                        else {
                            this.rX.rotation.x = -rotX - Math.PI;
                        }
                        var rotY = Math.atan(this.ecTOcamera.x / this.ecTOcamera.z);
                        if (this.ecTOcamera.z >= 0) {
                            this.rY.rotation.y = rotY;
                        }
                        else {
                            this.rY.rotation.y = rotY + Math.PI;
                        }
                        var rotZ = Math.atan(this.ecTOcamera.x / this.ecTOcamera.y);
                        if (this.ecTOcamera.y >= 0) {
                            this.rZ.rotation.z = -rotZ;
                        }
                        else {
                            this.rZ.rotation.z = -rotZ - Math.PI;
                        }
                    };
                    EditControl.prototype.rotPlanarGuides = function (XZ, ZY, YX) {
                        if (this.local) {
                            this.ecRoot.getWorldMatrix().invertToRef(this.ecMatrix);
                            Vector3.TransformCoordinatesToRef(this.mainCamera.position, this.ecMatrix, this.ecTOcamera);
                        }
                        else {
                            this.mainCamera.position.subtractToRef(this.ecRoot.position, this.ecTOcamera);
                        }
                        var ec = this.ecTOcamera;
                        XZ.rotation.x = 0;
                        XZ.rotation.y = 0;
                        XZ.rotation.z = 0;
                        ZY.rotation.x = 0;
                        ZY.rotation.y = 0;
                        ZY.rotation.z = 0;
                        YX.rotation.x = 0;
                        YX.rotation.y = 0;
                        YX.rotation.z = 0;
                        if (ec.x <= 0 && ec.y >= 0 && ec.z >= 0) {
                            XZ.rotation.z = 3.14;
                            YX.rotation.y = 3.14;
                        }
                        else if (ec.x <= 0 && ec.y >= 0 && ec.z <= 0) {
                            XZ.rotation.y = 3.14;
                            ZY.rotation.y = 3.14;
                            YX.rotation.y = 3.14;
                        }
                        else if (ec.x >= 0 && ec.y >= 0 && ec.z <= 0) {
                            XZ.rotation.x = 3.14;
                            ZY.rotation.y = 3.14;
                        }
                        else if (ec.x >= 0 && ec.y <= 0 && ec.z >= 0) {
                            ZY.rotation.z = 3.14;
                            YX.rotation.x = 3.14;
                        }
                        else if (ec.x <= 0 && ec.y <= 0 && ec.z >= 0) {
                            XZ.rotation.z = 3.14;
                            ZY.rotation.z = 3.14;
                            YX.rotation.z = 3.14;
                        }
                        else if (ec.x <= 0 && ec.y <= 0 && ec.z <= 0) {
                            XZ.rotation.y = 3.14;
                            ZY.rotation.x = 3.14;
                            YX.rotation.z = 3.14;
                        }
                        else if (ec.x >= 0 && ec.y <= 0 && ec.z <= 0) {
                            XZ.rotation.x = 3.14;
                            ZY.rotation.x = 3.14;
                            YX.rotation.x = 3.14;
                        }
                    };
                    EditControl.prototype.renderLoopProcess = function () {
                        this.ecRoot.position = this.mesh.getAbsolutePivotPoint();
                        this.setAxesScale();
                        this.setAxesRotation();
                        if (this.rotEnabled)
                            this.rotRotGuides();
                        else if (this.transEnabled)
                            this.rotPlanarGuides(this.tXZ, this.tZY, this.tYX);
                        else if (this.scaleEnabled)
                            this.rotPlanarGuides(this.sXZ, this.sZY, this.sYX);
                        //check pointer over axes only during pointer moves
                        //this.onPointerOver();
                    };
                    EditControl.prototype.switchTo = function (mesh, eulerian) {
                        mesh.computeWorldMatrix(true);
                        this.mesh = mesh;
                        if (eulerian != null) {
                            this.eulerian = eulerian;
                        }
                        this.checkQuaternion();
                        this.setLocalAxes(mesh);
                        this.actHist = new ActHist(mesh, 10);
                    };
                    EditControl.prototype.setUndoCount = function (c) {
                        this.actHist.setCapacity(c);
                    };
                    EditControl.prototype.undo = function () {
                        var at = this.actHist.undo();
                        this.mesh.computeWorldMatrix(true);
                        this.setLocalAxes(this.mesh);
                        this.callActionStartListener(at);
                        this.callActionListener(at);
                        this.callActionEndListener(at);
                    };
                    EditControl.prototype.redo = function () {
                        var at = this.actHist.redo();
                        this.mesh.computeWorldMatrix(true);
                        this.setLocalAxes(this.mesh);
                        this.callActionStartListener(at);
                        this.callActionListener(at);
                        this.callActionEndListener(at);
                    };
                    /**
                     * detach the edit control from the mesh and dispose off all
                     * resources created by the edit control
                     */
                    EditControl.prototype.detach = function () {
                        this.canvas.removeEventListener("pointerdown", this.pointerdown, false);
                        this.canvas.removeEventListener("pointerup", this.pointerup, false);
                        this.canvas.removeEventListener("pointermove", this.pointermove, false);
                        this.scene.unregisterBeforeRender(this.renderer);
                        this.removeAllActionListeners();
                        this.disposeAll();
                    };
                    /**
                     * hide the edit control. use show() to unhide the control.
                     */
                    EditControl.prototype.hide = function () {
                        this.hidden = true;
                        if (this.transEnabled) {
                            this.prevState = "T";
                            this.disableTranslation();
                        }
                        else if (this.rotEnabled) {
                            this.prevState = "R";
                            this.disableRotation();
                        }
                        else if (this.scaleEnabled) {
                            this.prevState = "S";
                            this.disableScaling();
                        }
                        this.hideCommonAxes();
                    };
                    EditControl.prototype.hideCommonAxes = function () {
                        this.xaxis.visibility = 0;
                        this.yaxis.visibility = 0;
                        this.zaxis.visibility = 0;
                    };
                    EditControl.prototype.showCommonAxes = function () {
                        this.xaxis.visibility = this.visibility;
                        this.yaxis.visibility = this.visibility;
                        this.zaxis.visibility = this.visibility;
                    };
                    /**
                     * unhide the editcontrol hidden using the hide() method
                     */
                    EditControl.prototype.show = function () {
                        this.hidden = false;
                        this.showCommonAxes();
                        if (this.prevState == "T")
                            this.enableTranslation();
                        else if (this.prevState == "R")
                            this.enableRotation();
                        else if (this.prevState == "S")
                            this.enableScaling();
                    };
                    /**
                     * check if the editcontrol was hidden using the hide() methods
                     */
                    EditControl.prototype.isHidden = function () {
                        return this.hidden;
                    };
                    EditControl.prototype.disposeAll = function () {
                        this.ecRoot.dispose();
                        this.disposeMaterials();
                        this.actHist = null;
                    };
                    EditControl.prototype.addActionListener = function (actionListener) {
                        this.actionListener = actionListener;
                    };
                    EditControl.prototype.removeActionListener = function () {
                        this.actionListener = null;
                    };
                    EditControl.prototype.addActionStartListener = function (actionStartListener) {
                        this.actionStartListener = actionStartListener;
                    };
                    EditControl.prototype.removeActionStartListener = function () {
                        this.actionStartListener = null;
                    };
                    EditControl.prototype.addActionEndListener = function (actionEndListener) {
                        this.actionEndListener = actionEndListener;
                    };
                    EditControl.prototype.removeActionEndListener = function () {
                        this.actionEndListener = null;
                    };
                    EditControl.prototype.removeAllActionListeners = function () {
                        this.actionListener = null;
                        this.actionStartListener = null;
                        this.actionEndListener = null;
                    };
                    EditControl.prototype.onPointerDown = function (evt) {
                        var _this = this;
                        evt.preventDefault();
                        this.pDown = true;
                        if (evt.button != 0)
                            return;
                        //TODO: do we really need to do a pick here?
                        //onPointerOver() has already done this.
                        var pickResult = this.scene.pick(this.scene.pointerX, this.scene.pointerY, function (mesh) {
                            if (_this.transEnabled) {
                                if ((mesh == _this.tX) || (mesh == _this.tY) || (mesh == _this.tZ) || (mesh == _this.tXZ) || (mesh == _this.tZY) || (mesh == _this.tYX) || (mesh == _this.tAll))
                                    return true;
                            }
                            else if ((_this.rotEnabled)) {
                                if ((mesh == _this.rX) || (mesh == _this.rY) || (mesh == _this.rZ) || (mesh == _this.rAll))
                                    return true;
                            }
                            else if ((_this.scaleEnabled)) {
                                if ((mesh == _this.sX) || (mesh == _this.sY) || (mesh == _this.sZ) || (mesh == _this.sXZ) || (mesh == _this.sZY) || (mesh == _this.sYX) || (mesh == _this.sAll))
                                    return true;
                            }
                            return false;
                        }, null, this.mainCamera);
                        if (pickResult.hit) {
                            //this.setAxesVisiblity(0);
                            this.axisPicked = pickResult.pickedMesh;
                            var childs = this.axisPicked.getChildren();
                            if (childs.length > 0) {
                                childs[0].visibility = this.visibility;
                            }
                            else {
                                this.axisPicked.visibility = this.visibility;
                            }
                            var name_1 = this.axisPicked.name;
                            if ((name_1 == "X"))
                                this.bXaxis.visibility = 1;
                            else if ((name_1 == "Y"))
                                this.bYaxis.visibility = 1;
                            else if ((name_1 == "Z"))
                                this.bZaxis.visibility = 1;
                            else if ((name_1 == "XZ")) {
                                this.bXaxis.visibility = 1;
                                this.bZaxis.visibility = 1;
                            }
                            else if ((name_1 == "ZY")) {
                                this.bZaxis.visibility = 1;
                                this.bYaxis.visibility = 1;
                            }
                            else if ((name_1 == "YX")) {
                                this.bYaxis.visibility = 1;
                                this.bXaxis.visibility = 1;
                            }
                            else if ((name_1 == "ALL")) {
                                this.bXaxis.visibility = 1;
                                this.bYaxis.visibility = 1;
                                this.bZaxis.visibility = 1;
                            }
                            this.setEditing(true);
                            //lets find out where we are on the pickplane
                            this.pickedPlane = this.getPickPlane(this.axisPicked);
                            if (this.pickedPlane != null) {
                                this.prevPos = this.getPosOnPickPlane();
                            }
                            else {
                                this.prevPos = null;
                            }
                            window.setTimeout((function (cam, can) { return _this.detachCamera(cam, can); }), 0, this.mainCamera, this.canvas);
                        }
                    };
                    EditControl.prototype.setEditing = function (editing) {
                        this.editing = editing;
                        if (editing) {
                            this.setActionType();
                            this.callActionStartListener(this.actionType);
                        }
                        else {
                            this.callActionEndListener(this.actionType);
                        }
                    };
                    EditControl.prototype.isEditing = function () {
                        return this.editing;
                    };
                    /**
                     * no camera movement during edit
                     */
                    EditControl.prototype.detachCamera = function (cam, can) {
                        var camera = cam;
                        var canvas = can;
                        camera.detachControl(canvas);
                    };
                    EditControl.prototype.isPointerOver = function () {
                        return this.pointerIsOver;
                    };
                    EditControl.prototype.onPointerOver = function () {
                        var _this = this;
                        //if(this.pDown) return;
                        var pickResult = this.scene.pick(this.scene.pointerX, this.scene.pointerY, function (mesh) {
                            if (_this.transEnabled) {
                                if ((mesh == _this.tX) || (mesh == _this.tY) || (mesh == _this.tZ) || (mesh == _this.tXZ) || (mesh == _this.tZY) || (mesh == _this.tYX) || (mesh == _this.tAll))
                                    return true;
                            }
                            else if ((_this.rotEnabled)) {
                                if ((mesh == _this.rX) || (mesh == _this.rY) || (mesh == _this.rZ) || (mesh == _this.rAll))
                                    return true;
                            }
                            else if (_this.scaleEnabled) {
                                if ((mesh == _this.sX) || (mesh == _this.sY) || (mesh == _this.sZ) || (mesh == _this.sXZ) || (mesh == _this.sZY) || (mesh == _this.sYX) || (mesh == _this.sAll))
                                    return true;
                            }
                            return false;
                        }, null, this.mainCamera);
                        if (pickResult.hit) {
                            //if we are still over the same axis mesh then don't do anything
                            if (pickResult.pickedMesh != this.prevOverMesh) {
                                this.pointerIsOver = true;
                                //if we moved directly from one axis mesh to this then clean up the prev axis mesh
                                this.clearPrevOverMesh();
                                this.prevOverMesh = pickResult.pickedMesh;
                                if (this.rotEnabled) {
                                    this.savedCol = this.prevOverMesh.getChildren()[0].color;
                                    this.prevOverMesh.getChildren()[0].color = Color3.White();
                                }
                                else {
                                    var childs = this.prevOverMesh.getChildren();
                                    if (childs.length > 0) {
                                        this.savedMat = childs[0].material;
                                        childs[0].material = this.whiteMat;
                                    }
                                    else {
                                        this.savedMat = this.prevOverMesh.material;
                                        this.prevOverMesh.material = this.whiteMat;
                                    }
                                }
                                if (this.prevOverMesh.name == "X") {
                                    this.xaxis.color = Color3.White();
                                }
                                else if (this.prevOverMesh.name == "Y") {
                                    this.yaxis.color = Color3.White();
                                }
                                else if (this.prevOverMesh.name == "Z") {
                                    this.zaxis.color = Color3.White();
                                }
                            }
                        }
                        else {
                            this.pointerIsOver = false;
                            if (this.prevOverMesh != null) {
                                this.restoreColor(this.prevOverMesh);
                                this.prevOverMesh = null;
                            }
                        }
                    };
                    //clean up any axis we might have been howering over before
                    EditControl.prototype.clearPrevOverMesh = function () {
                        if (this.prevOverMesh != null) {
                            this.prevOverMesh.visibility = 0;
                            this.restoreColor(this.prevOverMesh);
                        }
                    };
                    EditControl.prototype.restoreColor = function (mesh) {
                        switch (mesh.name) {
                            case "X":
                                this.xaxis.color = Color3.Red();
                                break;
                            case "Y":
                                this.yaxis.color = Color3.Green();
                                break;
                            case "Z":
                                this.zaxis.color = Color3.Blue();
                                break;
                        }
                        if (this.rotEnabled) {
                            mesh.getChildren()[0].color = this.savedCol;
                        }
                        else {
                            var childs = mesh.getChildren();
                            if (childs.length > 0) {
                                childs[0].material = this.savedMat;
                            }
                            else {
                                mesh.material = this.savedMat;
                            }
                        }
                    };
                    EditControl.prototype.onPointerUp = function (evt) {
                        this.pDown = false;
                        if (this.editing) {
                            this.mainCamera.attachControl(this.canvas);
                            this.setEditing(false);
                            //this.setAxesVisiblity(1);
                            this.hideBaxis();
                            if (this.prevOverMesh != null) {
                                this.restoreColor(this.prevOverMesh);
                                this.prevOverMesh = null;
                            }
                            this.actHist.add(this.actionType);
                        }
                    };
                    EditControl.prototype.setActionType = function () {
                        if (this.transEnabled) {
                            this.actionType = ActionType.TRANS;
                        }
                        else if ((this.rotEnabled)) {
                            this.actionType = ActionType.ROT;
                        }
                        else if ((this.scaleEnabled)) {
                            this.actionType = ActionType.SCALE;
                        }
                    };
                    EditControl.prototype.callActionListener = function (at) {
                        //call actionListener if registered
                        if (this.actionListener != null) {
                            //window.setTimeout(this.actionListener,0,at);
                            this.actionListener(at);
                        }
                    };
                    EditControl.prototype.callActionStartListener = function (at) {
                        //call actionListener if registered
                        if (this.actionStartListener != null) {
                            //                window.setTimeout(this.actionStartListener,0,at);
                            this.actionStartListener(at);
                        }
                    };
                    EditControl.prototype.callActionEndListener = function (at) {
                        //call actionListener if registered
                        if (this.actionEndListener != null) {
                            //                window.setTimeout(this.actionEndListener,0,at);
                            this.actionEndListener(at);
                        }
                    };
                    EditControl.prototype.onPointerMove = function (evt) {
                        if (!this.pDown) {
                            this.onPointerOver();
                            return;
                        }
                        if (!this.editing)
                            return;
                        if (this.prevPos == null)
                            return;
                        //this.pickPlane=this.getPickPlane(this.axisPicked);
                        var newPos = this.getPosOnPickPlane();
                        if (newPos == null)
                            return;
                        if (this.rotEnabled) {
                            this.doRotation(this.mesh, this.axisPicked, newPos, this.prevPos);
                        }
                        else {
                            var diff = newPos.subtract(this.prevPos);
                            if (diff.x == 0 && diff.y == 0 && diff.z == 0)
                                return;
                            if (this.transEnabled) {
                                this.doTranslation(diff);
                            }
                            else {
                                if (this.scaleEnabled && this.local)
                                    this.doScaling(diff);
                            }
                        }
                        this.prevPos = newPos;
                        this.callActionListener(this.actionType);
                    };
                    EditControl.prototype.getPickPlane = function (axis) {
                        var n = axis.name;
                        if (this.transEnabled || this.scaleEnabled) {
                            if (n == "XZ")
                                return this.pXZ;
                            else if (n == "ZY")
                                return this.pZY;
                            else if (n == "YX")
                                return this.pYX;
                            else if (n == "ALL")
                                return this.pALL;
                            else {
                                //get the position of camera in the edit control frame of reference
                                this.ecRoot.getWorldMatrix().invertToRef(this.ecMatrix);
                                Vector3.TransformCoordinatesToRef(this.mainCamera.position, this.ecMatrix, this.ecTOcamera);
                                var c = this.ecTOcamera;
                                if (n === "X") {
                                    if (Math.abs(c.y) > Math.abs(c.z)) {
                                        return this.pXZ;
                                    }
                                    else
                                        return this.pYX;
                                }
                                else if (n === "Z") {
                                    if (Math.abs(c.y) > Math.abs(c.x)) {
                                        return this.pXZ;
                                    }
                                    else
                                        return this.pZY;
                                }
                                else if (n === "Y") {
                                    if (Math.abs(c.z) > Math.abs(c.x)) {
                                        return this.pYX;
                                    }
                                    else
                                        return this.pZY;
                                }
                            }
                        }
                        else if (this.rotEnabled) {
                            this.rotate2 = false;
                            //get the position of camera in the edit control frame of reference
                            this.ecRoot.getWorldMatrix().invertToRef(this.ecMatrix);
                            Vector3.TransformCoordinatesToRef(this.mainCamera.position, this.ecMatrix, this.ecTOcamera);
                            var c = this.ecTOcamera;
                            //if camera is too close to the rotation plane then use alternate rotation process
                            switch (n) {
                                case "X":
                                    if (Math.abs(c.x) < 0.2) {
                                        this.rotate2 = true;
                                        return this.pALL;
                                    }
                                    else
                                        return this.pZY;
                                case "Y":
                                    if (Math.abs(c.y) < 0.2) {
                                        this.rotate2 = true;
                                        return this.pALL;
                                    }
                                    else
                                        return this.pXZ;
                                case "Z":
                                    if (Math.abs(c.z) < 0.2) {
                                        this.rotate2 = true;
                                        return this.pALL;
                                    }
                                    else
                                        return this.pYX;
                                default:
                                    return this.pALL;
                            }
                        }
                        else
                            return null;
                    };
                    EditControl.prototype.doTranslation = function (diff) {
                        this.transBy.x = 0;
                        this.transBy.y = 0;
                        this.transBy.z = 0;
                        var n = this.axisPicked.name;
                        if ((n == "X") || (n == "XZ") || (n == "YX") || (n == "ALL")) {
                            if (this.local)
                                this.transBy.x = Vector3.Dot(diff, this.localX) / (this.localX.length() * this.mesh.scaling.x);
                            else
                                this.transBy.x = diff.x;
                        }
                        if ((n == "Y") || (n == "ZY") || (n == "YX") || (n == "ALL")) {
                            if (this.local)
                                this.transBy.y = Vector3.Dot(diff, this.localY) / (this.localY.length() * this.mesh.scaling.y);
                            else
                                this.transBy.y = diff.y;
                        }
                        if ((n == "Z") || (n == "XZ") || (n == "ZY") || (n == "ALL")) {
                            if (this.local)
                                this.transBy.z = Vector3.Dot(diff, this.localZ) / (this.localZ.length() * this.mesh.scaling.z);
                            else
                                this.transBy.z = diff.z;
                        }
                        this.transWithSnap(this.mesh, this.transBy, this.local);
                        // bound the translation
                        if (this.transBoundsMin) {
                            this.mesh.position.x = Math.max(this.mesh.position.x, this.transBoundsMin.x);
                            this.mesh.position.y = Math.max(this.mesh.position.y, this.transBoundsMin.y);
                            this.mesh.position.z = Math.max(this.mesh.position.z, this.transBoundsMin.z);
                        }
                        if (this.transBoundsMax) {
                            this.mesh.position.x = Math.min(this.mesh.position.x, this.transBoundsMax.x);
                            this.mesh.position.y = Math.min(this.mesh.position.y, this.transBoundsMax.y);
                            this.mesh.position.z = Math.min(this.mesh.position.z, this.transBoundsMax.z);
                        }
                        this.mesh.computeWorldMatrix(true);
                    };
                    EditControl.prototype.transWithSnap = function (mesh, trans, local) {
                        if (this.snapT) {
                            var snapit = false;
                            this.snapTV.addInPlace(trans);
                            if (Math.abs(this.snapTV.x) > (this.tSnap.x / mesh.scaling.x)) {
                                if (this.snapTV.x > 0)
                                    trans.x = this.tSnap.x;
                                else
                                    trans.x = -this.tSnap.x;
                                trans.x = trans.x / mesh.scaling.x;
                                snapit = true;
                            }
                            if (Math.abs(this.snapTV.y) > (this.tSnap.y / mesh.scaling.y)) {
                                if (this.snapTV.y > 0)
                                    trans.y = this.tSnap.y;
                                else
                                    trans.y = -this.tSnap.y;
                                trans.y = trans.y / mesh.scaling.y;
                                snapit = true;
                            }
                            if (Math.abs(this.snapTV.z) > (this.tSnap.z / mesh.scaling.z)) {
                                if (this.snapTV.z > 0)
                                    trans.z = this.tSnap.z;
                                else
                                    trans.z = -this.tSnap.z;
                                trans.z = trans.z / mesh.scaling.z;
                                snapit = true;
                            }
                            if (!snapit)
                                return;
                            if (Math.abs(trans.x) !== this.tSnap.x / mesh.scaling.x)
                                trans.x = 0;
                            if (Math.abs(trans.y) !== this.tSnap.y / mesh.scaling.y)
                                trans.y = 0;
                            if (Math.abs(trans.z) !== this.tSnap.z / mesh.scaling.z)
                                trans.z = 0;
                            Vector3.FromFloatsToRef(0, 0, 0, this.snapTV);
                            snapit = false;
                        }
                        if (local) {
                            //locallyTranslate moves the mesh wrt the absolute location not pivotlocation :(
                            //this.mesh.locallyTranslate(trans);
                            this.mesh.translate(Axis.X, trans.x, Space.LOCAL);
                            this.mesh.translate(Axis.Y, trans.y, Space.LOCAL);
                            this.mesh.translate(Axis.Z, trans.z, Space.LOCAL);
                        }
                        else {
                            this.mesh.position.addInPlace(trans);
                        }
                    };
                    EditControl.prototype.doScaling = function (diff) {
                        this.scale.x = 0;
                        this.scale.y = 0;
                        this.scale.z = 0;
                        var n = this.axisPicked.name;
                        if ((n == "X") || (n == "XZ") || (n == "YX")) {
                            this.scale.x = Vector3.Dot(diff, this.localX) / this.localX.length();
                        }
                        if ((n == "Y") || (n == "ZY") || (n == "YX")) {
                            this.scale.y = Vector3.Dot(diff, this.localY) / this.localY.length();
                        }
                        if ((n == "Z") || (n == "XZ") || (n == "ZY")) {
                            this.scale.z = Vector3.Dot(diff, this.localZ) / this.localZ.length();
                        }
                        //as the mesh becomes large reduce the amount by which we scale.
                        var bbd = this.boundingDimesion;
                        this.scale.x = this.scale.x / bbd.x;
                        this.scale.y = this.scale.y / bbd.y;
                        this.scale.z = this.scale.z / bbd.z;
                        if (n == "ALL") {
                            //project movement along camera up vector
                            var s = Vector3.Dot(diff, this.mainCamera.upVector);
                            s = s / Math.max(bbd.x, bbd.y, bbd.z);
                            this.scale.copyFromFloats(s, s, s);
                        }
                        else {
                            if (n == "XZ") {
                                if (Math.abs(this.scale.x) > Math.abs(this.scale.z)) {
                                    this.scale.z = this.scale.x;
                                }
                                else
                                    this.scale.x = this.scale.z;
                            }
                            else if (n == "ZY") {
                                if (Math.abs(this.scale.z) > Math.abs(this.scale.y)) {
                                    this.scale.y = this.scale.z;
                                }
                                else
                                    this.scale.z = this.scale.y;
                            }
                            else if (n == "YX") {
                                if (Math.abs(this.scale.y) > Math.abs(this.scale.x)) {
                                    this.scale.x = this.scale.y;
                                }
                                else
                                    this.scale.y = this.scale.x;
                            }
                        }
                        this.scaleWithSnap(this.mesh, this.scale);
                        // bound the scale
                        if (this.scaleBoundsMin) {
                            this.mesh.scaling.x = Math.max(this.mesh.scaling.x, this.scaleBoundsMin.x);
                            this.mesh.scaling.y = Math.max(this.mesh.scaling.y, this.scaleBoundsMin.y);
                            this.mesh.scaling.z = Math.max(this.mesh.scaling.z, this.scaleBoundsMin.z);
                        }
                        if (this.scaleBoundsMax) {
                            this.mesh.scaling.x = Math.min(this.mesh.scaling.x, this.scaleBoundsMax.x);
                            this.mesh.scaling.y = Math.min(this.mesh.scaling.y, this.scaleBoundsMax.y);
                            this.mesh.scaling.z = Math.min(this.mesh.scaling.z, this.scaleBoundsMax.z);
                        }
                    };
                    EditControl.prototype.scaleWithSnap = function (mesh, p) {
                        if (this.snapS) {
                            var snapit = false;
                            this.snapSV.addInPlace(p);
                            if (Math.abs(this.snapSV.x) > this.scaleSnap) {
                                if (p.x > 0)
                                    p.x = this.scaleSnap;
                                else
                                    p.x = -this.scaleSnap;
                                snapit = true;
                            }
                            if (Math.abs(this.snapSV.y) > this.scaleSnap) {
                                if (p.y > 0)
                                    p.y = this.scaleSnap;
                                else
                                    p.y = -this.scaleSnap;
                                snapit = true;
                            }
                            if (Math.abs(this.snapSV.z) > this.scaleSnap) {
                                if (p.z > 0)
                                    p.z = this.scaleSnap;
                                else
                                    p.z = -this.scaleSnap;
                                snapit = true;
                            }
                            if (!snapit)
                                return;
                            if ((Math.abs(p.x) !== this.scaleSnap) && (p.x !== 0))
                                p.x = 0;
                            if ((Math.abs(p.y) !== this.scaleSnap) && (p.y !== 0))
                                p.y = 0;
                            if ((Math.abs(p.z) !== this.scaleSnap) && (p.z !== 0))
                                p.z = 0;
                            Vector3.FromFloatsToRef(0, 0, 0, this.snapSV);
                            snapit = false;
                        }
                        mesh.scaling.addInPlace(p);
                    };
                    EditControl.prototype.getBoundingDimension = function (mesh) {
                        var bb = mesh.getBoundingInfo().boundingBox;
                        var bd = bb.maximum.subtract(bb.minimum);
                        if (bd.x == 0)
                            bd.x = 1;
                        if (bd.y == 0)
                            bd.y = 1;
                        if (bd.z == 0)
                            bd.z = 1;
                        return bd;
                    };
                    /*
                     *
                     * For the sake of speed the editcontrol calculates bounding info only once.
                     * This is in the constructor.
                     * Now The boundingbox dimension can change if the mesh is baked.
                     * If the editcontrol is attached to the mesh when the mesh was baked then
                     * the scaling speed will be incorrect.
                     * Thus client application should call refreshBoundingInfo if it bakes the mesh.
                     *
                     */
                    EditControl.prototype.refreshBoundingInfo = function () {
                        this.boundingDimesion = this.getBoundingDimension(this.mesh);
                    };
                    EditControl.prototype.doRotation = function (mesh, axis, newPos, prevPos) {
                        var angle = 0;
                        //rotation axis
                        var rAxis;
                        if (axis == this.rX)
                            rAxis = this.local ? this.localX : Axis.X;
                        else if (axis == this.rY)
                            rAxis = this.local ? this.localY : Axis.Y;
                        else if (axis == this.rZ)
                            rAxis = this.local ? this.localZ : Axis.Z;
                        this.ecRoot.position.subtractToRef(this.mainCamera.position, this.cameraTOec);
                        /**
                         * A)first find the angle and the direction (clockwise or anticlockwise) by which the user was trying to rotate
                         * from the user(camera) perspective
                         */
                        if (this.rotate2) {
                            angle = this.getAngle2(prevPos, newPos, this.mainCamera.position, this.cameraTOec, rAxis);
                        }
                        else {
                            angle = this.getAngle(prevPos, newPos, mesh.getAbsolutePivotPoint(), this.cameraTOec);
                        }
                        /**
                         * B)then rotate based on users(camera) postion and orientation in the local/world space
                         *
                         */
                        this.cameraTOec.normalize();
                        if (axis == this.rX) {
                            if (this.snapR) {
                                this.snapRX += angle;
                                angle = 0;
                                if (Math.abs(this.snapRX) >= this.rotSnap) {
                                    if ((this.snapRX > 0))
                                        angle = this.rotSnap;
                                    else
                                        angle = -this.rotSnap;
                                    this.snapRX = 0;
                                }
                            }
                            if (angle !== 0) {
                                if (Vector3.Dot(rAxis, this.cameraTOec) >= 0)
                                    angle = -1 * angle;
                                mesh.rotate(rAxis, angle, Space.WORLD);
                            }
                        }
                        else if (axis == this.rY) {
                            if (this.snapR) {
                                this.snapRY += angle;
                                angle = 0;
                                if (Math.abs(this.snapRY) >= this.rotSnap) {
                                    if ((this.snapRY > 0))
                                        angle = this.rotSnap;
                                    else
                                        angle = -this.rotSnap;
                                    this.snapRY = 0;
                                }
                            }
                            if (angle !== 0) {
                                if (angle !== 0) {
                                    if (Vector3.Dot(rAxis, this.cameraTOec) >= 0)
                                        angle = -1 * angle;
                                    mesh.rotate(rAxis, angle, Space.WORLD);
                                }
                            }
                        }
                        else if (axis == this.rZ) {
                            if (this.snapR) {
                                this.snapRZ += angle;
                                angle = 0;
                                if (Math.abs(this.snapRZ) >= this.rotSnap) {
                                    if (this.snapRZ > 0)
                                        angle = this.rotSnap;
                                    else
                                        angle = -this.rotSnap;
                                    this.snapRZ = 0;
                                }
                            }
                            if (angle !== 0) {
                                if (angle !== 0) {
                                    if (Vector3.Dot(rAxis, this.cameraTOec) >= 0)
                                        angle = -1 * angle;
                                    mesh.rotate(rAxis, angle, Space.WORLD);
                                }
                            }
                        }
                        else if (axis == this.rAll) {
                            if (this.snapR) {
                                this.snapRA += angle;
                                angle = 0;
                                if (Math.abs(this.snapRA) >= this.rotSnap) {
                                    if (this.snapRA > 0)
                                        angle = this.rotSnap;
                                    else
                                        angle = -this.rotSnap;
                                    this.snapRA = 0;
                                }
                            }
                            if (angle !== 0) {
                                mesh.rotate(this.cameraTOec, -angle, Space.WORLD);
                            }
                        }
                        this.setLocalAxes(this.mesh);
                        //if angle is zero then we did not rotate and thus angle would already be in euler if we are eulerian
                        if (this.eulerian && angle != 0) {
                            mesh.rotation = mesh.rotationQuaternion.toEulerAngles();
                            mesh.rotationQuaternion = null;
                        }
                    };
                    EditControl.prototype.doRotation_old = function (mesh, axis, newPos, prevPos) {
                        //donot want to type this.cN everywhere
                        var cN = this.cN;
                        var angle = 0;
                        Vector3.FromFloatArrayToRef(this.mainCamera.getWorldMatrix().asArray(), 8, cN);
                        //first find the angle and the direction (clockwise or anticlockwise) by which the user was trying to rotate
                        //from the user(camera) perspective
                        if (this.rotate2) {
                            angle = this.getAngle2(prevPos, newPos, mesh.getAbsolutePivotPoint(), cN, this.localX);
                        }
                        else {
                            angle = this.getAngle(prevPos, newPos, mesh.getAbsolutePivotPoint(), cN);
                        }
                        //then rotate based on users(camera) postion and orientation in the local/world space
                        if (axis == this.rX) {
                            if (this.snapR) {
                                this.snapRX += angle;
                                angle = 0;
                                if (Math.abs(this.snapRX) >= this.rotSnap) {
                                    if ((this.snapRX > 0))
                                        angle = this.rotSnap;
                                    else
                                        angle = -this.rotSnap;
                                    this.snapRX = 0;
                                }
                            }
                            if (angle !== 0) {
                                if (this.local) {
                                    if (Vector3.Dot(this.localX, cN) < 0)
                                        angle = -1 * angle;
                                    mesh.rotate(Axis.X, angle, Space.LOCAL);
                                }
                                else {
                                    this.rotAxis.x = cN.x;
                                    this.rotAxis.y = 0;
                                    this.rotAxis.z = 0;
                                    mesh.rotate(this.rotAxis, angle, Space.WORLD);
                                }
                            }
                        }
                        else if (axis == this.rY) {
                            if (this.snapR) {
                                this.snapRY += angle;
                                angle = 0;
                                if (Math.abs(this.snapRY) >= this.rotSnap) {
                                    if ((this.snapRY > 0))
                                        angle = this.rotSnap;
                                    else
                                        angle = -this.rotSnap;
                                    this.snapRY = 0;
                                }
                            }
                            if (angle !== 0) {
                                if (this.local) {
                                    if (Vector3.Dot(this.localY, cN) < 0)
                                        angle = -1 * angle;
                                    mesh.rotate(Axis.Y, angle, Space.LOCAL);
                                }
                                else {
                                    this.rotAxis.x = 0;
                                    this.rotAxis.y = cN.y;
                                    this.rotAxis.z = 0;
                                    mesh.rotate(this.rotAxis, angle, Space.WORLD);
                                }
                            }
                        }
                        else if (axis == this.rZ) {
                            if (this.snapR) {
                                this.snapRZ += angle;
                                angle = 0;
                                if (Math.abs(this.snapRZ) >= this.rotSnap) {
                                    if (this.snapRZ > 0)
                                        angle = this.rotSnap;
                                    else
                                        angle = -this.rotSnap;
                                    this.snapRZ = 0;
                                }
                            }
                            if (angle !== 0) {
                                if (this.local) {
                                    if (Vector3.Dot(this.localZ, cN) < 0)
                                        angle = -1 * angle;
                                    mesh.rotate(Axis.Z, angle, Space.LOCAL);
                                }
                                else {
                                    this.rotAxis.x = 0;
                                    this.rotAxis.y = 0;
                                    this.rotAxis.z = cN.z;
                                    mesh.rotate(this.rotAxis, angle, Space.WORLD);
                                }
                            }
                        }
                        else if (axis == this.rAll) {
                            if (this.snapR) {
                                this.snapRA += angle;
                                angle = 0;
                                if (Math.abs(this.snapRA) >= this.rotSnap) {
                                    if (this.snapRA > 0)
                                        angle = this.rotSnap;
                                    else
                                        angle = -this.rotSnap;
                                    this.snapRA = 0;
                                }
                            }
                            if (angle !== 0) {
                                if (this.scene.useRightHandedSystem)
                                    angle = -angle;
                                mesh.rotate(mesh.position.subtract(this.mainCamera.position), angle, Space.WORLD);
                            }
                        }
                        this.setLocalAxes(this.mesh);
                        //we angle is zero then we did not rotate and thus angle would already be in euler if we are eulerian
                        if (this.eulerian && angle != 0) {
                            mesh.rotation = mesh.rotationQuaternion.toEulerAngles();
                            mesh.rotationQuaternion = null;
                        }
                    };
                    EditControl.prototype.getPosOnPickPlane = function () {
                        var _this = this;
                        var pickinfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY, function (mesh) {
                            return mesh == _this.pickedPlane;
                        }, null, this.mainCamera);
                        if (pickinfo.hit) {
                            return pickinfo.pickedPoint;
                        }
                        else {
                            return null;
                        }
                    };
                    EditControl.prototype.hideBaxis = function () {
                        this.bXaxis.visibility = 0;
                        this.bYaxis.visibility = 0;
                        this.bZaxis.visibility = 0;
                    };
                    EditControl.prototype.setAxesVisiblity = function (v) {
                        if (this.transEnabled) {
                            this.tEndX.visibility = v;
                            this.tEndY.visibility = v;
                            this.tEndZ.visibility = v;
                            this.tEndXZ.visibility = v;
                            this.tEndZY.visibility = v;
                            this.tEndYX.visibility = v;
                            this.tEndAll.visibility = v;
                        }
                        if (this.rotEnabled) {
                            this.rEndX.visibility = v;
                            this.rEndY.visibility = v;
                            this.rEndZ.visibility = v;
                            this.rEndAll.visibility = v;
                        }
                        if (this.scaleEnabled) {
                            this.sEndX.visibility = v;
                            this.sEndY.visibility = v;
                            this.sEndZ.visibility = v;
                            this.sEndXZ.visibility = v;
                            this.sEndZY.visibility = v;
                            this.sEndYX.visibility = v;
                            this.sEndAll.visibility = v;
                        }
                    };
                    EditControl.prototype.getRotationQuaternion = function () {
                        return this.ecRoot.rotationQuaternion;
                    };
                    EditControl.prototype.getPosition = function () {
                        return this.ecRoot.position;
                    };
                    EditControl.prototype.isTranslationEnabled = function () {
                        return this.transEnabled;
                    };
                    EditControl.prototype.enableTranslation = function () {
                        if ((this.tX == null)) {
                            this.createTransAxes();
                            this.tCtl.parent = this.ecRoot;
                        }
                        this.clearPrevOverMesh();
                        if (!this.transEnabled) {
                            this.tEndX.visibility = this.visibility;
                            this.tEndY.visibility = this.visibility;
                            this.tEndZ.visibility = this.visibility;
                            this.tEndXZ.visibility = this.visibility;
                            this.tEndZY.visibility = this.visibility;
                            this.tEndYX.visibility = this.visibility;
                            this.tEndAll.visibility = this.visibility;
                            this.transEnabled = true;
                            this.disableRotation();
                            this.disableScaling();
                        }
                    };
                    EditControl.prototype.disableTranslation = function () {
                        if (this.transEnabled) {
                            this.tEndX.visibility = 0;
                            this.tEndY.visibility = 0;
                            this.tEndZ.visibility = 0;
                            this.tEndXZ.visibility = 0;
                            this.tEndZY.visibility = 0;
                            this.tEndYX.visibility = 0;
                            this.tEndAll.visibility = 0;
                            this.transEnabled = false;
                        }
                    };
                    EditControl.prototype.isRotationEnabled = function () {
                        return this.rotEnabled;
                    };
                    EditControl.prototype.returnEuler = function (euler) {
                        this.eulerian = euler;
                    };
                    EditControl.prototype.enableRotation = function () {
                        //if(this.rX==null) {
                        if (this.rCtl == null) {
                            this.createRotAxes();
                            this.rCtl.parent = this.ecRoot;
                        }
                        this.clearPrevOverMesh();
                        if (!this.rotEnabled) {
                            this.rEndX.visibility = this.visibility;
                            this.rEndY.visibility = this.visibility;
                            this.rEndZ.visibility = this.visibility;
                            this.rEndAll.visibility = this.visibility;
                            this.rEndAll2.visibility = this.visibility;
                            this.rotEnabled = true;
                            this.disableTranslation();
                            this.disableScaling();
                        }
                    };
                    EditControl.prototype.disableRotation = function () {
                        if (this.rotEnabled) {
                            this.rEndX.visibility = 0;
                            this.rEndY.visibility = 0;
                            this.rEndZ.visibility = 0;
                            this.rEndAll.visibility = 0;
                            this.rEndAll2.visibility = 0;
                            this.rotEnabled = false;
                        }
                    };
                    EditControl.prototype.isScalingEnabled = function () {
                        return this.scaleEnabled;
                    };
                    EditControl.prototype.enableScaling = function () {
                        if (this.sX == null) {
                            this.createScaleAxes();
                            this.sCtl.parent = this.ecRoot;
                        }
                        this.clearPrevOverMesh();
                        if (!this.scaleEnabled) {
                            this.sEndX.visibility = this.visibility;
                            this.sEndY.visibility = this.visibility;
                            this.sEndZ.visibility = this.visibility;
                            this.sEndXZ.visibility = this.visibility;
                            this.sEndZY.visibility = this.visibility;
                            this.sEndYX.visibility = this.visibility;
                            this.sEndAll.visibility = this.visibility;
                            this.scaleEnabled = true;
                            this.disableTranslation();
                            this.disableRotation();
                        }
                    };
                    EditControl.prototype.disableScaling = function () {
                        if (this.scaleEnabled) {
                            this.sEndX.visibility = 0;
                            this.sEndY.visibility = 0;
                            this.sEndZ.visibility = 0;
                            this.sEndXZ.visibility = 0;
                            this.sEndZY.visibility = 0;
                            this.sEndYX.visibility = 0;
                            this.sEndAll.visibility = 0;
                            this.scaleEnabled = false;
                        }
                    };
                    EditControl.prototype.setScaleBounds = function (min, max) {
                        this.scaleBoundsMin = min ? min : null;
                        this.scaleBoundsMax = max ? max : null;
                        if (this.scaleBoundsMin != null) {
                            if (this.scaleBoundsMin.x == 0)
                                this.scaleBoundsMin.x = 0.00000001;
                            if (this.scaleBoundsMin.y == 0)
                                this.scaleBoundsMin.y = 0.00000001;
                            if (this.scaleBoundsMin.z == 0)
                                this.scaleBoundsMin.z = 0.00000001;
                        }
                    };
                    EditControl.prototype.removeScaleBounds = function () {
                        this.scaleBoundsMin = null;
                        this.scaleBoundsMax = null;
                    };
                    EditControl.prototype.setTransBounds = function (min, max) {
                        this.transBoundsMin = min ? min : null;
                        this.transBoundsMax = max ? max : null;
                    };
                    EditControl.prototype.removeTransBounds = function () {
                        this.transBoundsMin = null;
                        this.transBoundsMax = null;
                    };
                    EditControl.prototype.setRotBounds = function (min, max) {
                        this.rotBoundsMin = min ? min : null;
                        this.rotBoundsMax = max ? max : null;
                    };
                    EditControl.prototype.removeRotBounds = function () {
                        this.rotBoundsMin = null;
                        this.rotBoundsMax = null;
                    };
                    /*
                     * create big and small axeses which will be shown in translate, rotate and scale mode.
                     *
                     */
                    EditControl.prototype.createCommonAxes = function () {
                        var guideAxes = new Mesh("guideCtl", this.scene);
                        //the big axes, shown when an axis is selected
                        this.bXaxis = Mesh.CreateLines("bxAxis", [new Vector3(-100, 0, 0), new Vector3(100, 0, 0)], this.scene);
                        this.bYaxis = Mesh.CreateLines("byAxis", [new Vector3(0, -100, 0), new Vector3(0, 100, 0)], this.scene);
                        this.bZaxis = Mesh.CreateLines("bzAxis", [new Vector3(0, 0, -100), new Vector3(0, 0, 100)], this.scene);
                        //lines are now pickable too
                        this.bXaxis.isPickable = false;
                        this.bYaxis.isPickable = false;
                        this.bZaxis.isPickable = false;
                        this.bXaxis.parent = guideAxes;
                        this.bYaxis.parent = guideAxes;
                        this.bZaxis.parent = guideAxes;
                        this.bXaxis.color = Color3.Red();
                        this.bYaxis.color = Color3.Green();
                        this.bZaxis.color = Color3.Blue();
                        this.hideBaxis();
                        //the small axis
                        var al = this.axesLen * this.axesScale * 0.75;
                        this.xaxis = Mesh.CreateLines("xAxis", [new Vector3(0, 0, 0), new Vector3(al, 0, 0)], this.scene);
                        this.yaxis = Mesh.CreateLines("yAxis", [new Vector3(0, 0, 0), new Vector3(0, al, 0)], this.scene);
                        this.zaxis = Mesh.CreateLines("zAxis", [new Vector3(0, 0, 0), new Vector3(0, 0, al)], this.scene);
                        //lines are now pickable too
                        this.xaxis.isPickable = false;
                        this.yaxis.isPickable = false;
                        this.zaxis.isPickable = false;
                        this.xaxis.parent = guideAxes;
                        this.yaxis.parent = guideAxes;
                        this.zaxis.parent = guideAxes;
                        this.xaxis.color = Color3.Red();
                        this.yaxis.color = Color3.Green();
                        this.zaxis.color = Color3.Blue();
                        this.xaxis.renderingGroupId = 1;
                        this.yaxis.renderingGroupId = 1;
                        this.zaxis.renderingGroupId = 1;
                        return guideAxes;
                    };
                    EditControl.prototype.createPickPlanes = function () {
                        this.pALL = Mesh.CreatePlane("pALL", 5, this.scene);
                        this.pXZ = Mesh.CreatePlane("pXZ", 5, this.scene);
                        this.pZY = Mesh.CreatePlane("pZY", 5, this.scene);
                        this.pYX = Mesh.CreatePlane("pYX", 5, this.scene);
                        this.pALL.isPickable = false;
                        this.pXZ.isPickable = false;
                        this.pZY.isPickable = false;
                        this.pYX.isPickable = false;
                        this.pALL.visibility = 0;
                        this.pXZ.visibility = 0;
                        this.pZY.visibility = 0;
                        this.pYX.visibility = 0;
                        this.pALL.renderingGroupId = 1;
                        this.pXZ.renderingGroupId = 1;
                        this.pZY.renderingGroupId = 1;
                        this.pYX.renderingGroupId = 1;
                        this.pALL.lookAt(this.mainCamera.position);
                        this.pXZ.rotate(Axis.X, 1.57);
                        this.pZY.rotate(Axis.Y, 1.57);
                        var pickPlanes = new Mesh("pickPlanes", this.scene);
                        this.pALL.parent = pickPlanes;
                        this.pXZ.parent = pickPlanes;
                        this.pZY.parent = pickPlanes;
                        this.pYX.parent = pickPlanes;
                        return pickPlanes;
                    };
                    EditControl.prototype.createTransAxes = function () {
                        var r = this.pickWidth * 2 * this.axesScale;
                        var l = this.axesLen * this.axesScale;
                        this.tCtl = new Mesh("tarnsCtl", this.scene);
                        //pickable invisible boxes around axes lines
                        this.tX = this.extrudeBox(r / 2, l);
                        this.tX.name = "X";
                        this.tY = this.tX.clone("Y");
                        this.tZ = this.tX.clone("Z");
                        this.tXZ = MeshBuilder.CreatePlane("XZ", { size: r * 2 }, this.scene);
                        this.tZY = MeshBuilder.CreatePlane("ZY", { size: r * 2 }, this.scene);
                        this.tYX = MeshBuilder.CreatePlane("YX", { size: r * 2 }, this.scene);
                        //this.tZY=this.tXZ.clone("ZY");
                        //this.tYX=this.tXZ.clone("YX");
                        this.tXZ.rotation.x = 1.57;
                        this.tZY.rotation.y = -1.57;
                        this.tXZ.position.x = r;
                        this.tXZ.position.z = r;
                        this.tZY.position.z = r;
                        this.tZY.position.y = r;
                        this.tYX.position.y = r;
                        this.tYX.position.x = r;
                        this.tXZ.bakeCurrentTransformIntoVertices();
                        this.tZY.bakeCurrentTransformIntoVertices();
                        this.tYX.bakeCurrentTransformIntoVertices();
                        this.tAll = Mesh.CreateBox("ALL", r * 2, this.scene);
                        this.tX.parent = this.tCtl;
                        this.tY.parent = this.tCtl;
                        this.tZ.parent = this.tCtl;
                        this.tXZ.parent = this.tCtl;
                        this.tZY.parent = this.tCtl;
                        this.tYX.parent = this.tCtl;
                        this.tAll.parent = this.tCtl;
                        this.tX.rotation.y = 1.57;
                        this.tY.rotation.x -= 1.57;
                        this.tX.visibility = 0;
                        this.tY.visibility = 0;
                        this.tZ.visibility = 0;
                        this.tXZ.visibility = 0;
                        this.tZY.visibility = 0;
                        this.tYX.visibility = 0;
                        this.tAll.visibility = 0;
                        //do not want clients picking this
                        //we will pick using mesh filter in scene.pick function
                        this.tX.isPickable = false;
                        this.tY.isPickable = false;
                        this.tZ.isPickable = false;
                        this.tXZ.isPickable = false;
                        this.tZY.isPickable = false;
                        this.tYX.isPickable = false;
                        this.tAll.isPickable = false;
                        //non pickable but visible cones at end of axes lines
                        //cone length
                        var cl = l / 5;
                        //cone base radius
                        var cr = r;
                        this.tEndX = Mesh.CreateCylinder("tEndX", cl, 0, cr, 6, 1, this.scene);
                        this.tEndY = this.tEndX.clone("tEndY");
                        this.tEndZ = this.tEndX.clone("tEndZ");
                        this.tEndXZ = this.createTriangle("XZ", cr * 1.75, this.scene);
                        this.tEndZY = this.tEndXZ.clone("ZY");
                        this.tEndYX = this.tEndXZ.clone("YX");
                        this.tEndAll = MeshBuilder.CreatePolyhedron("tEndAll", { type: 1, size: cr / 2 }, this.scene);
                        this.tEndX.rotation.x = 1.57;
                        this.tEndY.rotation.x = 1.57;
                        this.tEndZ.rotation.x = 1.57;
                        //            this.tEndXZ.rotation.x=-1.57;
                        //            this.tEndZY.rotation.x=-1.57;
                        //            this.tEndYX.rotation.x=-1.57;
                        //            
                        this.tEndZY.rotation.z = 1.57;
                        this.tEndYX.rotation.x = -1.57;
                        this.tEndXZ.position.x = r;
                        this.tEndXZ.position.z = r;
                        this.tEndZY.position.z = r;
                        this.tEndZY.position.y = r;
                        this.tEndYX.position.y = r;
                        this.tEndYX.position.x = r;
                        this.tEndX.parent = this.tX;
                        this.tEndY.parent = this.tY;
                        this.tEndZ.parent = this.tZ;
                        this.tEndXZ.parent = this.tXZ;
                        this.tEndZY.parent = this.tZY;
                        this.tEndYX.parent = this.tYX;
                        this.tEndAll.parent = this.tAll;
                        this.tEndX.position.z = l - cl / 2;
                        this.tEndY.position.z = l - cl / 2;
                        this.tEndZ.position.z = l - cl / 2;
                        this.tEndX.material = this.redMat;
                        this.tEndY.material = this.greenMat;
                        this.tEndZ.material = this.blueMat;
                        this.tEndXZ.material = this.greenMat;
                        this.tEndZY.material = this.redMat;
                        this.tEndYX.material = this.blueMat;
                        this.tEndAll.material = this.yellowMat;
                        this.tEndX.renderingGroupId = 2;
                        this.tEndY.renderingGroupId = 2;
                        this.tEndZ.renderingGroupId = 2;
                        this.tEndXZ.renderingGroupId = 2;
                        this.tEndZY.renderingGroupId = 2;
                        this.tEndYX.renderingGroupId = 2;
                        this.tEndAll.renderingGroupId = 2;
                        this.tEndX.isPickable = false;
                        this.tEndY.isPickable = false;
                        this.tEndZ.isPickable = false;
                        this.tEndXZ.isPickable = false;
                        this.tEndZY.isPickable = false;
                        this.tEndYX.isPickable = false;
                        this.tEndAll.isPickable = false;
                    };
                    EditControl.prototype.createTriangle = function (name, w, scene) {
                        var p = new Path2(w / 2, -w / 2).addLineTo(w / 2, w / 2).addLineTo(-w / 2, w / 2).addLineTo(w / 2, -w / 2);
                        var s = new BABYLON.PolygonMeshBuilder(name, p, scene);
                        var t = s.build();
                        return t;
                    };
                    EditControl.prototype.setRotGuideFull = function (y) {
                        if (y)
                            this.guideSize = 360;
                        else
                            this.guideSize = 180;
                        if (this.rCtl != null) {
                            this.rCtl.dispose();
                            this.rAll.dispose();
                            this.rCtl = null;
                            this.enableRotation();
                        }
                    };
                    EditControl.prototype.createRotAxes = function () {
                        var d = this.axesLen * this.axesScale * 2;
                        this.rCtl = new Mesh("rotCtl", this.scene);
                        //pickable invisible torus around the rotation circles
                        this.rX = this.createTube(d / 2, this.guideSize);
                        this.rX.name = "X";
                        this.rY = this.createTube(d / 2, this.guideSize);
                        this.rY.name = "Y";
                        this.rZ = this.createTube(d / 2, this.guideSize);
                        this.rZ.name = "Z";
                        this.rAll = this.createTube(d / 1.75, 360);
                        this.rAll.name = "ALL";
                        this.rX.rotation.z = 1.57;
                        this.rZ.rotation.x = -1.57;
                        this.rX.bakeCurrentTransformIntoVertices();
                        this.rZ.bakeCurrentTransformIntoVertices();
                        this.rAll.rotation.x = 1.57;
                        this.rX.parent = this.rCtl;
                        this.rY.parent = this.rCtl;
                        this.rZ.parent = this.rCtl;
                        this.rAll.parent = this.pALL;
                        this.rX.visibility = 0;
                        this.rY.visibility = 0;
                        this.rZ.visibility = 0;
                        this.rAll.visibility = 0;
                        //do not want clients picking this
                        //we will pick using mesh filter in scene.pick function
                        this.rX.isPickable = false;
                        this.rY.isPickable = false;
                        this.rZ.isPickable = false;
                        this.rAll.isPickable = false;
                        //non pickable but visible circles
                        var cl = d;
                        this.rEndX = this.createCircle(cl / 2, this.guideSize, false);
                        this.rEndY = this.rEndX.clone("");
                        this.rEndZ = this.rEndX.clone("");
                        this.rEndAll = this.createCircle(cl / 1.75, 360, false);
                        this.rEndAll2 = this.createCircle(cl / 2, 360, false);
                        this.rEndX.parent = this.rX;
                        this.rEndY.parent = this.rY;
                        this.rEndZ.parent = this.rZ;
                        this.rEndX.rotation.z = 1.57;
                        this.rEndZ.rotation.x = -1.57;
                        this.rEndAll.parent = this.rAll;
                        this.rEndAll2.parent = this.rAll;
                        this.rEndX.color = Color3.Red();
                        this.rEndY.color = Color3.Green();
                        this.rEndZ.color = Color3.Blue();
                        this.rEndAll.color = Color3.Yellow();
                        this.rEndAll2.color = Color3.Gray();
                        this.rEndX.renderingGroupId = 2;
                        this.rEndY.renderingGroupId = 2;
                        this.rEndZ.renderingGroupId = 2;
                        this.rEndAll.renderingGroupId = 2;
                        this.rEndAll2.renderingGroupId = 2;
                        this.rEndX.isPickable = false;
                        this.rEndY.isPickable = false;
                        this.rEndZ.isPickable = false;
                        this.rEndAll.isPickable = false;
                    };
                    EditControl.prototype.extrudeBox = function (w, l) {
                        var shape = [new Vector3(w, w, 0), new Vector3(-w, w, 0), new Vector3(-w, -w, 0), new Vector3(w, -w, 0), new Vector3(w, w, 0)];
                        var path = [new Vector3(0, 0, 0), new Vector3(0, 0, l)];
                        var box = Mesh.ExtrudeShape("", shape, path, 1, 0, 2, this.scene);
                        return box;
                    };
                    EditControl.prototype.createCircle = function (r, t, double) {
                        if (t === null)
                            t = 360;
                        var points = [];
                        var x;
                        var z;
                        var a = 3.14 / 180;
                        var p = 0;
                        for (var i = 0; i <= t; i = i + 5) {
                            x = r * Math.cos(i * a);
                            if (i == 90)
                                z = r;
                            else if (i == 270)
                                z = -r;
                            else
                                z = r * Math.sin(i * a);
                            points[p] = new Vector3(x, 0, z);
                            p++;
                        }
                        if (double) {
                            r = r - 0.04;
                            for (var i = 0; i <= t; i = i + 5) {
                                x = r * Math.cos(i * a);
                                if (i == 90)
                                    z = r;
                                else if (i == 270)
                                    z = -r;
                                else
                                    z = r * Math.sin(i * a);
                                points[p] = new Vector3(x, 0, z);
                                p++;
                            }
                        }
                        var circle = Mesh.CreateLines("", points, this.scene);
                        return circle;
                    };
                    EditControl.prototype.createTube = function (r, t) {
                        if (t === null)
                            t = 360;
                        var points = [];
                        var x;
                        var z;
                        var a = 3.14 / 180;
                        var p = 0;
                        for (var i = 0; i <= t; i = i + 30) {
                            x = r * Math.cos(i * a);
                            if (i == 90)
                                z = r;
                            else if (i == 270)
                                z = -r;
                            else
                                z = r * Math.sin(i * a);
                            points[p] = new Vector3(x, 0, z);
                            p++;
                        }
                        var tube = Mesh.CreateTube("", points, this.pickWidth * this.axesScale * 2, 3, null, BABYLON.Mesh.NO_CAP, this.scene);
                        return tube;
                    };
                    EditControl.prototype.createScaleAxes = function () {
                        var r = this.pickWidth * 2 * this.axesScale;
                        var l = this.axesLen * this.axesScale;
                        this.sCtl = new Mesh("sCtl", this.scene);
                        //pickable , invisible part
                        this.sX = this.extrudeBox(r / 2, l);
                        this.sX.name = "X";
                        this.sY = this.sX.clone("Y");
                        this.sZ = this.sX.clone("Z");
                        this.sXZ = MeshBuilder.CreatePlane("XZ", { size: r * 2 }, this.scene);
                        this.sZY = MeshBuilder.CreatePlane("ZY", { size: r * 2 }, this.scene);
                        this.sYX = MeshBuilder.CreatePlane("YX", { size: r * 2 }, this.scene);
                        //this.sZY=this.sXZ.clone("ZY");
                        //this.sYX=this.sXZ.clone("YX");
                        this.sXZ.rotation.x = 1.57;
                        this.sZY.rotation.y = -1.57;
                        this.sXZ.position.x = r;
                        this.sXZ.position.z = r;
                        this.sZY.position.z = r;
                        this.sZY.position.y = r;
                        this.sYX.position.y = r;
                        this.sYX.position.x = r;
                        this.sXZ.bakeCurrentTransformIntoVertices();
                        this.sZY.bakeCurrentTransformIntoVertices();
                        this.sYX.bakeCurrentTransformIntoVertices();
                        this.sAll = Mesh.CreateBox("ALL", r * 2, this.scene);
                        this.sX.parent = this.sCtl;
                        this.sY.parent = this.sCtl;
                        this.sZ.parent = this.sCtl;
                        this.sAll.parent = this.sCtl;
                        this.sXZ.parent = this.sCtl;
                        this.sZY.parent = this.sCtl;
                        this.sYX.parent = this.sCtl;
                        this.sX.rotation.y = 1.57;
                        this.sY.rotation.x -= 1.57;
                        this.sX.visibility = 0;
                        this.sY.visibility = 0;
                        this.sZ.visibility = 0;
                        this.sXZ.visibility = 0;
                        this.sZY.visibility = 0;
                        this.sYX.visibility = 0;
                        this.sAll.visibility = 0;
                        //do not want clients picking this
                        //we will pick using mesh filter in scene.pick function
                        this.sX.isPickable = false;
                        this.sY.isPickable = false;
                        this.sZ.isPickable = false;
                        this.sXZ.isPickable = false;
                        this.sZY.isPickable = false;
                        this.sYX.isPickable = false;
                        this.sAll.isPickable = false;
                        //non pickable visible boxes at end of axes
                        var cr = r;
                        this.sEndX = Mesh.CreateBox("", cr, this.scene);
                        this.sEndY = this.sEndX.clone("");
                        this.sEndZ = this.sEndX.clone("");
                        this.sEndXZ = this.createTriangle("XZ", cr * 1.75, this.scene);
                        this.sEndZY = this.sEndXZ.clone("ZY");
                        this.sEndYX = this.sEndXZ.clone("YX");
                        this.sEndAll = MeshBuilder.CreatePolyhedron("sEndAll", { type: 1, size: cr / 2 }, this.scene);
                        //            this.sEndXZ.rotati            on.x=-1.57;
                        //            this.sEndZY.rotati            on.x=-1.57;
                        //            this.sEndYX.rotation.x=-1.57;
                        this.sEndZY.rotation.z = 1.57;
                        this.sEndYX.rotation.x = -1.57;
                        this.sEndXZ.position.x = r;
                        this.sEndXZ.position.z = r;
                        this.sEndZY.position.z = r;
                        this.sEndZY.position.y = r;
                        this.sEndYX.position.y = r;
                        this.sEndYX.position.x = r;
                        this.sEndX.parent = this.sX;
                        this.sEndY.parent = this.sY;
                        this.sEndZ.parent = this.sZ;
                        this.sEndXZ.parent = this.sXZ;
                        this.sEndZY.parent = this.sZY;
                        this.sEndYX.parent = this.sYX;
                        this.sEndAll.parent = this.sAll;
                        this.sEndX.position.z = l - cr / 2;
                        this.sEndY.position.z = l - cr / 2;
                        this.sEndZ.position.z = l - cr / 2;
                        this.sEndX.material = this.redMat;
                        this.sEndY.material = this.greenMat;
                        this.sEndZ.material = this.blueMat;
                        this.sEndXZ.material = this.greenMat;
                        this.sEndZY.material = this.redMat;
                        this.sEndYX.material = this.blueMat;
                        this.sEndAll.material = this.yellowMat;
                        this.sEndX.renderingGroupId = 2;
                        this.sEndY.renderingGroupId = 2;
                        this.sEndZ.renderingGroupId = 2;
                        this.sEndXZ.renderingGroupId = 2;
                        this.sEndZY.renderingGroupId = 2;
                        this.sEndYX.renderingGroupId = 2;
                        this.sEndAll.renderingGroupId = 2;
                        this.sEndX.isPickable = false;
                        this.sEndY.isPickable = false;
                        this.sEndZ.isPickable = false;
                        this.sEndXZ.isPickable = false;
                        this.sEndZY.isPickable = false;
                        this.sEndYX.isPickable = false;
                        this.sEndAll.isPickable = false;
                    };
                    ;
                    ;
                    /*
                     * This would be called during rotation as the local axes direction would have changed
                     * We need to set the local axis as these are used in all three modes to figure out
                     * direction of mouse move wrt the axes
                     * TODO should use world pivotmatrix instead of worldmatrix - incase pivot axes were rotated?
                     */
                    EditControl.prototype.setLocalAxes = function (mesh) {
                        var meshMatrix = mesh.getWorldMatrix();
                        Vector3.FromFloatArrayToRef(meshMatrix.asArray(), 0, this.localX);
                        Vector3.FromFloatArrayToRef(meshMatrix.asArray(), 4, this.localY);
                        Vector3.FromFloatArrayToRef(meshMatrix.asArray(), 8, this.localZ);
                    };
                    /**
                     * set how transparent the axes are
                     * 0 to 1
                     * 0 - completely transparent
                     * 1 - completely non transparent
                     * default is 0.75
                     */
                    EditControl.prototype.setVisibility = function (v) {
                        this.visibility = v;
                    };
                    EditControl.prototype.setLocal = function (l) {
                        if (this.local == l)
                            return;
                        this.local = l;
                        if (!l) {
                            this.ecRoot.rotationQuaternion = Quaternion.Identity();
                        }
                    };
                    EditControl.prototype.isLocal = function () {
                        return this.local;
                    };
                    EditControl.prototype.setTransSnap = function (s) {
                        this.snapT = s;
                    };
                    EditControl.prototype.setRotSnap = function (s) {
                        this.snapR = s;
                    };
                    EditControl.prototype.setScaleSnap = function (s) {
                        this.snapS = s;
                    };
                    EditControl.prototype.setTransSnapValue = function (t) {
                        this.tSnap.copyFromFloats(t, t, t);
                        this.transSnap = t;
                    };
                    EditControl.prototype.setRotSnapValue = function (r) {
                        this.rotSnap = r;
                    };
                    /**
                     * use this to set the scale snap value
                     */
                    EditControl.prototype.setScaleSnapValue = function (r) {
                        this.scaleSnap = r;
                    };
                    EditControl.prototype.getAngle2 = function (p1, p2, cameraPos, c2ec, mN) {
                        /**
                         * A) find out if the camera is above , below, left, right of the rotation plane
                         */
                        //project "camera to ec" vector onto mesh normal to get distance to rotation plane
                        var d = Vector3.Dot(c2ec, mN);
                        //scale mesh normal by above ammount to get vector to rotation plane
                        mN.scaleToRef(d, this.tv1);
                        //get the point of intersection of vector from camera perpendicular to rotation plane
                        cameraPos.addToRef(this.tv1, this.tv2);
                        var i = this.tv2; //save some typing
                        //find the co-ordinate of this point in the cameras frame of reference
                        this.mainCamera.getWorldMatrix().invertToRef(this.tm);
                        Vector3.TransformCoordinatesToRef(this.tv2, this.tm, this.tv2);
                        //find in which quadarant the point (and thus the rotation plane) is in the camera xy plane
                        var q = 0; //(1=x y,2=-x y,3=-x -y,4=x -y)
                        if (i.x >= 0 && i.y >= 0)
                            q = 1;
                        else if (i.x <= 0 && i.y >= 0)
                            q = 2;
                        else if (i.x <= 0 && i.y <= 0)
                            q = 3;
                        else if (i.x >= 0 && i.y <= 0)
                            q = 4;
                        /**
                         * B) find out if the user moved pointer up,down, right, left
                         */
                        //find movement vector in camera frame of reference
                        Vector3.TransformCoordinatesToRef(p1, this.tm, this.tv1);
                        Vector3.TransformCoordinatesToRef(p2, this.tm, this.tv2);
                        this.tv2.subtractInPlace(this.tv1);
                        var mv = this.tv2; //save some typing
                        //for now lets set the angle magnitutde same as amount by which the mouse moved
                        var angle = mv.length();
                        var m = ""; //(u ,d ,r,l)
                        if (mv.x >= 0 && mv.y >= 0) {
                            if (mv.x >= mv.y)
                                m = "r";
                            else
                                m = "u";
                        }
                        else if (mv.x <= 0 && mv.y >= 0) {
                            if (-mv.x >= mv.y)
                                m = "l";
                            else
                                m = "u";
                        }
                        else if (mv.x <= 0 && mv.y <= 0) {
                            if (-mv.x >= -mv.y)
                                m = "l";
                            else
                                m = "d";
                        }
                        else if (mv.x >= 0 && mv.y <= 0) {
                            if (mv.x >= -mv.y)
                                m = "r";
                            else
                                m = "d";
                        }
                        /**
                         * C) decide if the user was trying to rotate clockwise (+1) or anti-clockwise(-1)
                         */
                        var r = 0;
                        //if mouse moved down /up and rotation plane is on  right or left side of user
                        if (m == "d") {
                            if (q == 1 || q == 4)
                                r = 1;
                            else
                                r = -1;
                        }
                        else if (m == "u") {
                            if (q == 1 || q == 4)
                                r = -1;
                            else
                                r = 1;
                            //if mouse moved right/left and  rotation plane is above or below user
                        }
                        else if (m == "r") {
                            if (q == 2 || q == 1)
                                r = 1;
                            else
                                r = -1;
                        }
                        else if (m == "l") {
                            if (q == 2 || q == 1)
                                r = -1;
                            else
                                r = 1;
                        }
                        return r * angle;
                    };
                    /**
                     * finds the angle subtended from points p1 to p2 around the point p
                     * checks if the user was trying to rotate clockwise (+ve in LHS) or anticlockwise (-ve in LHS)
                     * to figure this check the orientation of the user(camera)to ec vector with the rotation normal vector
                     */
                    EditControl.prototype.getAngle = function (p1, p2, p, c2ec) {
                        p1.subtractToRef(p, this.tv1);
                        p2.subtractToRef(p, this.tv2);
                        Vector3.CrossToRef(this.tv1, this.tv2, this.tv3);
                        var angle = Math.asin(this.tv3.length() / (this.tv1.length() * this.tv2.length()));
                        //camera looking down from front of plane or looking up from behind plane
                        if ((Vector3.Dot(this.tv3, c2ec) > 0)) {
                            angle = -1 * angle;
                        }
                        return angle;
                    };
                    EditControl.prototype.createMaterials = function (scene) {
                        this.redMat = EditControl.getStandardMaterial("redMat", Color3.Red(), scene);
                        this.greenMat = EditControl.getStandardMaterial("greenMat", Color3.Green(), scene);
                        this.blueMat = EditControl.getStandardMaterial("blueMat", Color3.Blue(), scene);
                        this.whiteMat = EditControl.getStandardMaterial("whiteMat", Color3.White(), scene);
                        this.yellowMat = EditControl.getStandardMaterial("whiteMat", Color3.Yellow(), scene);
                    };
                    EditControl.prototype.disposeMaterials = function () {
                        this.redMat.dispose();
                        this.greenMat.dispose();
                        this.blueMat.dispose();
                        this.whiteMat.dispose();
                        this.yellowMat.dispose();
                    };
                    EditControl.getStandardMaterial = function (name, col, scene) {
                        var mat = new StandardMaterial(name, scene);
                        mat.emissiveColor = col;
                        mat.diffuseColor = Color3.Black();
                        mat.specularColor = Color3.Black();
                        mat.backFaceCulling = false;
                        return mat;
                    };
                    return EditControl;
                }());
                component.EditControl = EditControl;
                var ActHist = (function () {
                    function ActHist(mesh, capacity) {
                        this.lastMax = 10;
                        this.acts = new Array();
                        this.last = -1;
                        this.current = -1;
                        this.mesh = mesh;
                        this.lastMax = capacity - 1;
                        this.add();
                    }
                    ActHist.prototype.setCapacity = function (c) {
                        if ((c == 0)) {
                            console.error("capacity should be more than zero");
                            return;
                        }
                        this.lastMax = c - 1;
                        this.last = -1;
                        this.current = -1;
                        this.acts = new Array();
                        this.add();
                    };
                    ActHist.prototype.add = function (at) {
                        if (at === undefined)
                            at = null;
                        var act = new Act(this.mesh, at);
                        if ((this.current < this.last)) {
                            this.acts.splice(this.current + 1);
                            this.last = this.current;
                        }
                        if ((this.last == this.lastMax)) {
                            this.acts.shift();
                            this.acts.push(act);
                        }
                        else {
                            this.acts.push(act);
                            this.last++;
                            this.current++;
                        }
                    };
                    ActHist.prototype.undo = function () {
                        if ((this.current > 0)) {
                            var at = this.acts[this.current].getActionType();
                            this.current--;
                            this.acts[this.current].perform(this.mesh);
                            return at;
                        }
                    };
                    ActHist.prototype.redo = function () {
                        if ((this.current < this.last)) {
                            this.current++;
                            this.acts[this.current].perform(this.mesh);
                            return this.acts[this.current].getActionType();
                        }
                    };
                    return ActHist;
                }());
                component.ActHist = ActHist;
                var Act = (function () {
                    function Act(mesh, at) {
                        this.p = mesh.position.clone();
                        //if (mesh.rotationQuaternion == null) {
                        if (mesh.rotationQuaternion == null) {
                            this.rQ = null;
                            this.rE = mesh.rotation.clone();
                        }
                        else {
                            this.rQ = mesh.rotationQuaternion.clone();
                            this.rE = null;
                        }
                        this.s = mesh.scaling.clone();
                        this.at = at;
                    }
                    Act.prototype.getActionType = function () {
                        return this.at;
                    };
                    Act.prototype.perform = function (mesh) {
                        mesh.position.copyFrom(this.p);
                        //check if we are doing euler or quaternion now
                        //also check what were we doing when the rotation value
                        //was captured and set value accordingly
                        if (mesh.rotationQuaternion == null) {
                            if (this.rE != null) {
                                //mesh.rotation = this.rE.clone();
                                mesh.rotation.copyFrom(this.rE);
                            }
                            else {
                                //mesh.rotation = this.r.toEulerAngles();
                                mesh.rotation.copyFrom(this.rQ.toEulerAngles());
                            }
                        }
                        else {
                            if (this.rQ != null) {
                                mesh.rotationQuaternion.copyFrom(this.rQ);
                            }
                            else {
                                //TODO use BABYLON.Quaternion.RotationYawPitchRoll(rot.y, rot.x, rot.z) instead of toQuaternion.
                                //mesh.rotationQuaternion.copyFrom(this.rE.toQuaternion());
                                mesh.rotationQuaternion.copyFrom(Quaternion.RotationYawPitchRoll(this.rE.y, this.rE.x, this.rE.z));
                            }
                        }
                        mesh.scaling.copyFrom(this.s);
                    };
                    return Act;
                }());
                component.Act = Act;
            })(component = babylonjs.component || (babylonjs.component = {}));
        })(babylonjs = ssatguru.babylonjs || (ssatguru.babylonjs = {}));
    })(ssatguru = org.ssatguru || (org.ssatguru = {}));
})(org || (org = {}));
//# sourceMappingURL=EditControl.js.map