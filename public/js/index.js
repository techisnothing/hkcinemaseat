/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest() { // eslint-disable-line no-unused-vars
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = 10000;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "d56662e6f73051442df5"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotMainModule = true; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else hotCurrentParents = [moduleId];
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			hotMainModule = false;
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name)) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		Object.defineProperty(fn, "e", {
/******/ 			enumerable: true,
/******/ 			value: function(chunkId) {
/******/ 				if(hotStatus === "ready")
/******/ 					hotSetStatus("prepare");
/******/ 				hotChunksLoading++;
/******/ 				return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 					finishChunkLoading();
/******/ 					throw err;
/******/ 				});
/******/ 	
/******/ 				function finishChunkLoading() {
/******/ 					hotChunksLoading--;
/******/ 					if(hotStatus === "prepare") {
/******/ 						if(!hotWaitingFilesMap[chunkId]) {
/******/ 							hotEnsureUpdateChunk(chunkId);
/******/ 						}
/******/ 						if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 							hotUpdateDownloaded();
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		});
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotMainModule,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotMainModule = true;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest().then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 	
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate).then(function(result) {
/******/ 				deferred.resolve(result);
/******/ 			}, function(err) {
/******/ 				deferred.reject(err);
/******/ 			});
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					dependency = moduleOutdatedDependencies[i];
/******/ 					cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(i = 0; i < callbacks.length; i++) {
/******/ 					cb = callbacks[i];
/******/ 					try {
/******/ 						cb(moduleOutdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "accept-errored",
/******/ 								moduleId: moduleId,
/******/ 								dependencyId: moduleOutdatedDependencies[i],
/******/ 								error: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err;
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return Promise.resolve(outdatedModules);
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(8)(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*!
 * Vue.js v2.2.2
 * (c) 2014-2017 Evan You
 * Released under the MIT License.
 */
(function (global, factory) {
  ( false ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : global.Vue = factory();
})(undefined, function () {
  'use strict';

  /*  */

  /**
   * Convert a value to a string that is actually rendered.
   */

  function _toString(val) {
    return val == null ? '' : (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' ? JSON.stringify(val, null, 2) : String(val);
  }

  /**
   * Convert a input value to a number for persistence.
   * If the conversion fails, return original string.
   */
  function toNumber(val) {
    var n = parseFloat(val);
    return isNaN(n) ? val : n;
  }

  /**
   * Make a map and return a function for checking if a key
   * is in that map.
   */
  function makeMap(str, expectsLowerCase) {
    var map = Object.create(null);
    var list = str.split(',');
    for (var i = 0; i < list.length; i++) {
      map[list[i]] = true;
    }
    return expectsLowerCase ? function (val) {
      return map[val.toLowerCase()];
    } : function (val) {
      return map[val];
    };
  }

  /**
   * Check if a tag is a built-in tag.
   */
  var isBuiltInTag = makeMap('slot,component', true);

  /**
   * Remove an item from an array
   */
  function remove(arr, item) {
    if (arr.length) {
      var index = arr.indexOf(item);
      if (index > -1) {
        return arr.splice(index, 1);
      }
    }
  }

  /**
   * Check whether the object has the property.
   */
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  function hasOwn(obj, key) {
    return hasOwnProperty.call(obj, key);
  }

  /**
   * Check if value is primitive
   */
  function isPrimitive(value) {
    return typeof value === 'string' || typeof value === 'number';
  }

  /**
   * Create a cached version of a pure function.
   */
  function cached(fn) {
    var cache = Object.create(null);
    return function cachedFn(str) {
      var hit = cache[str];
      return hit || (cache[str] = fn(str));
    };
  }

  /**
   * Camelize a hyphen-delimited string.
   */
  var camelizeRE = /-(\w)/g;
  var camelize = cached(function (str) {
    return str.replace(camelizeRE, function (_, c) {
      return c ? c.toUpperCase() : '';
    });
  });

  /**
   * Capitalize a string.
   */
  var capitalize = cached(function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  });

  /**
   * Hyphenate a camelCase string.
   */
  var hyphenateRE = /([^-])([A-Z])/g;
  var hyphenate = cached(function (str) {
    return str.replace(hyphenateRE, '$1-$2').replace(hyphenateRE, '$1-$2').toLowerCase();
  });

  /**
   * Simple bind, faster than native
   */
  function bind(fn, ctx) {
    function boundFn(a) {
      var l = arguments.length;
      return l ? l > 1 ? fn.apply(ctx, arguments) : fn.call(ctx, a) : fn.call(ctx);
    }
    // record original fn length
    boundFn._length = fn.length;
    return boundFn;
  }

  /**
   * Convert an Array-like object to a real Array.
   */
  function toArray(list, start) {
    start = start || 0;
    var i = list.length - start;
    var ret = new Array(i);
    while (i--) {
      ret[i] = list[i + start];
    }
    return ret;
  }

  /**
   * Mix properties into target object.
   */
  function extend(to, _from) {
    for (var key in _from) {
      to[key] = _from[key];
    }
    return to;
  }

  /**
   * Quick object check - this is primarily used to tell
   * Objects from primitive values when we know the value
   * is a JSON-compliant type.
   */
  function isObject(obj) {
    return obj !== null && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object';
  }

  /**
   * Strict object type check. Only returns true
   * for plain JavaScript objects.
   */
  var toString = Object.prototype.toString;
  var OBJECT_STRING = '[object Object]';
  function isPlainObject(obj) {
    return toString.call(obj) === OBJECT_STRING;
  }

  /**
   * Merge an Array of Objects into a single Object.
   */
  function toObject(arr) {
    var res = {};
    for (var i = 0; i < arr.length; i++) {
      if (arr[i]) {
        extend(res, arr[i]);
      }
    }
    return res;
  }

  /**
   * Perform no operation.
   */
  function noop() {}

  /**
   * Always return false.
   */
  var no = function no() {
    return false;
  };

  /**
   * Return same value
   */
  var identity = function identity(_) {
    return _;
  };

  /**
   * Generate a static keys string from compiler modules.
   */
  function genStaticKeys(modules) {
    return modules.reduce(function (keys, m) {
      return keys.concat(m.staticKeys || []);
    }, []).join(',');
  }

  /**
   * Check if two values are loosely equal - that is,
   * if they are plain objects, do they have the same shape?
   */
  function looseEqual(a, b) {
    var isObjectA = isObject(a);
    var isObjectB = isObject(b);
    if (isObjectA && isObjectB) {
      try {
        return JSON.stringify(a) === JSON.stringify(b);
      } catch (e) {
        // possible circular reference
        return a === b;
      }
    } else if (!isObjectA && !isObjectB) {
      return String(a) === String(b);
    } else {
      return false;
    }
  }

  function looseIndexOf(arr, val) {
    for (var i = 0; i < arr.length; i++) {
      if (looseEqual(arr[i], val)) {
        return i;
      }
    }
    return -1;
  }

  /**
   * Ensure a function is called only once.
   */
  function once(fn) {
    var called = false;
    return function () {
      if (!called) {
        called = true;
        fn();
      }
    };
  }

  /*  */

  var config = {
    /**
     * Option merge strategies (used in core/util/options)
     */
    optionMergeStrategies: Object.create(null),

    /**
     * Whether to suppress warnings.
     */
    silent: false,

    /**
     * Show production mode tip message on boot?
     */
    productionTip: "development" !== 'production',

    /**
     * Whether to enable devtools
     */
    devtools: "development" !== 'production',

    /**
     * Whether to record perf
     */
    performance: "development" !== 'production',

    /**
     * Error handler for watcher errors
     */
    errorHandler: null,

    /**
     * Ignore certain custom elements
     */
    ignoredElements: [],

    /**
     * Custom user key aliases for v-on
     */
    keyCodes: Object.create(null),

    /**
     * Check if a tag is reserved so that it cannot be registered as a
     * component. This is platform-dependent and may be overwritten.
     */
    isReservedTag: no,

    /**
     * Check if a tag is an unknown element.
     * Platform-dependent.
     */
    isUnknownElement: no,

    /**
     * Get the namespace of an element
     */
    getTagNamespace: noop,

    /**
     * Parse the real tag name for the specific platform.
     */
    parsePlatformTagName: identity,

    /**
     * Check if an attribute must be bound using property, e.g. value
     * Platform-dependent.
     */
    mustUseProp: no,

    /**
     * List of asset types that a component can own.
     */
    _assetTypes: ['component', 'directive', 'filter'],

    /**
     * List of lifecycle hooks.
     */
    _lifecycleHooks: ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestroy', 'destroyed', 'activated', 'deactivated'],

    /**
     * Max circular updates allowed in a scheduler flush cycle.
     */
    _maxUpdateCount: 100
  };

  /*  */
  /* globals MutationObserver */

  // can we use __proto__?
  var hasProto = '__proto__' in {};

  // Browser environment sniffing
  var inBrowser = typeof window !== 'undefined';
  var UA = inBrowser && window.navigator.userAgent.toLowerCase();
  var isIE = UA && /msie|trident/.test(UA);
  var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
  var isEdge = UA && UA.indexOf('edge/') > 0;
  var isAndroid = UA && UA.indexOf('android') > 0;
  var isIOS = UA && /iphone|ipad|ipod|ios/.test(UA);
  var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;

  // this needs to be lazy-evaled because vue may be required before
  // vue-server-renderer can set VUE_ENV
  var _isServer;
  var isServerRendering = function isServerRendering() {
    if (_isServer === undefined) {
      /* istanbul ignore if */
      if (!inBrowser && typeof global !== 'undefined') {
        // detect presence of vue-server-renderer and avoid
        // Webpack shimming the process
        _isServer = global['process'].env.VUE_ENV === 'server';
      } else {
        _isServer = false;
      }
    }
    return _isServer;
  };

  // detect devtools
  var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

  /* istanbul ignore next */
  function isNative(Ctor) {
    return (/native code/.test(Ctor.toString())
    );
  }

  var hasSymbol = typeof Symbol !== 'undefined' && isNative(Symbol) && typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

  /**
   * Defer a task to execute it asynchronously.
   */
  var nextTick = function () {
    var callbacks = [];
    var pending = false;
    var timerFunc;

    function nextTickHandler() {
      pending = false;
      var copies = callbacks.slice(0);
      callbacks.length = 0;
      for (var i = 0; i < copies.length; i++) {
        copies[i]();
      }
    }

    // the nextTick behavior leverages the microtask queue, which can be accessed
    // via either native Promise.then or MutationObserver.
    // MutationObserver has wider support, however it is seriously bugged in
    // UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
    // completely stops working after triggering a few times... so, if native
    // Promise is available, we will use it:
    /* istanbul ignore if */
    if (typeof Promise !== 'undefined' && isNative(Promise)) {
      var p = Promise.resolve();
      var logError = function logError(err) {
        console.error(err);
      };
      timerFunc = function timerFunc() {
        p.then(nextTickHandler).catch(logError);
        // in problematic UIWebViews, Promise.then doesn't completely break, but
        // it can get stuck in a weird state where callbacks are pushed into the
        // microtask queue but the queue isn't being flushed, until the browser
        // needs to do some other work, e.g. handle a timer. Therefore we can
        // "force" the microtask queue to be flushed by adding an empty timer.
        if (isIOS) {
          setTimeout(noop);
        }
      };
    } else if (typeof MutationObserver !== 'undefined' && (isNative(MutationObserver) ||
    // PhantomJS and iOS 7.x
    MutationObserver.toString() === '[object MutationObserverConstructor]')) {
      // use MutationObserver where native Promise is not available,
      // e.g. PhantomJS IE11, iOS7, Android 4.4
      var counter = 1;
      var observer = new MutationObserver(nextTickHandler);
      var textNode = document.createTextNode(String(counter));
      observer.observe(textNode, {
        characterData: true
      });
      timerFunc = function timerFunc() {
        counter = (counter + 1) % 2;
        textNode.data = String(counter);
      };
    } else {
      // fallback to setTimeout
      /* istanbul ignore next */
      timerFunc = function timerFunc() {
        setTimeout(nextTickHandler, 0);
      };
    }

    return function queueNextTick(cb, ctx) {
      var _resolve;
      callbacks.push(function () {
        if (cb) {
          cb.call(ctx);
        }
        if (_resolve) {
          _resolve(ctx);
        }
      });
      if (!pending) {
        pending = true;
        timerFunc();
      }
      if (!cb && typeof Promise !== 'undefined') {
        return new Promise(function (resolve) {
          _resolve = resolve;
        });
      }
    };
  }();

  var _Set;
  /* istanbul ignore if */
  if (typeof Set !== 'undefined' && isNative(Set)) {
    // use native Set when available.
    _Set = Set;
  } else {
    // a non-standard Set polyfill that only works with primitive keys.
    _Set = function () {
      function Set() {
        this.set = Object.create(null);
      }
      Set.prototype.has = function has(key) {
        return this.set[key] === true;
      };
      Set.prototype.add = function add(key) {
        this.set[key] = true;
      };
      Set.prototype.clear = function clear() {
        this.set = Object.create(null);
      };

      return Set;
    }();
  }

  var perf;

  {
    perf = inBrowser && window.performance;
    if (perf && (!perf.mark || !perf.measure)) {
      perf = undefined;
    }
  }

  /*  */

  var emptyObject = Object.freeze({});

  /**
   * Check if a string starts with $ or _
   */
  function isReserved(str) {
    var c = (str + '').charCodeAt(0);
    return c === 0x24 || c === 0x5F;
  }

  /**
   * Define a property.
   */
  function def(obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
      value: val,
      enumerable: !!enumerable,
      writable: true,
      configurable: true
    });
  }

  /**
   * Parse simple path.
   */
  var bailRE = /[^\w.$]/;
  function parsePath(path) {
    if (bailRE.test(path)) {
      return;
    }
    var segments = path.split('.');
    return function (obj) {
      for (var i = 0; i < segments.length; i++) {
        if (!obj) {
          return;
        }
        obj = obj[segments[i]];
      }
      return obj;
    };
  }

  var warn = noop;
  var tip = noop;
  var formatComponentName;

  {
    var hasConsole = typeof console !== 'undefined';
    var classifyRE = /(?:^|[-_])(\w)/g;
    var classify = function classify(str) {
      return str.replace(classifyRE, function (c) {
        return c.toUpperCase();
      }).replace(/[-_]/g, '');
    };

    warn = function warn(msg, vm) {
      if (hasConsole && !config.silent) {
        console.error("[Vue warn]: " + msg + " " + (vm ? formatLocation(formatComponentName(vm)) : ''));
      }
    };

    tip = function tip(msg, vm) {
      if (hasConsole && !config.silent) {
        console.warn("[Vue tip]: " + msg + " " + (vm ? formatLocation(formatComponentName(vm)) : ''));
      }
    };

    formatComponentName = function formatComponentName(vm, includeFile) {
      if (vm.$root === vm) {
        return '<Root>';
      }
      var name = vm._isVue ? vm.$options.name || vm.$options._componentTag : vm.name;

      var file = vm._isVue && vm.$options.__file;
      if (!name && file) {
        var match = file.match(/([^/\\]+)\.vue$/);
        name = match && match[1];
      }

      return (name ? "<" + classify(name) + ">" : "<Anonymous>") + (file && includeFile !== false ? " at " + file : '');
    };

    var formatLocation = function formatLocation(str) {
      if (str === "<Anonymous>") {
        str += " - use the \"name\" option for better debugging messages.";
      }
      return "\n(found in " + str + ")";
    };
  }

  /*  */

  var uid$1 = 0;

  /**
   * A dep is an observable that can have multiple
   * directives subscribing to it.
   */
  var Dep = function Dep() {
    this.id = uid$1++;
    this.subs = [];
  };

  Dep.prototype.addSub = function addSub(sub) {
    this.subs.push(sub);
  };

  Dep.prototype.removeSub = function removeSub(sub) {
    remove(this.subs, sub);
  };

  Dep.prototype.depend = function depend() {
    if (Dep.target) {
      Dep.target.addDep(this);
    }
  };

  Dep.prototype.notify = function notify() {
    // stabilize the subscriber list first
    var subs = this.subs.slice();
    for (var i = 0, l = subs.length; i < l; i++) {
      subs[i].update();
    }
  };

  // the current target watcher being evaluated.
  // this is globally unique because there could be only one
  // watcher being evaluated at any time.
  Dep.target = null;
  var targetStack = [];

  function pushTarget(_target) {
    if (Dep.target) {
      targetStack.push(Dep.target);
    }
    Dep.target = _target;
  }

  function popTarget() {
    Dep.target = targetStack.pop();
  }

  /*
   * not type checking this file because flow doesn't play well with
   * dynamically accessing methods on Array prototype
   */

  var arrayProto = Array.prototype;
  var arrayMethods = Object.create(arrayProto);['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(function (method) {
    // cache original method
    var original = arrayProto[method];
    def(arrayMethods, method, function mutator() {
      var arguments$1 = arguments;

      // avoid leaking arguments:
      // http://jsperf.com/closure-with-arguments
      var i = arguments.length;
      var args = new Array(i);
      while (i--) {
        args[i] = arguments$1[i];
      }
      var result = original.apply(this, args);
      var ob = this.__ob__;
      var inserted;
      switch (method) {
        case 'push':
          inserted = args;
          break;
        case 'unshift':
          inserted = args;
          break;
        case 'splice':
          inserted = args.slice(2);
          break;
      }
      if (inserted) {
        ob.observeArray(inserted);
      }
      // notify change
      ob.dep.notify();
      return result;
    });
  });

  /*  */

  var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

  /**
   * By default, when a reactive property is set, the new value is
   * also converted to become reactive. However when passing down props,
   * we don't want to force conversion because the value may be a nested value
   * under a frozen data structure. Converting it would defeat the optimization.
   */
  var observerState = {
    shouldConvert: true,
    isSettingProps: false
  };

  /**
   * Observer class that are attached to each observed
   * object. Once attached, the observer converts target
   * object's property keys into getter/setters that
   * collect dependencies and dispatches updates.
   */
  var Observer = function Observer(value) {
    this.value = value;
    this.dep = new Dep();
    this.vmCount = 0;
    def(value, '__ob__', this);
    if (Array.isArray(value)) {
      var augment = hasProto ? protoAugment : copyAugment;
      augment(value, arrayMethods, arrayKeys);
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  };

  /**
   * Walk through each property and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   */
  Observer.prototype.walk = function walk(obj) {
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      defineReactive$$1(obj, keys[i], obj[keys[i]]);
    }
  };

  /**
   * Observe a list of Array items.
   */
  Observer.prototype.observeArray = function observeArray(items) {
    for (var i = 0, l = items.length; i < l; i++) {
      observe(items[i]);
    }
  };

  // helpers

  /**
   * Augment an target Object or Array by intercepting
   * the prototype chain using __proto__
   */
  function protoAugment(target, src) {
    /* eslint-disable no-proto */
    target.__proto__ = src;
    /* eslint-enable no-proto */
  }

  /**
   * Augment an target Object or Array by defining
   * hidden properties.
   */
  /* istanbul ignore next */
  function copyAugment(target, src, keys) {
    for (var i = 0, l = keys.length; i < l; i++) {
      var key = keys[i];
      def(target, key, src[key]);
    }
  }

  /**
   * Attempt to create an observer instance for a value,
   * returns the new observer if successfully observed,
   * or the existing observer if the value already has one.
   */
  function observe(value, asRootData) {
    if (!isObject(value)) {
      return;
    }
    var ob;
    if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
      ob = value.__ob__;
    } else if (observerState.shouldConvert && !isServerRendering() && (Array.isArray(value) || isPlainObject(value)) && Object.isExtensible(value) && !value._isVue) {
      ob = new Observer(value);
    }
    if (asRootData && ob) {
      ob.vmCount++;
    }
    return ob;
  }

  /**
   * Define a reactive property on an Object.
   */
  function defineReactive$$1(obj, key, val, customSetter) {
    var dep = new Dep();

    var property = Object.getOwnPropertyDescriptor(obj, key);
    if (property && property.configurable === false) {
      return;
    }

    // cater for pre-defined getter/setters
    var getter = property && property.get;
    var setter = property && property.set;

    var childOb = observe(val);
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get: function reactiveGetter() {
        var value = getter ? getter.call(obj) : val;
        if (Dep.target) {
          dep.depend();
          if (childOb) {
            childOb.dep.depend();
          }
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
        return value;
      },
      set: function reactiveSetter(newVal) {
        var value = getter ? getter.call(obj) : val;
        /* eslint-disable no-self-compare */
        if (newVal === value || newVal !== newVal && value !== value) {
          return;
        }
        /* eslint-enable no-self-compare */
        if ("development" !== 'production' && customSetter) {
          customSetter();
        }
        if (setter) {
          setter.call(obj, newVal);
        } else {
          val = newVal;
        }
        childOb = observe(newVal);
        dep.notify();
      }
    });
  }

  /**
   * Set a property on an object. Adds the new property and
   * triggers change notification if the property doesn't
   * already exist.
   */
  function set(target, key, val) {
    if (Array.isArray(target)) {
      target.length = Math.max(target.length, key);
      target.splice(key, 1, val);
      return val;
    }
    if (hasOwn(target, key)) {
      target[key] = val;
      return val;
    }
    var ob = target.__ob__;
    if (target._isVue || ob && ob.vmCount) {
      "development" !== 'production' && warn('Avoid adding reactive properties to a Vue instance or its root $data ' + 'at runtime - declare it upfront in the data option.');
      return val;
    }
    if (!ob) {
      target[key] = val;
      return val;
    }
    defineReactive$$1(ob.value, key, val);
    ob.dep.notify();
    return val;
  }

  /**
   * Delete a property and trigger change if necessary.
   */
  function del(target, key) {
    if (Array.isArray(target)) {
      target.splice(key, 1);
      return;
    }
    var ob = target.__ob__;
    if (target._isVue || ob && ob.vmCount) {
      "development" !== 'production' && warn('Avoid deleting properties on a Vue instance or its root $data ' + '- just set it to null.');
      return;
    }
    if (!hasOwn(target, key)) {
      return;
    }
    delete target[key];
    if (!ob) {
      return;
    }
    ob.dep.notify();
  }

  /**
   * Collect dependencies on array elements when the array is touched, since
   * we cannot intercept array element access like property getters.
   */
  function dependArray(value) {
    for (var e = void 0, i = 0, l = value.length; i < l; i++) {
      e = value[i];
      e && e.__ob__ && e.__ob__.dep.depend();
      if (Array.isArray(e)) {
        dependArray(e);
      }
    }
  }

  /*  */

  /**
   * Option overwriting strategies are functions that handle
   * how to merge a parent option value and a child option
   * value into the final value.
   */
  var strats = config.optionMergeStrategies;

  /**
   * Options with restrictions
   */
  {
    strats.el = strats.propsData = function (parent, child, vm, key) {
      if (!vm) {
        warn("option \"" + key + "\" can only be used during instance " + 'creation with the `new` keyword.');
      }
      return defaultStrat(parent, child);
    };
  }

  /**
   * Helper that recursively merges two data objects together.
   */
  function mergeData(to, from) {
    if (!from) {
      return to;
    }
    var key, toVal, fromVal;
    var keys = Object.keys(from);
    for (var i = 0; i < keys.length; i++) {
      key = keys[i];
      toVal = to[key];
      fromVal = from[key];
      if (!hasOwn(to, key)) {
        set(to, key, fromVal);
      } else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
        mergeData(toVal, fromVal);
      }
    }
    return to;
  }

  /**
   * Data
   */
  strats.data = function (parentVal, childVal, vm) {
    if (!vm) {
      // in a Vue.extend merge, both should be functions
      if (!childVal) {
        return parentVal;
      }
      if (typeof childVal !== 'function') {
        "development" !== 'production' && warn('The "data" option should be a function ' + 'that returns a per-instance value in component ' + 'definitions.', vm);
        return parentVal;
      }
      if (!parentVal) {
        return childVal;
      }
      // when parentVal & childVal are both present,
      // we need to return a function that returns the
      // merged result of both functions... no need to
      // check if parentVal is a function here because
      // it has to be a function to pass previous merges.
      return function mergedDataFn() {
        return mergeData(childVal.call(this), parentVal.call(this));
      };
    } else if (parentVal || childVal) {
      return function mergedInstanceDataFn() {
        // instance merge
        var instanceData = typeof childVal === 'function' ? childVal.call(vm) : childVal;
        var defaultData = typeof parentVal === 'function' ? parentVal.call(vm) : undefined;
        if (instanceData) {
          return mergeData(instanceData, defaultData);
        } else {
          return defaultData;
        }
      };
    }
  };

  /**
   * Hooks and props are merged as arrays.
   */
  function mergeHook(parentVal, childVal) {
    return childVal ? parentVal ? parentVal.concat(childVal) : Array.isArray(childVal) ? childVal : [childVal] : parentVal;
  }

  config._lifecycleHooks.forEach(function (hook) {
    strats[hook] = mergeHook;
  });

  /**
   * Assets
   *
   * When a vm is present (instance creation), we need to do
   * a three-way merge between constructor options, instance
   * options and parent options.
   */
  function mergeAssets(parentVal, childVal) {
    var res = Object.create(parentVal || null);
    return childVal ? extend(res, childVal) : res;
  }

  config._assetTypes.forEach(function (type) {
    strats[type + 's'] = mergeAssets;
  });

  /**
   * Watchers.
   *
   * Watchers hashes should not overwrite one
   * another, so we merge them as arrays.
   */
  strats.watch = function (parentVal, childVal) {
    /* istanbul ignore if */
    if (!childVal) {
      return Object.create(parentVal || null);
    }
    if (!parentVal) {
      return childVal;
    }
    var ret = {};
    extend(ret, parentVal);
    for (var key in childVal) {
      var parent = ret[key];
      var child = childVal[key];
      if (parent && !Array.isArray(parent)) {
        parent = [parent];
      }
      ret[key] = parent ? parent.concat(child) : [child];
    }
    return ret;
  };

  /**
   * Other object hashes.
   */
  strats.props = strats.methods = strats.computed = function (parentVal, childVal) {
    if (!childVal) {
      return Object.create(parentVal || null);
    }
    if (!parentVal) {
      return childVal;
    }
    var ret = Object.create(null);
    extend(ret, parentVal);
    extend(ret, childVal);
    return ret;
  };

  /**
   * Default strategy.
   */
  var defaultStrat = function defaultStrat(parentVal, childVal) {
    return childVal === undefined ? parentVal : childVal;
  };

  /**
   * Validate component names
   */
  function checkComponents(options) {
    for (var key in options.components) {
      var lower = key.toLowerCase();
      if (isBuiltInTag(lower) || config.isReservedTag(lower)) {
        warn('Do not use built-in or reserved HTML elements as component ' + 'id: ' + key);
      }
    }
  }

  /**
   * Ensure all props option syntax are normalized into the
   * Object-based format.
   */
  function normalizeProps(options) {
    var props = options.props;
    if (!props) {
      return;
    }
    var res = {};
    var i, val, name;
    if (Array.isArray(props)) {
      i = props.length;
      while (i--) {
        val = props[i];
        if (typeof val === 'string') {
          name = camelize(val);
          res[name] = { type: null };
        } else {
          warn('props must be strings when using array syntax.');
        }
      }
    } else if (isPlainObject(props)) {
      for (var key in props) {
        val = props[key];
        name = camelize(key);
        res[name] = isPlainObject(val) ? val : { type: val };
      }
    }
    options.props = res;
  }

  /**
   * Normalize raw function directives into object format.
   */
  function normalizeDirectives(options) {
    var dirs = options.directives;
    if (dirs) {
      for (var key in dirs) {
        var def = dirs[key];
        if (typeof def === 'function') {
          dirs[key] = { bind: def, update: def };
        }
      }
    }
  }

  /**
   * Merge two option objects into a new one.
   * Core utility used in both instantiation and inheritance.
   */
  function mergeOptions(parent, child, vm) {
    {
      checkComponents(child);
    }
    normalizeProps(child);
    normalizeDirectives(child);
    var extendsFrom = child.extends;
    if (extendsFrom) {
      parent = typeof extendsFrom === 'function' ? mergeOptions(parent, extendsFrom.options, vm) : mergeOptions(parent, extendsFrom, vm);
    }
    if (child.mixins) {
      for (var i = 0, l = child.mixins.length; i < l; i++) {
        var mixin = child.mixins[i];
        if (mixin.prototype instanceof Vue$3) {
          mixin = mixin.options;
        }
        parent = mergeOptions(parent, mixin, vm);
      }
    }
    var options = {};
    var key;
    for (key in parent) {
      mergeField(key);
    }
    for (key in child) {
      if (!hasOwn(parent, key)) {
        mergeField(key);
      }
    }
    function mergeField(key) {
      var strat = strats[key] || defaultStrat;
      options[key] = strat(parent[key], child[key], vm, key);
    }
    return options;
  }

  /**
   * Resolve an asset.
   * This function is used because child instances need access
   * to assets defined in its ancestor chain.
   */
  function resolveAsset(options, type, id, warnMissing) {
    /* istanbul ignore if */
    if (typeof id !== 'string') {
      return;
    }
    var assets = options[type];
    // check local registration variations first
    if (hasOwn(assets, id)) {
      return assets[id];
    }
    var camelizedId = camelize(id);
    if (hasOwn(assets, camelizedId)) {
      return assets[camelizedId];
    }
    var PascalCaseId = capitalize(camelizedId);
    if (hasOwn(assets, PascalCaseId)) {
      return assets[PascalCaseId];
    }
    // fallback to prototype chain
    var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
    if ("development" !== 'production' && warnMissing && !res) {
      warn('Failed to resolve ' + type.slice(0, -1) + ': ' + id, options);
    }
    return res;
  }

  /*  */

  function validateProp(key, propOptions, propsData, vm) {
    var prop = propOptions[key];
    var absent = !hasOwn(propsData, key);
    var value = propsData[key];
    // handle boolean props
    if (isType(Boolean, prop.type)) {
      if (absent && !hasOwn(prop, 'default')) {
        value = false;
      } else if (!isType(String, prop.type) && (value === '' || value === hyphenate(key))) {
        value = true;
      }
    }
    // check default value
    if (value === undefined) {
      value = getPropDefaultValue(vm, prop, key);
      // since the default value is a fresh copy,
      // make sure to observe it.
      var prevShouldConvert = observerState.shouldConvert;
      observerState.shouldConvert = true;
      observe(value);
      observerState.shouldConvert = prevShouldConvert;
    }
    {
      assertProp(prop, key, value, vm, absent);
    }
    return value;
  }

  /**
   * Get the default value of a prop.
   */
  function getPropDefaultValue(vm, prop, key) {
    // no default, return undefined
    if (!hasOwn(prop, 'default')) {
      return undefined;
    }
    var def = prop.default;
    // warn against non-factory defaults for Object & Array
    if ("development" !== 'production' && isObject(def)) {
      warn('Invalid default value for prop "' + key + '": ' + 'Props with type Object/Array must use a factory function ' + 'to return the default value.', vm);
    }
    // the raw prop value was also undefined from previous render,
    // return previous default value to avoid unnecessary watcher trigger
    if (vm && vm.$options.propsData && vm.$options.propsData[key] === undefined && vm._props[key] !== undefined) {
      return vm._props[key];
    }
    // call factory function for non-Function types
    // a value is Function if its prototype is function even across different execution context
    return typeof def === 'function' && getType(prop.type) !== 'Function' ? def.call(vm) : def;
  }

  /**
   * Assert whether a prop is valid.
   */
  function assertProp(prop, name, value, vm, absent) {
    if (prop.required && absent) {
      warn('Missing required prop: "' + name + '"', vm);
      return;
    }
    if (value == null && !prop.required) {
      return;
    }
    var type = prop.type;
    var valid = !type || type === true;
    var expectedTypes = [];
    if (type) {
      if (!Array.isArray(type)) {
        type = [type];
      }
      for (var i = 0; i < type.length && !valid; i++) {
        var assertedType = assertType(value, type[i]);
        expectedTypes.push(assertedType.expectedType || '');
        valid = assertedType.valid;
      }
    }
    if (!valid) {
      warn('Invalid prop: type check failed for prop "' + name + '".' + ' Expected ' + expectedTypes.map(capitalize).join(', ') + ', got ' + Object.prototype.toString.call(value).slice(8, -1) + '.', vm);
      return;
    }
    var validator = prop.validator;
    if (validator) {
      if (!validator(value)) {
        warn('Invalid prop: custom validator check failed for prop "' + name + '".', vm);
      }
    }
  }

  /**
   * Assert the type of a value
   */
  function assertType(value, type) {
    var valid;
    var expectedType = getType(type);
    if (expectedType === 'String') {
      valid = (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === (expectedType = 'string');
    } else if (expectedType === 'Number') {
      valid = (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === (expectedType = 'number');
    } else if (expectedType === 'Boolean') {
      valid = (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === (expectedType = 'boolean');
    } else if (expectedType === 'Function') {
      valid = (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === (expectedType = 'function');
    } else if (expectedType === 'Object') {
      valid = isPlainObject(value);
    } else if (expectedType === 'Array') {
      valid = Array.isArray(value);
    } else {
      valid = value instanceof type;
    }
    return {
      valid: valid,
      expectedType: expectedType
    };
  }

  /**
   * Use function string name to check built-in types,
   * because a simple equality check will fail when running
   * across different vms / iframes.
   */
  function getType(fn) {
    var match = fn && fn.toString().match(/^\s*function (\w+)/);
    return match && match[1];
  }

  function isType(type, fn) {
    if (!Array.isArray(fn)) {
      return getType(fn) === getType(type);
    }
    for (var i = 0, len = fn.length; i < len; i++) {
      if (getType(fn[i]) === getType(type)) {
        return true;
      }
    }
    /* istanbul ignore next */
    return false;
  }

  function handleError(err, vm, info) {
    if (config.errorHandler) {
      config.errorHandler.call(null, err, vm, info);
    } else {
      {
        warn("Error in " + info + ":", vm);
      }
      /* istanbul ignore else */
      if (inBrowser && typeof console !== 'undefined') {
        console.error(err);
      } else {
        throw err;
      }
    }
  }

  /* not type checking this file because flow doesn't play well with Proxy */

  var initProxy;

  {
    var allowedGlobals = makeMap('Infinity,undefined,NaN,isFinite,isNaN,' + 'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' + 'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' + 'require' // for Webpack/Browserify
    );

    var warnNonPresent = function warnNonPresent(target, key) {
      warn("Property or method \"" + key + "\" is not defined on the instance but " + "referenced during render. Make sure to declare reactive data " + "properties in the data option.", target);
    };

    var hasProxy = typeof Proxy !== 'undefined' && Proxy.toString().match(/native code/);

    if (hasProxy) {
      var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta');
      config.keyCodes = new Proxy(config.keyCodes, {
        set: function set(target, key, value) {
          if (isBuiltInModifier(key)) {
            warn("Avoid overwriting built-in modifier in config.keyCodes: ." + key);
            return false;
          } else {
            target[key] = value;
            return true;
          }
        }
      });
    }

    var hasHandler = {
      has: function has(target, key) {
        var has = key in target;
        var isAllowed = allowedGlobals(key) || key.charAt(0) === '_';
        if (!has && !isAllowed) {
          warnNonPresent(target, key);
        }
        return has || !isAllowed;
      }
    };

    var getHandler = {
      get: function get(target, key) {
        if (typeof key === 'string' && !(key in target)) {
          warnNonPresent(target, key);
        }
        return target[key];
      }
    };

    initProxy = function initProxy(vm) {
      if (hasProxy) {
        // determine which proxy handler to use
        var options = vm.$options;
        var handlers = options.render && options.render._withStripped ? getHandler : hasHandler;
        vm._renderProxy = new Proxy(vm, handlers);
      } else {
        vm._renderProxy = vm;
      }
    };
  }

  /*  */

  var VNode = function VNode(tag, data, children, text, elm, context, componentOptions) {
    this.tag = tag;
    this.data = data;
    this.children = children;
    this.text = text;
    this.elm = elm;
    this.ns = undefined;
    this.context = context;
    this.functionalContext = undefined;
    this.key = data && data.key;
    this.componentOptions = componentOptions;
    this.componentInstance = undefined;
    this.parent = undefined;
    this.raw = false;
    this.isStatic = false;
    this.isRootInsert = true;
    this.isComment = false;
    this.isCloned = false;
    this.isOnce = false;
  };

  var prototypeAccessors = { child: {} };

  // DEPRECATED: alias for componentInstance for backwards compat.
  /* istanbul ignore next */
  prototypeAccessors.child.get = function () {
    return this.componentInstance;
  };

  Object.defineProperties(VNode.prototype, prototypeAccessors);

  var createEmptyVNode = function createEmptyVNode() {
    var node = new VNode();
    node.text = '';
    node.isComment = true;
    return node;
  };

  function createTextVNode(val) {
    return new VNode(undefined, undefined, undefined, String(val));
  }

  // optimized shallow clone
  // used for static nodes and slot nodes because they may be reused across
  // multiple renders, cloning them avoids errors when DOM manipulations rely
  // on their elm reference.
  function cloneVNode(vnode) {
    var cloned = new VNode(vnode.tag, vnode.data, vnode.children, vnode.text, vnode.elm, vnode.context, vnode.componentOptions);
    cloned.ns = vnode.ns;
    cloned.isStatic = vnode.isStatic;
    cloned.key = vnode.key;
    cloned.isCloned = true;
    return cloned;
  }

  function cloneVNodes(vnodes) {
    var len = vnodes.length;
    var res = new Array(len);
    for (var i = 0; i < len; i++) {
      res[i] = cloneVNode(vnodes[i]);
    }
    return res;
  }

  /*  */

  var normalizeEvent = cached(function (name) {
    var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
    name = once$$1 ? name.slice(1) : name;
    var capture = name.charAt(0) === '!';
    name = capture ? name.slice(1) : name;
    return {
      name: name,
      once: once$$1,
      capture: capture
    };
  });

  function createFnInvoker(fns) {
    function invoker() {
      var arguments$1 = arguments;

      var fns = invoker.fns;
      if (Array.isArray(fns)) {
        for (var i = 0; i < fns.length; i++) {
          fns[i].apply(null, arguments$1);
        }
      } else {
        // return handler return value for single handlers
        return fns.apply(null, arguments);
      }
    }
    invoker.fns = fns;
    return invoker;
  }

  function updateListeners(on, oldOn, add, remove$$1, vm) {
    var name, cur, old, event;
    for (name in on) {
      cur = on[name];
      old = oldOn[name];
      event = normalizeEvent(name);
      if (!cur) {
        "development" !== 'production' && warn("Invalid handler for event \"" + event.name + "\": got " + String(cur), vm);
      } else if (!old) {
        if (!cur.fns) {
          cur = on[name] = createFnInvoker(cur);
        }
        add(event.name, cur, event.once, event.capture);
      } else if (cur !== old) {
        old.fns = cur;
        on[name] = old;
      }
    }
    for (name in oldOn) {
      if (!on[name]) {
        event = normalizeEvent(name);
        remove$$1(event.name, oldOn[name], event.capture);
      }
    }
  }

  /*  */

  function mergeVNodeHook(def, hookKey, hook) {
    var invoker;
    var oldHook = def[hookKey];

    function wrappedHook() {
      hook.apply(this, arguments);
      // important: remove merged hook to ensure it's called only once
      // and prevent memory leak
      remove(invoker.fns, wrappedHook);
    }

    if (!oldHook) {
      // no existing hook
      invoker = createFnInvoker([wrappedHook]);
    } else {
      /* istanbul ignore if */
      if (oldHook.fns && oldHook.merged) {
        // already a merged invoker
        invoker = oldHook;
        invoker.fns.push(wrappedHook);
      } else {
        // existing plain hook
        invoker = createFnInvoker([oldHook, wrappedHook]);
      }
    }

    invoker.merged = true;
    def[hookKey] = invoker;
  }

  /*  */

  // The template compiler attempts to minimize the need for normalization by
  // statically analyzing the template at compile time.
  //
  // For plain HTML markup, normalization can be completely skipped because the
  // generated render function is guaranteed to return Array<VNode>. There are
  // two cases where extra normalization is needed:

  // 1. When the children contains components - because a functional component
  // may return an Array instead of a single root. In this case, just a simple
  // normalization is needed - if any child is an Array, we flatten the whole
  // thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
  // because functional components already normalize their own children.
  function simpleNormalizeChildren(children) {
    for (var i = 0; i < children.length; i++) {
      if (Array.isArray(children[i])) {
        return Array.prototype.concat.apply([], children);
      }
    }
    return children;
  }

  // 2. When the children contains constructs that always generated nested Arrays,
  // e.g. <template>, <slot>, v-for, or when the children is provided by user
  // with hand-written render functions / JSX. In such cases a full normalization
  // is needed to cater to all possible types of children values.
  function normalizeChildren(children) {
    return isPrimitive(children) ? [createTextVNode(children)] : Array.isArray(children) ? normalizeArrayChildren(children) : undefined;
  }

  function normalizeArrayChildren(children, nestedIndex) {
    var res = [];
    var i, c, last;
    for (i = 0; i < children.length; i++) {
      c = children[i];
      if (c == null || typeof c === 'boolean') {
        continue;
      }
      last = res[res.length - 1];
      //  nested
      if (Array.isArray(c)) {
        res.push.apply(res, normalizeArrayChildren(c, (nestedIndex || '') + "_" + i));
      } else if (isPrimitive(c)) {
        if (last && last.text) {
          last.text += String(c);
        } else if (c !== '') {
          // convert primitive to vnode
          res.push(createTextVNode(c));
        }
      } else {
        if (c.text && last && last.text) {
          res[res.length - 1] = createTextVNode(last.text + c.text);
        } else {
          // default key for nested array children (likely generated by v-for)
          if (c.tag && c.key == null && nestedIndex != null) {
            c.key = "__vlist" + nestedIndex + "_" + i + "__";
          }
          res.push(c);
        }
      }
    }
    return res;
  }

  /*  */

  function getFirstComponentChild(children) {
    return children && children.filter(function (c) {
      return c && c.componentOptions;
    })[0];
  }

  /*  */

  function initEvents(vm) {
    vm._events = Object.create(null);
    vm._hasHookEvent = false;
    // init parent attached events
    var listeners = vm.$options._parentListeners;
    if (listeners) {
      updateComponentListeners(vm, listeners);
    }
  }

  var target;

  function add(event, fn, once$$1) {
    if (once$$1) {
      target.$once(event, fn);
    } else {
      target.$on(event, fn);
    }
  }

  function remove$1(event, fn) {
    target.$off(event, fn);
  }

  function updateComponentListeners(vm, listeners, oldListeners) {
    target = vm;
    updateListeners(listeners, oldListeners || {}, add, remove$1, vm);
  }

  function eventsMixin(Vue) {
    var hookRE = /^hook:/;
    Vue.prototype.$on = function (event, fn) {
      var this$1 = this;

      var vm = this;
      if (Array.isArray(event)) {
        for (var i = 0, l = event.length; i < l; i++) {
          this$1.$on(event[i], fn);
        }
      } else {
        (vm._events[event] || (vm._events[event] = [])).push(fn);
        // optimize hook:event cost by using a boolean flag marked at registration
        // instead of a hash lookup
        if (hookRE.test(event)) {
          vm._hasHookEvent = true;
        }
      }
      return vm;
    };

    Vue.prototype.$once = function (event, fn) {
      var vm = this;
      function on() {
        vm.$off(event, on);
        fn.apply(vm, arguments);
      }
      on.fn = fn;
      vm.$on(event, on);
      return vm;
    };

    Vue.prototype.$off = function (event, fn) {
      var this$1 = this;

      var vm = this;
      // all
      if (!arguments.length) {
        vm._events = Object.create(null);
        return vm;
      }
      // array of events
      if (Array.isArray(event)) {
        for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
          this$1.$off(event[i$1], fn);
        }
        return vm;
      }
      // specific event
      var cbs = vm._events[event];
      if (!cbs) {
        return vm;
      }
      if (arguments.length === 1) {
        vm._events[event] = null;
        return vm;
      }
      // specific handler
      var cb;
      var i = cbs.length;
      while (i--) {
        cb = cbs[i];
        if (cb === fn || cb.fn === fn) {
          cbs.splice(i, 1);
          break;
        }
      }
      return vm;
    };

    Vue.prototype.$emit = function (event) {
      var vm = this;
      var cbs = vm._events[event];
      if (cbs) {
        cbs = cbs.length > 1 ? toArray(cbs) : cbs;
        var args = toArray(arguments, 1);
        for (var i = 0, l = cbs.length; i < l; i++) {
          cbs[i].apply(vm, args);
        }
      }
      return vm;
    };
  }

  /*  */

  /**
   * Runtime helper for resolving raw children VNodes into a slot object.
   */
  function resolveSlots(children, context) {
    var slots = {};
    if (!children) {
      return slots;
    }
    var defaultSlot = [];
    var name, child;
    for (var i = 0, l = children.length; i < l; i++) {
      child = children[i];
      // named slots should only be respected if the vnode was rendered in the
      // same context.
      if ((child.context === context || child.functionalContext === context) && child.data && (name = child.data.slot)) {
        var slot = slots[name] || (slots[name] = []);
        if (child.tag === 'template') {
          slot.push.apply(slot, child.children);
        } else {
          slot.push(child);
        }
      } else {
        defaultSlot.push(child);
      }
    }
    // ignore whitespace
    if (!defaultSlot.every(isWhitespace)) {
      slots.default = defaultSlot;
    }
    return slots;
  }

  function isWhitespace(node) {
    return node.isComment || node.text === ' ';
  }

  function resolveScopedSlots(fns) {
    var res = {};
    for (var i = 0; i < fns.length; i++) {
      res[fns[i][0]] = fns[i][1];
    }
    return res;
  }

  /*  */

  var activeInstance = null;

  function initLifecycle(vm) {
    var options = vm.$options;

    // locate first non-abstract parent
    var parent = options.parent;
    if (parent && !options.abstract) {
      while (parent.$options.abstract && parent.$parent) {
        parent = parent.$parent;
      }
      parent.$children.push(vm);
    }

    vm.$parent = parent;
    vm.$root = parent ? parent.$root : vm;

    vm.$children = [];
    vm.$refs = {};

    vm._watcher = null;
    vm._inactive = null;
    vm._directInactive = false;
    vm._isMounted = false;
    vm._isDestroyed = false;
    vm._isBeingDestroyed = false;
  }

  function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode, hydrating) {
      var vm = this;
      if (vm._isMounted) {
        callHook(vm, 'beforeUpdate');
      }
      var prevEl = vm.$el;
      var prevVnode = vm._vnode;
      var prevActiveInstance = activeInstance;
      activeInstance = vm;
      vm._vnode = vnode;
      // Vue.prototype.__patch__ is injected in entry points
      // based on the rendering backend used.
      if (!prevVnode) {
        // initial render
        vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */
        , vm.$options._parentElm, vm.$options._refElm);
      } else {
        // updates
        vm.$el = vm.__patch__(prevVnode, vnode);
      }
      activeInstance = prevActiveInstance;
      // update __vue__ reference
      if (prevEl) {
        prevEl.__vue__ = null;
      }
      if (vm.$el) {
        vm.$el.__vue__ = vm;
      }
      // if parent is an HOC, update its $el as well
      if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
        vm.$parent.$el = vm.$el;
      }
      // updated hook is called by the scheduler to ensure that children are
      // updated in a parent's updated hook.
    };

    Vue.prototype.$forceUpdate = function () {
      var vm = this;
      if (vm._watcher) {
        vm._watcher.update();
      }
    };

    Vue.prototype.$destroy = function () {
      var vm = this;
      if (vm._isBeingDestroyed) {
        return;
      }
      callHook(vm, 'beforeDestroy');
      vm._isBeingDestroyed = true;
      // remove self from parent
      var parent = vm.$parent;
      if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
        remove(parent.$children, vm);
      }
      // teardown watchers
      if (vm._watcher) {
        vm._watcher.teardown();
      }
      var i = vm._watchers.length;
      while (i--) {
        vm._watchers[i].teardown();
      }
      // remove reference from data ob
      // frozen object may not have observer.
      if (vm._data.__ob__) {
        vm._data.__ob__.vmCount--;
      }
      // call the last hook...
      vm._isDestroyed = true;
      callHook(vm, 'destroyed');
      // turn off all instance listeners.
      vm.$off();
      // remove __vue__ reference
      if (vm.$el) {
        vm.$el.__vue__ = null;
      }
      // invoke destroy hooks on current rendered tree
      vm.__patch__(vm._vnode, null);
    };
  }

  function mountComponent(vm, el, hydrating) {
    vm.$el = el;
    if (!vm.$options.render) {
      vm.$options.render = createEmptyVNode;
      {
        /* istanbul ignore if */
        if (vm.$options.template && vm.$options.template.charAt(0) !== '#' || vm.$options.el || el) {
          warn('You are using the runtime-only build of Vue where the template ' + 'compiler is not available. Either pre-compile the templates into ' + 'render functions, or use the compiler-included build.', vm);
        } else {
          warn('Failed to mount component: template or render function not defined.', vm);
        }
      }
    }
    callHook(vm, 'beforeMount');

    var updateComponent;
    /* istanbul ignore if */
    if ("development" !== 'production' && config.performance && perf) {
      updateComponent = function updateComponent() {
        var name = vm._name;
        var startTag = "start " + name;
        var endTag = "end " + name;
        perf.mark(startTag);
        var vnode = vm._render();
        perf.mark(endTag);
        perf.measure(name + " render", startTag, endTag);
        perf.mark(startTag);
        vm._update(vnode, hydrating);
        perf.mark(endTag);
        perf.measure(name + " patch", startTag, endTag);
      };
    } else {
      updateComponent = function updateComponent() {
        vm._update(vm._render(), hydrating);
      };
    }

    vm._watcher = new Watcher(vm, updateComponent, noop);
    hydrating = false;

    // manually mounted instance, call mounted on self
    // mounted is called for render-created child components in its inserted hook
    if (vm.$vnode == null) {
      vm._isMounted = true;
      callHook(vm, 'mounted');
    }
    return vm;
  }

  function updateChildComponent(vm, propsData, listeners, parentVnode, renderChildren) {
    // determine whether component has slot children
    // we need to do this before overwriting $options._renderChildren
    var hasChildren = !!(renderChildren || // has new static slots
    vm.$options._renderChildren || // has old static slots
    parentVnode.data.scopedSlots || // has new scoped slots
    vm.$scopedSlots !== emptyObject // has old scoped slots
    );

    vm.$options._parentVnode = parentVnode;
    vm.$vnode = parentVnode; // update vm's placeholder node without re-render
    if (vm._vnode) {
      // update child tree's parent
      vm._vnode.parent = parentVnode;
    }
    vm.$options._renderChildren = renderChildren;

    // update props
    if (propsData && vm.$options.props) {
      observerState.shouldConvert = false;
      {
        observerState.isSettingProps = true;
      }
      var props = vm._props;
      var propKeys = vm.$options._propKeys || [];
      for (var i = 0; i < propKeys.length; i++) {
        var key = propKeys[i];
        props[key] = validateProp(key, vm.$options.props, propsData, vm);
      }
      observerState.shouldConvert = true;
      {
        observerState.isSettingProps = false;
      }
      // keep a copy of raw propsData
      vm.$options.propsData = propsData;
    }
    // update listeners
    if (listeners) {
      var oldListeners = vm.$options._parentListeners;
      vm.$options._parentListeners = listeners;
      updateComponentListeners(vm, listeners, oldListeners);
    }
    // resolve slots + force update if has children
    if (hasChildren) {
      vm.$slots = resolveSlots(renderChildren, parentVnode.context);
      vm.$forceUpdate();
    }
  }

  function isInInactiveTree(vm) {
    while (vm && (vm = vm.$parent)) {
      if (vm._inactive) {
        return true;
      }
    }
    return false;
  }

  function activateChildComponent(vm, direct) {
    if (direct) {
      vm._directInactive = false;
      if (isInInactiveTree(vm)) {
        return;
      }
    } else if (vm._directInactive) {
      return;
    }
    if (vm._inactive || vm._inactive == null) {
      vm._inactive = false;
      for (var i = 0; i < vm.$children.length; i++) {
        activateChildComponent(vm.$children[i]);
      }
      callHook(vm, 'activated');
    }
  }

  function deactivateChildComponent(vm, direct) {
    if (direct) {
      vm._directInactive = true;
      if (isInInactiveTree(vm)) {
        return;
      }
    }
    if (!vm._inactive) {
      vm._inactive = true;
      for (var i = 0; i < vm.$children.length; i++) {
        deactivateChildComponent(vm.$children[i]);
      }
      callHook(vm, 'deactivated');
    }
  }

  function callHook(vm, hook) {
    var handlers = vm.$options[hook];
    if (handlers) {
      for (var i = 0, j = handlers.length; i < j; i++) {
        try {
          handlers[i].call(vm);
        } catch (e) {
          handleError(e, vm, hook + " hook");
        }
      }
    }
    if (vm._hasHookEvent) {
      vm.$emit('hook:' + hook);
    }
  }

  /*  */

  var queue = [];
  var has = {};
  var circular = {};
  var waiting = false;
  var flushing = false;
  var index = 0;

  /**
   * Reset the scheduler's state.
   */
  function resetSchedulerState() {
    queue.length = 0;
    has = {};
    {
      circular = {};
    }
    waiting = flushing = false;
  }

  /**
   * Flush both queues and run the watchers.
   */
  function flushSchedulerQueue() {
    flushing = true;
    var watcher, id, vm;

    // Sort queue before flush.
    // This ensures that:
    // 1. Components are updated from parent to child. (because parent is always
    //    created before the child)
    // 2. A component's user watchers are run before its render watcher (because
    //    user watchers are created before the render watcher)
    // 3. If a component is destroyed during a parent component's watcher run,
    //    its watchers can be skipped.
    queue.sort(function (a, b) {
      return a.id - b.id;
    });

    // do not cache length because more watchers might be pushed
    // as we run existing watchers
    for (index = 0; index < queue.length; index++) {
      watcher = queue[index];
      id = watcher.id;
      has[id] = null;
      watcher.run();
      // in dev build, check and stop circular updates.
      if ("development" !== 'production' && has[id] != null) {
        circular[id] = (circular[id] || 0) + 1;
        if (circular[id] > config._maxUpdateCount) {
          warn('You may have an infinite update loop ' + (watcher.user ? "in watcher with expression \"" + watcher.expression + "\"" : "in a component render function."), watcher.vm);
          break;
        }
      }
    }

    // call updated hooks
    index = queue.length;
    while (index--) {
      watcher = queue[index];
      vm = watcher.vm;
      if (vm._watcher === watcher && vm._isMounted) {
        callHook(vm, 'updated');
      }
    }

    // devtool hook
    /* istanbul ignore if */
    if (devtools && config.devtools) {
      devtools.emit('flush');
    }

    resetSchedulerState();
  }

  /**
   * Push a watcher into the watcher queue.
   * Jobs with duplicate IDs will be skipped unless it's
   * pushed when the queue is being flushed.
   */
  function queueWatcher(watcher) {
    var id = watcher.id;
    if (has[id] == null) {
      has[id] = true;
      if (!flushing) {
        queue.push(watcher);
      } else {
        // if already flushing, splice the watcher based on its id
        // if already past its id, it will be run next immediately.
        var i = queue.length - 1;
        while (i >= 0 && queue[i].id > watcher.id) {
          i--;
        }
        queue.splice(Math.max(i, index) + 1, 0, watcher);
      }
      // queue the flush
      if (!waiting) {
        waiting = true;
        nextTick(flushSchedulerQueue);
      }
    }
  }

  /*  */

  var uid$2 = 0;

  /**
   * A watcher parses an expression, collects dependencies,
   * and fires callback when the expression value changes.
   * This is used for both the $watch() api and directives.
   */
  var Watcher = function Watcher(vm, expOrFn, cb, options) {
    this.vm = vm;
    vm._watchers.push(this);
    // options
    if (options) {
      this.deep = !!options.deep;
      this.user = !!options.user;
      this.lazy = !!options.lazy;
      this.sync = !!options.sync;
    } else {
      this.deep = this.user = this.lazy = this.sync = false;
    }
    this.cb = cb;
    this.id = ++uid$2; // uid for batching
    this.active = true;
    this.dirty = this.lazy; // for lazy watchers
    this.deps = [];
    this.newDeps = [];
    this.depIds = new _Set();
    this.newDepIds = new _Set();
    this.expression = expOrFn.toString();
    // parse expression for getter
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn;
    } else {
      this.getter = parsePath(expOrFn);
      if (!this.getter) {
        this.getter = function () {};
        "development" !== 'production' && warn("Failed watching path: \"" + expOrFn + "\" " + 'Watcher only accepts simple dot-delimited paths. ' + 'For full control, use a function instead.', vm);
      }
    }
    this.value = this.lazy ? undefined : this.get();
  };

  /**
   * Evaluate the getter, and re-collect dependencies.
   */
  Watcher.prototype.get = function get() {
    pushTarget(this);
    var value;
    var vm = this.vm;
    if (this.user) {
      try {
        value = this.getter.call(vm, vm);
      } catch (e) {
        handleError(e, vm, "getter for watcher \"" + this.expression + "\"");
      }
    } else {
      value = this.getter.call(vm, vm);
    }
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
    return value;
  };

  /**
   * Add a dependency to this directive.
   */
  Watcher.prototype.addDep = function addDep(dep) {
    var id = dep.id;
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id);
      this.newDeps.push(dep);
      if (!this.depIds.has(id)) {
        dep.addSub(this);
      }
    }
  };

  /**
   * Clean up for dependency collection.
   */
  Watcher.prototype.cleanupDeps = function cleanupDeps() {
    var this$1 = this;

    var i = this.deps.length;
    while (i--) {
      var dep = this$1.deps[i];
      if (!this$1.newDepIds.has(dep.id)) {
        dep.removeSub(this$1);
      }
    }
    var tmp = this.depIds;
    this.depIds = this.newDepIds;
    this.newDepIds = tmp;
    this.newDepIds.clear();
    tmp = this.deps;
    this.deps = this.newDeps;
    this.newDeps = tmp;
    this.newDeps.length = 0;
  };

  /**
   * Subscriber interface.
   * Will be called when a dependency changes.
   */
  Watcher.prototype.update = function update() {
    /* istanbul ignore else */
    if (this.lazy) {
      this.dirty = true;
    } else if (this.sync) {
      this.run();
    } else {
      queueWatcher(this);
    }
  };

  /**
   * Scheduler job interface.
   * Will be called by the scheduler.
   */
  Watcher.prototype.run = function run() {
    if (this.active) {
      var value = this.get();
      if (value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) || this.deep) {
        // set new value
        var oldValue = this.value;
        this.value = value;
        if (this.user) {
          try {
            this.cb.call(this.vm, value, oldValue);
          } catch (e) {
            handleError(e, this.vm, "callback for watcher \"" + this.expression + "\"");
          }
        } else {
          this.cb.call(this.vm, value, oldValue);
        }
      }
    }
  };

  /**
   * Evaluate the value of the watcher.
   * This only gets called for lazy watchers.
   */
  Watcher.prototype.evaluate = function evaluate() {
    this.value = this.get();
    this.dirty = false;
  };

  /**
   * Depend on all deps collected by this watcher.
   */
  Watcher.prototype.depend = function depend() {
    var this$1 = this;

    var i = this.deps.length;
    while (i--) {
      this$1.deps[i].depend();
    }
  };

  /**
   * Remove self from all dependencies' subscriber list.
   */
  Watcher.prototype.teardown = function teardown() {
    var this$1 = this;

    if (this.active) {
      // remove self from vm's watcher list
      // this is a somewhat expensive operation so we skip it
      // if the vm is being destroyed.
      if (!this.vm._isBeingDestroyed) {
        remove(this.vm._watchers, this);
      }
      var i = this.deps.length;
      while (i--) {
        this$1.deps[i].removeSub(this$1);
      }
      this.active = false;
    }
  };

  /**
   * Recursively traverse an object to evoke all converted
   * getters, so that every nested property inside the object
   * is collected as a "deep" dependency.
   */
  var seenObjects = new _Set();
  function traverse(val) {
    seenObjects.clear();
    _traverse(val, seenObjects);
  }

  function _traverse(val, seen) {
    var i, keys;
    var isA = Array.isArray(val);
    if (!isA && !isObject(val) || !Object.isExtensible(val)) {
      return;
    }
    if (val.__ob__) {
      var depId = val.__ob__.dep.id;
      if (seen.has(depId)) {
        return;
      }
      seen.add(depId);
    }
    if (isA) {
      i = val.length;
      while (i--) {
        _traverse(val[i], seen);
      }
    } else {
      keys = Object.keys(val);
      i = keys.length;
      while (i--) {
        _traverse(val[keys[i]], seen);
      }
    }
  }

  /*  */

  var sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: noop,
    set: noop
  };

  function proxy(target, sourceKey, key) {
    sharedPropertyDefinition.get = function proxyGetter() {
      return this[sourceKey][key];
    };
    sharedPropertyDefinition.set = function proxySetter(val) {
      this[sourceKey][key] = val;
    };
    Object.defineProperty(target, key, sharedPropertyDefinition);
  }

  function initState(vm) {
    vm._watchers = [];
    var opts = vm.$options;
    if (opts.props) {
      initProps(vm, opts.props);
    }
    if (opts.methods) {
      initMethods(vm, opts.methods);
    }
    if (opts.data) {
      initData(vm);
    } else {
      observe(vm._data = {}, true /* asRootData */);
    }
    if (opts.computed) {
      initComputed(vm, opts.computed);
    }
    if (opts.watch) {
      initWatch(vm, opts.watch);
    }
  }

  var isReservedProp = { key: 1, ref: 1, slot: 1 };

  function initProps(vm, propsOptions) {
    var propsData = vm.$options.propsData || {};
    var props = vm._props = {};
    // cache prop keys so that future props updates can iterate using Array
    // instead of dynamic object key enumeration.
    var keys = vm.$options._propKeys = [];
    var isRoot = !vm.$parent;
    // root instance props should be converted
    observerState.shouldConvert = isRoot;
    var loop = function loop(key) {
      keys.push(key);
      var value = validateProp(key, propsOptions, propsData, vm);
      /* istanbul ignore else */
      {
        if (isReservedProp[key]) {
          warn("\"" + key + "\" is a reserved attribute and cannot be used as component prop.", vm);
        }
        defineReactive$$1(props, key, value, function () {
          if (vm.$parent && !observerState.isSettingProps) {
            warn("Avoid mutating a prop directly since the value will be " + "overwritten whenever the parent component re-renders. " + "Instead, use a data or computed property based on the prop's " + "value. Prop being mutated: \"" + key + "\"", vm);
          }
        });
      }
      // static props are already proxied on the component's prototype
      // during Vue.extend(). We only need to proxy props defined at
      // instantiation here.
      if (!(key in vm)) {
        proxy(vm, "_props", key);
      }
    };

    for (var key in propsOptions) {
      loop(key);
    }observerState.shouldConvert = true;
  }

  function initData(vm) {
    var data = vm.$options.data;
    data = vm._data = typeof data === 'function' ? data.call(vm) : data || {};
    if (!isPlainObject(data)) {
      data = {};
      "development" !== 'production' && warn('data functions should return an object:\n' + 'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function', vm);
    }
    // proxy data on instance
    var keys = Object.keys(data);
    var props = vm.$options.props;
    var i = keys.length;
    while (i--) {
      if (props && hasOwn(props, keys[i])) {
        "development" !== 'production' && warn("The data property \"" + keys[i] + "\" is already declared as a prop. " + "Use prop default value instead.", vm);
      } else if (!isReserved(keys[i])) {
        proxy(vm, "_data", keys[i]);
      }
    }
    // observe data
    observe(data, true /* asRootData */);
  }

  var computedWatcherOptions = { lazy: true };

  function initComputed(vm, computed) {
    var watchers = vm._computedWatchers = Object.create(null);

    for (var key in computed) {
      var userDef = computed[key];
      var getter = typeof userDef === 'function' ? userDef : userDef.get;
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(vm, getter, noop, computedWatcherOptions);

      // component-defined computed properties are already defined on the
      // component prototype. We only need to define computed properties defined
      // at instantiation here.
      if (!(key in vm)) {
        defineComputed(vm, key, userDef);
      }
    }
  }

  function defineComputed(target, key, userDef) {
    if (typeof userDef === 'function') {
      sharedPropertyDefinition.get = createComputedGetter(key);
      sharedPropertyDefinition.set = noop;
    } else {
      sharedPropertyDefinition.get = userDef.get ? userDef.cache !== false ? createComputedGetter(key) : userDef.get : noop;
      sharedPropertyDefinition.set = userDef.set ? userDef.set : noop;
    }
    Object.defineProperty(target, key, sharedPropertyDefinition);
  }

  function createComputedGetter(key) {
    return function computedGetter() {
      var watcher = this._computedWatchers && this._computedWatchers[key];
      if (watcher) {
        if (watcher.dirty) {
          watcher.evaluate();
        }
        if (Dep.target) {
          watcher.depend();
        }
        return watcher.value;
      }
    };
  }

  function initMethods(vm, methods) {
    var props = vm.$options.props;
    for (var key in methods) {
      vm[key] = methods[key] == null ? noop : bind(methods[key], vm);
      {
        if (methods[key] == null) {
          warn("method \"" + key + "\" has an undefined value in the component definition. " + "Did you reference the function correctly?", vm);
        }
        if (props && hasOwn(props, key)) {
          warn("method \"" + key + "\" has already been defined as a prop.", vm);
        }
      }
    }
  }

  function initWatch(vm, watch) {
    for (var key in watch) {
      var handler = watch[key];
      if (Array.isArray(handler)) {
        for (var i = 0; i < handler.length; i++) {
          createWatcher(vm, key, handler[i]);
        }
      } else {
        createWatcher(vm, key, handler);
      }
    }
  }

  function createWatcher(vm, key, handler) {
    var options;
    if (isPlainObject(handler)) {
      options = handler;
      handler = handler.handler;
    }
    if (typeof handler === 'string') {
      handler = vm[handler];
    }
    vm.$watch(key, handler, options);
  }

  function stateMixin(Vue) {
    // flow somehow has problems with directly declared definition object
    // when using Object.defineProperty, so we have to procedurally build up
    // the object here.
    var dataDef = {};
    dataDef.get = function () {
      return this._data;
    };
    var propsDef = {};
    propsDef.get = function () {
      return this._props;
    };
    {
      dataDef.set = function (newData) {
        warn('Avoid replacing instance root $data. ' + 'Use nested data properties instead.', this);
      };
      propsDef.set = function () {
        warn("$props is readonly.", this);
      };
    }
    Object.defineProperty(Vue.prototype, '$data', dataDef);
    Object.defineProperty(Vue.prototype, '$props', propsDef);

    Vue.prototype.$set = set;
    Vue.prototype.$delete = del;

    Vue.prototype.$watch = function (expOrFn, cb, options) {
      var vm = this;
      options = options || {};
      options.user = true;
      var watcher = new Watcher(vm, expOrFn, cb, options);
      if (options.immediate) {
        cb.call(vm, watcher.value);
      }
      return function unwatchFn() {
        watcher.teardown();
      };
    };
  }

  /*  */

  var hooks = { init: init, prepatch: prepatch, insert: insert, destroy: destroy };
  var hooksToMerge = Object.keys(hooks);

  function createComponent(Ctor, data, context, children, tag) {
    if (!Ctor) {
      return;
    }

    var baseCtor = context.$options._base;
    if (isObject(Ctor)) {
      Ctor = baseCtor.extend(Ctor);
    }

    if (typeof Ctor !== 'function') {
      {
        warn("Invalid Component definition: " + String(Ctor), context);
      }
      return;
    }

    // async component
    if (!Ctor.cid) {
      if (Ctor.resolved) {
        Ctor = Ctor.resolved;
      } else {
        Ctor = resolveAsyncComponent(Ctor, baseCtor, function () {
          // it's ok to queue this on every render because
          // $forceUpdate is buffered by the scheduler.
          context.$forceUpdate();
        });
        if (!Ctor) {
          // return nothing if this is indeed an async component
          // wait for the callback to trigger parent update.
          return;
        }
      }
    }

    // resolve constructor options in case global mixins are applied after
    // component constructor creation
    resolveConstructorOptions(Ctor);

    data = data || {};

    // transform component v-model data into props & events
    if (data.model) {
      transformModel(Ctor.options, data);
    }

    // extract props
    var propsData = extractProps(data, Ctor);

    // functional component
    if (Ctor.options.functional) {
      return createFunctionalComponent(Ctor, propsData, data, context, children);
    }

    // extract listeners, since these needs to be treated as
    // child component listeners instead of DOM listeners
    var listeners = data.on;
    // replace with listeners with .native modifier
    data.on = data.nativeOn;

    if (Ctor.options.abstract) {
      // abstract components do not keep anything
      // other than props & listeners
      data = {};
    }

    // merge component management hooks onto the placeholder node
    mergeHooks(data);

    // return a placeholder vnode
    var name = Ctor.options.name || tag;
    var vnode = new VNode("vue-component-" + Ctor.cid + (name ? "-" + name : ''), data, undefined, undefined, undefined, context, { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children });
    return vnode;
  }

  function createFunctionalComponent(Ctor, propsData, data, context, children) {
    var props = {};
    var propOptions = Ctor.options.props;
    if (propOptions) {
      for (var key in propOptions) {
        props[key] = validateProp(key, propOptions, propsData);
      }
    }
    // ensure the createElement function in functional components
    // gets a unique context - this is necessary for correct named slot check
    var _context = Object.create(context);
    var h = function h(a, b, c, d) {
      return createElement(_context, a, b, c, d, true);
    };
    var vnode = Ctor.options.render.call(null, h, {
      props: props,
      data: data,
      parent: context,
      children: children,
      slots: function slots() {
        return resolveSlots(children, context);
      }
    });
    if (vnode instanceof VNode) {
      vnode.functionalContext = context;
      if (data.slot) {
        (vnode.data || (vnode.data = {})).slot = data.slot;
      }
    }
    return vnode;
  }

  function createComponentInstanceForVnode(vnode, // we know it's MountedComponentVNode but flow doesn't
  parent, // activeInstance in lifecycle state
  parentElm, refElm) {
    var vnodeComponentOptions = vnode.componentOptions;
    var options = {
      _isComponent: true,
      parent: parent,
      propsData: vnodeComponentOptions.propsData,
      _componentTag: vnodeComponentOptions.tag,
      _parentVnode: vnode,
      _parentListeners: vnodeComponentOptions.listeners,
      _renderChildren: vnodeComponentOptions.children,
      _parentElm: parentElm || null,
      _refElm: refElm || null
    };
    // check inline-template render functions
    var inlineTemplate = vnode.data.inlineTemplate;
    if (inlineTemplate) {
      options.render = inlineTemplate.render;
      options.staticRenderFns = inlineTemplate.staticRenderFns;
    }
    return new vnodeComponentOptions.Ctor(options);
  }

  function init(vnode, hydrating, parentElm, refElm) {
    if (!vnode.componentInstance || vnode.componentInstance._isDestroyed) {
      var child = vnode.componentInstance = createComponentInstanceForVnode(vnode, activeInstance, parentElm, refElm);
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    } else if (vnode.data.keepAlive) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      prepatch(mountedNode, mountedNode);
    }
  }

  function prepatch(oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(child, options.propsData, // updated props
    options.listeners, // updated listeners
    vnode, // new parent vnode
    options.children // new children
    );
  }

  function insert(vnode) {
    if (!vnode.componentInstance._isMounted) {
      vnode.componentInstance._isMounted = true;
      callHook(vnode.componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      activateChildComponent(vnode.componentInstance, true /* direct */);
    }
  }

  function destroy(vnode) {
    if (!vnode.componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        vnode.componentInstance.$destroy();
      } else {
        deactivateChildComponent(vnode.componentInstance, true /* direct */);
      }
    }
  }

  function resolveAsyncComponent(factory, baseCtor, cb) {
    if (factory.requested) {
      // pool callbacks
      factory.pendingCallbacks.push(cb);
    } else {
      factory.requested = true;
      var cbs = factory.pendingCallbacks = [cb];
      var sync = true;

      var resolve = function resolve(res) {
        if (isObject(res)) {
          res = baseCtor.extend(res);
        }
        // cache resolved
        factory.resolved = res;
        // invoke callbacks only if this is not a synchronous resolve
        // (async resolves are shimmed as synchronous during SSR)
        if (!sync) {
          for (var i = 0, l = cbs.length; i < l; i++) {
            cbs[i](res);
          }
        }
      };

      var reject = function reject(reason) {
        "development" !== 'production' && warn("Failed to resolve async component: " + String(factory) + (reason ? "\nReason: " + reason : ''));
      };

      var res = factory(resolve, reject);

      // handle promise
      if (res && typeof res.then === 'function' && !factory.resolved) {
        res.then(resolve, reject);
      }

      sync = false;
      // return in case resolved synchronously
      return factory.resolved;
    }
  }

  function extractProps(data, Ctor) {
    // we are only extracting raw values here.
    // validation and default values are handled in the child
    // component itself.
    var propOptions = Ctor.options.props;
    if (!propOptions) {
      return;
    }
    var res = {};
    var attrs = data.attrs;
    var props = data.props;
    var domProps = data.domProps;
    if (attrs || props || domProps) {
      for (var key in propOptions) {
        var altKey = hyphenate(key);
        checkProp(res, props, key, altKey, true) || checkProp(res, attrs, key, altKey) || checkProp(res, domProps, key, altKey);
      }
    }
    return res;
  }

  function checkProp(res, hash, key, altKey, preserve) {
    if (hash) {
      if (hasOwn(hash, key)) {
        res[key] = hash[key];
        if (!preserve) {
          delete hash[key];
        }
        return true;
      } else if (hasOwn(hash, altKey)) {
        res[key] = hash[altKey];
        if (!preserve) {
          delete hash[altKey];
        }
        return true;
      }
    }
    return false;
  }

  function mergeHooks(data) {
    if (!data.hook) {
      data.hook = {};
    }
    for (var i = 0; i < hooksToMerge.length; i++) {
      var key = hooksToMerge[i];
      var fromParent = data.hook[key];
      var ours = hooks[key];
      data.hook[key] = fromParent ? mergeHook$1(ours, fromParent) : ours;
    }
  }

  function mergeHook$1(one, two) {
    return function (a, b, c, d) {
      one(a, b, c, d);
      two(a, b, c, d);
    };
  }

  // transform component v-model info (value and callback) into
  // prop and event handler respectively.
  function transformModel(options, data) {
    var prop = options.model && options.model.prop || 'value';
    var event = options.model && options.model.event || 'input';(data.props || (data.props = {}))[prop] = data.model.value;
    var on = data.on || (data.on = {});
    if (on[event]) {
      on[event] = [data.model.callback].concat(on[event]);
    } else {
      on[event] = data.model.callback;
    }
  }

  /*  */

  var SIMPLE_NORMALIZE = 1;
  var ALWAYS_NORMALIZE = 2;

  // wrapper function for providing a more flexible interface
  // without getting yelled at by flow
  function createElement(context, tag, data, children, normalizationType, alwaysNormalize) {
    if (Array.isArray(data) || isPrimitive(data)) {
      normalizationType = children;
      children = data;
      data = undefined;
    }
    if (alwaysNormalize) {
      normalizationType = ALWAYS_NORMALIZE;
    }
    return _createElement(context, tag, data, children, normalizationType);
  }

  function _createElement(context, tag, data, children, normalizationType) {
    if (data && data.__ob__) {
      "development" !== 'production' && warn("Avoid using observed data object as vnode data: " + JSON.stringify(data) + "\n" + 'Always create fresh vnode data objects in each render!', context);
      return createEmptyVNode();
    }
    if (!tag) {
      // in case of component :is set to falsy value
      return createEmptyVNode();
    }
    // support single function children as default scoped slot
    if (Array.isArray(children) && typeof children[0] === 'function') {
      data = data || {};
      data.scopedSlots = { default: children[0] };
      children.length = 0;
    }
    if (normalizationType === ALWAYS_NORMALIZE) {
      children = normalizeChildren(children);
    } else if (normalizationType === SIMPLE_NORMALIZE) {
      children = simpleNormalizeChildren(children);
    }
    var vnode, ns;
    if (typeof tag === 'string') {
      var Ctor;
      ns = config.getTagNamespace(tag);
      if (config.isReservedTag(tag)) {
        // platform built-in elements
        vnode = new VNode(config.parsePlatformTagName(tag), data, children, undefined, undefined, context);
      } else if (Ctor = resolveAsset(context.$options, 'components', tag)) {
        // component
        vnode = createComponent(Ctor, data, context, children, tag);
      } else {
        // unknown or unlisted namespaced elements
        // check at runtime because it may get assigned a namespace when its
        // parent normalizes children
        vnode = new VNode(tag, data, children, undefined, undefined, context);
      }
    } else {
      // direct component options / constructor
      vnode = createComponent(tag, data, context, children);
    }
    if (vnode) {
      if (ns) {
        applyNS(vnode, ns);
      }
      return vnode;
    } else {
      return createEmptyVNode();
    }
  }

  function applyNS(vnode, ns) {
    vnode.ns = ns;
    if (vnode.tag === 'foreignObject') {
      // use default namespace inside foreignObject
      return;
    }
    if (vnode.children) {
      for (var i = 0, l = vnode.children.length; i < l; i++) {
        var child = vnode.children[i];
        if (child.tag && !child.ns) {
          applyNS(child, ns);
        }
      }
    }
  }

  /*  */

  /**
   * Runtime helper for rendering v-for lists.
   */
  function renderList(val, render) {
    var ret, i, l, keys, key;
    if (Array.isArray(val) || typeof val === 'string') {
      ret = new Array(val.length);
      for (i = 0, l = val.length; i < l; i++) {
        ret[i] = render(val[i], i);
      }
    } else if (typeof val === 'number') {
      ret = new Array(val);
      for (i = 0; i < val; i++) {
        ret[i] = render(i + 1, i);
      }
    } else if (isObject(val)) {
      keys = Object.keys(val);
      ret = new Array(keys.length);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[i] = render(val[key], key, i);
      }
    }
    return ret;
  }

  /*  */

  /**
   * Runtime helper for rendering <slot>
   */
  function renderSlot(name, fallback, props, bindObject) {
    var scopedSlotFn = this.$scopedSlots[name];
    if (scopedSlotFn) {
      // scoped slot
      props = props || {};
      if (bindObject) {
        extend(props, bindObject);
      }
      return scopedSlotFn(props) || fallback;
    } else {
      var slotNodes = this.$slots[name];
      // warn duplicate slot usage
      if (slotNodes && "development" !== 'production') {
        slotNodes._rendered && warn("Duplicate presence of slot \"" + name + "\" found in the same render tree " + "- this will likely cause render errors.", this);
        slotNodes._rendered = true;
      }
      return slotNodes || fallback;
    }
  }

  /*  */

  /**
   * Runtime helper for resolving filters
   */
  function resolveFilter(id) {
    return resolveAsset(this.$options, 'filters', id, true) || identity;
  }

  /*  */

  /**
   * Runtime helper for checking keyCodes from config.
   */
  function checkKeyCodes(eventKeyCode, key, builtInAlias) {
    var keyCodes = config.keyCodes[key] || builtInAlias;
    if (Array.isArray(keyCodes)) {
      return keyCodes.indexOf(eventKeyCode) === -1;
    } else {
      return keyCodes !== eventKeyCode;
    }
  }

  /*  */

  /**
   * Runtime helper for merging v-bind="object" into a VNode's data.
   */
  function bindObjectProps(data, tag, value, asProp) {
    if (value) {
      if (!isObject(value)) {
        "development" !== 'production' && warn('v-bind without argument expects an Object or Array value', this);
      } else {
        if (Array.isArray(value)) {
          value = toObject(value);
        }
        for (var key in value) {
          if (key === 'class' || key === 'style') {
            data[key] = value[key];
          } else {
            var type = data.attrs && data.attrs.type;
            var hash = asProp || config.mustUseProp(tag, type, key) ? data.domProps || (data.domProps = {}) : data.attrs || (data.attrs = {});
            hash[key] = value[key];
          }
        }
      }
    }
    return data;
  }

  /*  */

  /**
   * Runtime helper for rendering static trees.
   */
  function renderStatic(index, isInFor) {
    var tree = this._staticTrees[index];
    // if has already-rendered static tree and not inside v-for,
    // we can reuse the same tree by doing a shallow clone.
    if (tree && !isInFor) {
      return Array.isArray(tree) ? cloneVNodes(tree) : cloneVNode(tree);
    }
    // otherwise, render a fresh tree.
    tree = this._staticTrees[index] = this.$options.staticRenderFns[index].call(this._renderProxy);
    markStatic(tree, "__static__" + index, false);
    return tree;
  }

  /**
   * Runtime helper for v-once.
   * Effectively it means marking the node as static with a unique key.
   */
  function markOnce(tree, index, key) {
    markStatic(tree, "__once__" + index + (key ? "_" + key : ""), true);
    return tree;
  }

  function markStatic(tree, key, isOnce) {
    if (Array.isArray(tree)) {
      for (var i = 0; i < tree.length; i++) {
        if (tree[i] && typeof tree[i] !== 'string') {
          markStaticNode(tree[i], key + "_" + i, isOnce);
        }
      }
    } else {
      markStaticNode(tree, key, isOnce);
    }
  }

  function markStaticNode(node, key, isOnce) {
    node.isStatic = true;
    node.key = key;
    node.isOnce = isOnce;
  }

  /*  */

  function initRender(vm) {
    vm.$vnode = null; // the placeholder node in parent tree
    vm._vnode = null; // the root of the child tree
    vm._staticTrees = null;
    var parentVnode = vm.$options._parentVnode;
    var renderContext = parentVnode && parentVnode.context;
    vm.$slots = resolveSlots(vm.$options._renderChildren, renderContext);
    vm.$scopedSlots = emptyObject;
    // bind the createElement fn to this instance
    // so that we get proper render context inside it.
    // args order: tag, data, children, normalizationType, alwaysNormalize
    // internal version is used by render functions compiled from templates
    vm._c = function (a, b, c, d) {
      return createElement(vm, a, b, c, d, false);
    };
    // normalization is always applied for the public version, used in
    // user-written render functions.
    vm.$createElement = function (a, b, c, d) {
      return createElement(vm, a, b, c, d, true);
    };
  }

  function renderMixin(Vue) {
    Vue.prototype.$nextTick = function (fn) {
      return nextTick(fn, this);
    };

    Vue.prototype._render = function () {
      var vm = this;
      var ref = vm.$options;
      var render = ref.render;
      var staticRenderFns = ref.staticRenderFns;
      var _parentVnode = ref._parentVnode;

      if (vm._isMounted) {
        // clone slot nodes on re-renders
        for (var key in vm.$slots) {
          vm.$slots[key] = cloneVNodes(vm.$slots[key]);
        }
      }

      vm.$scopedSlots = _parentVnode && _parentVnode.data.scopedSlots || emptyObject;

      if (staticRenderFns && !vm._staticTrees) {
        vm._staticTrees = [];
      }
      // set parent vnode. this allows render functions to have access
      // to the data on the placeholder node.
      vm.$vnode = _parentVnode;
      // render self
      var vnode;
      try {
        vnode = render.call(vm._renderProxy, vm.$createElement);
      } catch (e) {
        handleError(e, vm, "render function");
        // return error render result,
        // or previous vnode to prevent render error causing blank component
        /* istanbul ignore else */
        {
          vnode = vm.$options.renderError ? vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e) : vm._vnode;
        }
      }
      // return empty vnode in case the render function errored out
      if (!(vnode instanceof VNode)) {
        if ("development" !== 'production' && Array.isArray(vnode)) {
          warn('Multiple root nodes returned from render function. Render function ' + 'should return a single root node.', vm);
        }
        vnode = createEmptyVNode();
      }
      // set parent
      vnode.parent = _parentVnode;
      return vnode;
    };

    // internal render helpers.
    // these are exposed on the instance prototype to reduce generated render
    // code size.
    Vue.prototype._o = markOnce;
    Vue.prototype._n = toNumber;
    Vue.prototype._s = _toString;
    Vue.prototype._l = renderList;
    Vue.prototype._t = renderSlot;
    Vue.prototype._q = looseEqual;
    Vue.prototype._i = looseIndexOf;
    Vue.prototype._m = renderStatic;
    Vue.prototype._f = resolveFilter;
    Vue.prototype._k = checkKeyCodes;
    Vue.prototype._b = bindObjectProps;
    Vue.prototype._v = createTextVNode;
    Vue.prototype._e = createEmptyVNode;
    Vue.prototype._u = resolveScopedSlots;
  }

  /*  */

  function initProvide(vm) {
    var provide = vm.$options.provide;
    if (provide) {
      vm._provided = typeof provide === 'function' ? provide.call(vm) : provide;
    }
  }

  function initInjections(vm) {
    var inject = vm.$options.inject;
    if (inject) {
      // inject is :any because flow is not smart enough to figure out cached
      // isArray here
      var isArray = Array.isArray(inject);
      var keys = isArray ? inject : hasSymbol ? Reflect.ownKeys(inject) : Object.keys(inject);

      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var provideKey = isArray ? key : inject[key];
        var source = vm;
        while (source) {
          if (source._provided && provideKey in source._provided) {
            vm[key] = source._provided[provideKey];
            break;
          }
          source = source.$parent;
        }
      }
    }
  }

  /*  */

  var uid = 0;

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      /* istanbul ignore if */
      if ("development" !== 'production' && config.performance && perf) {
        perf.mark('init');
      }

      var vm = this;
      // a uid
      vm._uid = uid++;
      // a flag to avoid this being observed
      vm._isVue = true;
      // merge options
      if (options && options._isComponent) {
        // optimize internal component instantiation
        // since dynamic options merging is pretty slow, and none of the
        // internal component options needs special treatment.
        initInternalComponent(vm, options);
      } else {
        vm.$options = mergeOptions(resolveConstructorOptions(vm.constructor), options || {}, vm);
      }
      /* istanbul ignore else */
      {
        initProxy(vm);
      }
      // expose real self
      vm._self = vm;
      initLifecycle(vm);
      initEvents(vm);
      initRender(vm);
      callHook(vm, 'beforeCreate');
      initInjections(vm); // resolve injections before data/props
      initState(vm);
      initProvide(vm); // resolve provide after data/props
      callHook(vm, 'created');

      /* istanbul ignore if */
      if ("development" !== 'production' && config.performance && perf) {
        vm._name = formatComponentName(vm, false);
        perf.mark('init end');
        perf.measure(vm._name + " init", 'init', 'init end');
      }

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };
  }

  function initInternalComponent(vm, options) {
    var opts = vm.$options = Object.create(vm.constructor.options);
    // doing this because it's faster than dynamic enumeration.
    opts.parent = options.parent;
    opts.propsData = options.propsData;
    opts._parentVnode = options._parentVnode;
    opts._parentListeners = options._parentListeners;
    opts._renderChildren = options._renderChildren;
    opts._componentTag = options._componentTag;
    opts._parentElm = options._parentElm;
    opts._refElm = options._refElm;
    if (options.render) {
      opts.render = options.render;
      opts.staticRenderFns = options.staticRenderFns;
    }
  }

  function resolveConstructorOptions(Ctor) {
    var options = Ctor.options;
    if (Ctor.super) {
      var superOptions = resolveConstructorOptions(Ctor.super);
      var cachedSuperOptions = Ctor.superOptions;
      if (superOptions !== cachedSuperOptions) {
        // super option changed,
        // need to resolve new options.
        Ctor.superOptions = superOptions;
        // check if there are any late-modified/attached options (#4976)
        var modifiedOptions = resolveModifiedOptions(Ctor);
        // update base extend options
        if (modifiedOptions) {
          extend(Ctor.extendOptions, modifiedOptions);
        }
        options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
        if (options.name) {
          options.components[options.name] = Ctor;
        }
      }
    }
    return options;
  }

  function resolveModifiedOptions(Ctor) {
    var modified;
    var latest = Ctor.options;
    var sealed = Ctor.sealedOptions;
    for (var key in latest) {
      if (latest[key] !== sealed[key]) {
        if (!modified) {
          modified = {};
        }
        modified[key] = dedupe(latest[key], sealed[key]);
      }
    }
    return modified;
  }

  function dedupe(latest, sealed) {
    // compare latest and sealed to ensure lifecycle hooks won't be duplicated
    // between merges
    if (Array.isArray(latest)) {
      var res = [];
      sealed = Array.isArray(sealed) ? sealed : [sealed];
      for (var i = 0; i < latest.length; i++) {
        if (sealed.indexOf(latest[i]) < 0) {
          res.push(latest[i]);
        }
      }
      return res;
    } else {
      return latest;
    }
  }

  function Vue$3(options) {
    if ("development" !== 'production' && !(this instanceof Vue$3)) {
      warn('Vue is a constructor and should be called with the `new` keyword');
    }
    this._init(options);
  }

  initMixin(Vue$3);
  stateMixin(Vue$3);
  eventsMixin(Vue$3);
  lifecycleMixin(Vue$3);
  renderMixin(Vue$3);

  /*  */

  function initUse(Vue) {
    Vue.use = function (plugin) {
      /* istanbul ignore if */
      if (plugin.installed) {
        return;
      }
      // additional parameters
      var args = toArray(arguments, 1);
      args.unshift(this);
      if (typeof plugin.install === 'function') {
        plugin.install.apply(plugin, args);
      } else if (typeof plugin === 'function') {
        plugin.apply(null, args);
      }
      plugin.installed = true;
      return this;
    };
  }

  /*  */

  function initMixin$1(Vue) {
    Vue.mixin = function (mixin) {
      this.options = mergeOptions(this.options, mixin);
    };
  }

  /*  */

  function initExtend(Vue) {
    /**
     * Each instance constructor, including Vue, has a unique
     * cid. This enables us to create wrapped "child
     * constructors" for prototypal inheritance and cache them.
     */
    Vue.cid = 0;
    var cid = 1;

    /**
     * Class inheritance
     */
    Vue.extend = function (extendOptions) {
      extendOptions = extendOptions || {};
      var Super = this;
      var SuperId = Super.cid;
      var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
      if (cachedCtors[SuperId]) {
        return cachedCtors[SuperId];
      }

      var name = extendOptions.name || Super.options.name;
      {
        if (!/^[a-zA-Z][\w-]*$/.test(name)) {
          warn('Invalid component name: "' + name + '". Component names ' + 'can only contain alphanumeric characters and the hyphen, ' + 'and must start with a letter.');
        }
      }

      var Sub = function VueComponent(options) {
        this._init(options);
      };
      Sub.prototype = Object.create(Super.prototype);
      Sub.prototype.constructor = Sub;
      Sub.cid = cid++;
      Sub.options = mergeOptions(Super.options, extendOptions);
      Sub['super'] = Super;

      // For props and computed properties, we define the proxy getters on
      // the Vue instances at extension time, on the extended prototype. This
      // avoids Object.defineProperty calls for each instance created.
      if (Sub.options.props) {
        initProps$1(Sub);
      }
      if (Sub.options.computed) {
        initComputed$1(Sub);
      }

      // allow further extension/mixin/plugin usage
      Sub.extend = Super.extend;
      Sub.mixin = Super.mixin;
      Sub.use = Super.use;

      // create asset registers, so extended classes
      // can have their private assets too.
      config._assetTypes.forEach(function (type) {
        Sub[type] = Super[type];
      });
      // enable recursive self-lookup
      if (name) {
        Sub.options.components[name] = Sub;
      }

      // keep a reference to the super options at extension time.
      // later at instantiation we can check if Super's options have
      // been updated.
      Sub.superOptions = Super.options;
      Sub.extendOptions = extendOptions;
      Sub.sealedOptions = extend({}, Sub.options);

      // cache constructor
      cachedCtors[SuperId] = Sub;
      return Sub;
    };
  }

  function initProps$1(Comp) {
    var props = Comp.options.props;
    for (var key in props) {
      proxy(Comp.prototype, "_props", key);
    }
  }

  function initComputed$1(Comp) {
    var computed = Comp.options.computed;
    for (var key in computed) {
      defineComputed(Comp.prototype, key, computed[key]);
    }
  }

  /*  */

  function initAssetRegisters(Vue) {
    /**
     * Create asset registration methods.
     */
    config._assetTypes.forEach(function (type) {
      Vue[type] = function (id, definition) {
        if (!definition) {
          return this.options[type + 's'][id];
        } else {
          /* istanbul ignore if */
          {
            if (type === 'component' && config.isReservedTag(id)) {
              warn('Do not use built-in or reserved HTML elements as component ' + 'id: ' + id);
            }
          }
          if (type === 'component' && isPlainObject(definition)) {
            definition.name = definition.name || id;
            definition = this.options._base.extend(definition);
          }
          if (type === 'directive' && typeof definition === 'function') {
            definition = { bind: definition, update: definition };
          }
          this.options[type + 's'][id] = definition;
          return definition;
        }
      };
    });
  }

  /*  */

  var patternTypes = [String, RegExp];

  function getComponentName(opts) {
    return opts && (opts.Ctor.options.name || opts.tag);
  }

  function matches(pattern, name) {
    if (typeof pattern === 'string') {
      return pattern.split(',').indexOf(name) > -1;
    } else if (pattern instanceof RegExp) {
      return pattern.test(name);
    }
    /* istanbul ignore next */
    return false;
  }

  function pruneCache(cache, filter) {
    for (var key in cache) {
      var cachedNode = cache[key];
      if (cachedNode) {
        var name = getComponentName(cachedNode.componentOptions);
        if (name && !filter(name)) {
          pruneCacheEntry(cachedNode);
          cache[key] = null;
        }
      }
    }
  }

  function pruneCacheEntry(vnode) {
    if (vnode) {
      if (!vnode.componentInstance._inactive) {
        callHook(vnode.componentInstance, 'deactivated');
      }
      vnode.componentInstance.$destroy();
    }
  }

  var KeepAlive = {
    name: 'keep-alive',
    abstract: true,

    props: {
      include: patternTypes,
      exclude: patternTypes
    },

    created: function created() {
      this.cache = Object.create(null);
    },

    destroyed: function destroyed() {
      var this$1 = this;

      for (var key in this$1.cache) {
        pruneCacheEntry(this$1.cache[key]);
      }
    },

    watch: {
      include: function include(val) {
        pruneCache(this.cache, function (name) {
          return matches(val, name);
        });
      },
      exclude: function exclude(val) {
        pruneCache(this.cache, function (name) {
          return !matches(val, name);
        });
      }
    },

    render: function render() {
      var vnode = getFirstComponentChild(this.$slots.default);
      var componentOptions = vnode && vnode.componentOptions;
      if (componentOptions) {
        // check pattern
        var name = getComponentName(componentOptions);
        if (name && (this.include && !matches(this.include, name) || this.exclude && matches(this.exclude, name))) {
          return vnode;
        }
        var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? "::" + componentOptions.tag : '') : vnode.key;
        if (this.cache[key]) {
          vnode.componentInstance = this.cache[key].componentInstance;
        } else {
          this.cache[key] = vnode;
        }
        vnode.data.keepAlive = true;
      }
      return vnode;
    }
  };

  var builtInComponents = {
    KeepAlive: KeepAlive
  };

  /*  */

  function initGlobalAPI(Vue) {
    // config
    var configDef = {};
    configDef.get = function () {
      return config;
    };
    {
      configDef.set = function () {
        warn('Do not replace the Vue.config object, set individual fields instead.');
      };
    }
    Object.defineProperty(Vue, 'config', configDef);

    // exposed util methods.
    // NOTE: these are not considered part of the public API - avoid relying on
    // them unless you are aware of the risk.
    Vue.util = {
      warn: warn,
      extend: extend,
      mergeOptions: mergeOptions,
      defineReactive: defineReactive$$1
    };

    Vue.set = set;
    Vue.delete = del;
    Vue.nextTick = nextTick;

    Vue.options = Object.create(null);
    config._assetTypes.forEach(function (type) {
      Vue.options[type + 's'] = Object.create(null);
    });

    // this is used to identify the "base" constructor to extend all plain-object
    // components with in Weex's multi-instance scenarios.
    Vue.options._base = Vue;

    extend(Vue.options.components, builtInComponents);

    initUse(Vue);
    initMixin$1(Vue);
    initExtend(Vue);
    initAssetRegisters(Vue);
  }

  initGlobalAPI(Vue$3);

  Object.defineProperty(Vue$3.prototype, '$isServer', {
    get: isServerRendering
  });

  Vue$3.version = '2.2.2';

  /*  */

  // attributes that should be using props for binding
  var acceptValue = makeMap('input,textarea,option,select');
  var mustUseProp = function mustUseProp(tag, type, attr) {
    return attr === 'value' && acceptValue(tag) && type !== 'button' || attr === 'selected' && tag === 'option' || attr === 'checked' && tag === 'input' || attr === 'muted' && tag === 'video';
  };

  var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

  var isBooleanAttr = makeMap('allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' + 'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' + 'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' + 'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' + 'required,reversed,scoped,seamless,selected,sortable,translate,' + 'truespeed,typemustmatch,visible');

  var xlinkNS = 'http://www.w3.org/1999/xlink';

  var isXlink = function isXlink(name) {
    return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink';
  };

  var getXlinkProp = function getXlinkProp(name) {
    return isXlink(name) ? name.slice(6, name.length) : '';
  };

  var isFalsyAttrValue = function isFalsyAttrValue(val) {
    return val == null || val === false;
  };

  /*  */

  function genClassForVnode(vnode) {
    var data = vnode.data;
    var parentNode = vnode;
    var childNode = vnode;
    while (childNode.componentInstance) {
      childNode = childNode.componentInstance._vnode;
      if (childNode.data) {
        data = mergeClassData(childNode.data, data);
      }
    }
    while (parentNode = parentNode.parent) {
      if (parentNode.data) {
        data = mergeClassData(data, parentNode.data);
      }
    }
    return genClassFromData(data);
  }

  function mergeClassData(child, parent) {
    return {
      staticClass: concat(child.staticClass, parent.staticClass),
      class: child.class ? [child.class, parent.class] : parent.class
    };
  }

  function genClassFromData(data) {
    var dynamicClass = data.class;
    var staticClass = data.staticClass;
    if (staticClass || dynamicClass) {
      return concat(staticClass, stringifyClass(dynamicClass));
    }
    /* istanbul ignore next */
    return '';
  }

  function concat(a, b) {
    return a ? b ? a + ' ' + b : a : b || '';
  }

  function stringifyClass(value) {
    var res = '';
    if (!value) {
      return res;
    }
    if (typeof value === 'string') {
      return value;
    }
    if (Array.isArray(value)) {
      var stringified;
      for (var i = 0, l = value.length; i < l; i++) {
        if (value[i]) {
          if (stringified = stringifyClass(value[i])) {
            res += stringified + ' ';
          }
        }
      }
      return res.slice(0, -1);
    }
    if (isObject(value)) {
      for (var key in value) {
        if (value[key]) {
          res += key + ' ';
        }
      }
      return res.slice(0, -1);
    }
    /* istanbul ignore next */
    return res;
  }

  /*  */

  var namespaceMap = {
    svg: 'http://www.w3.org/2000/svg',
    math: 'http://www.w3.org/1998/Math/MathML'
  };

  var isHTMLTag = makeMap('html,body,base,head,link,meta,style,title,' + 'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' + 'div,dd,dl,dt,figcaption,figure,hr,img,li,main,ol,p,pre,ul,' + 'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' + 's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' + 'embed,object,param,source,canvas,script,noscript,del,ins,' + 'caption,col,colgroup,table,thead,tbody,td,th,tr,' + 'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' + 'output,progress,select,textarea,' + 'details,dialog,menu,menuitem,summary,' + 'content,element,shadow,template');

  // this map is intentionally selective, only covering SVG elements that may
  // contain child elements.
  var isSVG = makeMap('svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' + 'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' + 'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view', true);

  var isPreTag = function isPreTag(tag) {
    return tag === 'pre';
  };

  var isReservedTag = function isReservedTag(tag) {
    return isHTMLTag(tag) || isSVG(tag);
  };

  function getTagNamespace(tag) {
    if (isSVG(tag)) {
      return 'svg';
    }
    // basic support for MathML
    // note it doesn't support other MathML elements being component roots
    if (tag === 'math') {
      return 'math';
    }
  }

  var unknownElementCache = Object.create(null);
  function isUnknownElement(tag) {
    /* istanbul ignore if */
    if (!inBrowser) {
      return true;
    }
    if (isReservedTag(tag)) {
      return false;
    }
    tag = tag.toLowerCase();
    /* istanbul ignore if */
    if (unknownElementCache[tag] != null) {
      return unknownElementCache[tag];
    }
    var el = document.createElement(tag);
    if (tag.indexOf('-') > -1) {
      // http://stackoverflow.com/a/28210364/1070244
      return unknownElementCache[tag] = el.constructor === window.HTMLUnknownElement || el.constructor === window.HTMLElement;
    } else {
      return unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString());
    }
  }

  /*  */

  /**
   * Query an element selector if it's not an element already.
   */
  function query(el) {
    if (typeof el === 'string') {
      var selected = document.querySelector(el);
      if (!selected) {
        "development" !== 'production' && warn('Cannot find element: ' + el);
        return document.createElement('div');
      }
      return selected;
    } else {
      return el;
    }
  }

  /*  */

  function createElement$1(tagName, vnode) {
    var elm = document.createElement(tagName);
    if (tagName !== 'select') {
      return elm;
    }
    // false or null will remove the attribute but undefined will not
    if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
      elm.setAttribute('multiple', 'multiple');
    }
    return elm;
  }

  function createElementNS(namespace, tagName) {
    return document.createElementNS(namespaceMap[namespace], tagName);
  }

  function createTextNode(text) {
    return document.createTextNode(text);
  }

  function createComment(text) {
    return document.createComment(text);
  }

  function insertBefore(parentNode, newNode, referenceNode) {
    parentNode.insertBefore(newNode, referenceNode);
  }

  function removeChild(node, child) {
    node.removeChild(child);
  }

  function appendChild(node, child) {
    node.appendChild(child);
  }

  function parentNode(node) {
    return node.parentNode;
  }

  function nextSibling(node) {
    return node.nextSibling;
  }

  function tagName(node) {
    return node.tagName;
  }

  function setTextContent(node, text) {
    node.textContent = text;
  }

  function setAttribute(node, key, val) {
    node.setAttribute(key, val);
  }

  var nodeOps = Object.freeze({
    createElement: createElement$1,
    createElementNS: createElementNS,
    createTextNode: createTextNode,
    createComment: createComment,
    insertBefore: insertBefore,
    removeChild: removeChild,
    appendChild: appendChild,
    parentNode: parentNode,
    nextSibling: nextSibling,
    tagName: tagName,
    setTextContent: setTextContent,
    setAttribute: setAttribute
  });

  /*  */

  var ref = {
    create: function create(_, vnode) {
      registerRef(vnode);
    },
    update: function update(oldVnode, vnode) {
      if (oldVnode.data.ref !== vnode.data.ref) {
        registerRef(oldVnode, true);
        registerRef(vnode);
      }
    },
    destroy: function destroy(vnode) {
      registerRef(vnode, true);
    }
  };

  function registerRef(vnode, isRemoval) {
    var key = vnode.data.ref;
    if (!key) {
      return;
    }

    var vm = vnode.context;
    var ref = vnode.componentInstance || vnode.elm;
    var refs = vm.$refs;
    if (isRemoval) {
      if (Array.isArray(refs[key])) {
        remove(refs[key], ref);
      } else if (refs[key] === ref) {
        refs[key] = undefined;
      }
    } else {
      if (vnode.data.refInFor) {
        if (Array.isArray(refs[key]) && refs[key].indexOf(ref) < 0) {
          refs[key].push(ref);
        } else {
          refs[key] = [ref];
        }
      } else {
        refs[key] = ref;
      }
    }
  }

  /**
   * Virtual DOM patching algorithm based on Snabbdom by
   * Simon Friis Vindum (@paldepind)
   * Licensed under the MIT License
   * https://github.com/paldepind/snabbdom/blob/master/LICENSE
   *
   * modified by Evan You (@yyx990803)
   *
  
  /*
   * Not type-checking this because this file is perf-critical and the cost
   * of making flow understand it is not worth it.
   */

  var emptyNode = new VNode('', {}, []);

  var hooks$1 = ['create', 'activate', 'update', 'remove', 'destroy'];

  function isUndef(s) {
    return s == null;
  }

  function isDef(s) {
    return s != null;
  }

  function sameVnode(vnode1, vnode2) {
    return vnode1.key === vnode2.key && vnode1.tag === vnode2.tag && vnode1.isComment === vnode2.isComment && !vnode1.data === !vnode2.data;
  }

  function createKeyToOldIdx(children, beginIdx, endIdx) {
    var i, key;
    var map = {};
    for (i = beginIdx; i <= endIdx; ++i) {
      key = children[i].key;
      if (isDef(key)) {
        map[key] = i;
      }
    }
    return map;
  }

  function createPatchFunction(backend) {
    var i, j;
    var cbs = {};

    var modules = backend.modules;
    var nodeOps = backend.nodeOps;

    for (i = 0; i < hooks$1.length; ++i) {
      cbs[hooks$1[i]] = [];
      for (j = 0; j < modules.length; ++j) {
        if (modules[j][hooks$1[i]] !== undefined) {
          cbs[hooks$1[i]].push(modules[j][hooks$1[i]]);
        }
      }
    }

    function emptyNodeAt(elm) {
      return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm);
    }

    function createRmCb(childElm, listeners) {
      function remove$$1() {
        if (--remove$$1.listeners === 0) {
          removeNode(childElm);
        }
      }
      remove$$1.listeners = listeners;
      return remove$$1;
    }

    function removeNode(el) {
      var parent = nodeOps.parentNode(el);
      // element may have already been removed due to v-html / v-text
      if (parent) {
        nodeOps.removeChild(parent, el);
      }
    }

    var inPre = 0;
    function createElm(vnode, insertedVnodeQueue, parentElm, refElm, nested) {
      vnode.isRootInsert = !nested; // for transition enter check
      if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
        return;
      }

      var data = vnode.data;
      var children = vnode.children;
      var tag = vnode.tag;
      if (isDef(tag)) {
        {
          if (data && data.pre) {
            inPre++;
          }
          if (!inPre && !vnode.ns && !(config.ignoredElements.length && config.ignoredElements.indexOf(tag) > -1) && config.isUnknownElement(tag)) {
            warn('Unknown custom element: <' + tag + '> - did you ' + 'register the component correctly? For recursive components, ' + 'make sure to provide the "name" option.', vnode.context);
          }
        }
        vnode.elm = vnode.ns ? nodeOps.createElementNS(vnode.ns, tag) : nodeOps.createElement(tag, vnode);
        setScope(vnode);

        /* istanbul ignore if */
        {
          createChildren(vnode, children, insertedVnodeQueue);
          if (isDef(data)) {
            invokeCreateHooks(vnode, insertedVnodeQueue);
          }
          insert(parentElm, vnode.elm, refElm);
        }

        if ("development" !== 'production' && data && data.pre) {
          inPre--;
        }
      } else if (vnode.isComment) {
        vnode.elm = nodeOps.createComment(vnode.text);
        insert(parentElm, vnode.elm, refElm);
      } else {
        vnode.elm = nodeOps.createTextNode(vnode.text);
        insert(parentElm, vnode.elm, refElm);
      }
    }

    function createComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
      var i = vnode.data;
      if (isDef(i)) {
        var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
        if (isDef(i = i.hook) && isDef(i = i.init)) {
          i(vnode, false /* hydrating */, parentElm, refElm);
        }
        // after calling the init hook, if the vnode is a child component
        // it should've created a child instance and mounted it. the child
        // component also has set the placeholder vnode's elm.
        // in that case we can just return the element and be done.
        if (isDef(vnode.componentInstance)) {
          initComponent(vnode, insertedVnodeQueue);
          if (isReactivated) {
            reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
          }
          return true;
        }
      }
    }

    function initComponent(vnode, insertedVnodeQueue) {
      if (vnode.data.pendingInsert) {
        insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
      }
      vnode.elm = vnode.componentInstance.$el;
      if (isPatchable(vnode)) {
        invokeCreateHooks(vnode, insertedVnodeQueue);
        setScope(vnode);
      } else {
        // empty component root.
        // skip all element-related modules except for ref (#3455)
        registerRef(vnode);
        // make sure to invoke the insert hook
        insertedVnodeQueue.push(vnode);
      }
    }

    function reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
      var i;
      // hack for #4339: a reactivated component with inner transition
      // does not trigger because the inner node's created hooks are not called
      // again. It's not ideal to involve module-specific logic in here but
      // there doesn't seem to be a better way to do it.
      var innerNode = vnode;
      while (innerNode.componentInstance) {
        innerNode = innerNode.componentInstance._vnode;
        if (isDef(i = innerNode.data) && isDef(i = i.transition)) {
          for (i = 0; i < cbs.activate.length; ++i) {
            cbs.activate[i](emptyNode, innerNode);
          }
          insertedVnodeQueue.push(innerNode);
          break;
        }
      }
      // unlike a newly created component,
      // a reactivated keep-alive component doesn't insert itself
      insert(parentElm, vnode.elm, refElm);
    }

    function insert(parent, elm, ref) {
      if (parent) {
        if (ref) {
          nodeOps.insertBefore(parent, elm, ref);
        } else {
          nodeOps.appendChild(parent, elm);
        }
      }
    }

    function createChildren(vnode, children, insertedVnodeQueue) {
      if (Array.isArray(children)) {
        for (var i = 0; i < children.length; ++i) {
          createElm(children[i], insertedVnodeQueue, vnode.elm, null, true);
        }
      } else if (isPrimitive(vnode.text)) {
        nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(vnode.text));
      }
    }

    function isPatchable(vnode) {
      while (vnode.componentInstance) {
        vnode = vnode.componentInstance._vnode;
      }
      return isDef(vnode.tag);
    }

    function invokeCreateHooks(vnode, insertedVnodeQueue) {
      for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
        cbs.create[i$1](emptyNode, vnode);
      }
      i = vnode.data.hook; // Reuse variable
      if (isDef(i)) {
        if (i.create) {
          i.create(emptyNode, vnode);
        }
        if (i.insert) {
          insertedVnodeQueue.push(vnode);
        }
      }
    }

    // set scope id attribute for scoped CSS.
    // this is implemented as a special case to avoid the overhead
    // of going through the normal attribute patching process.
    function setScope(vnode) {
      var i;
      var ancestor = vnode;
      while (ancestor) {
        if (isDef(i = ancestor.context) && isDef(i = i.$options._scopeId)) {
          nodeOps.setAttribute(vnode.elm, i, '');
        }
        ancestor = ancestor.parent;
      }
      // for slot content they should also get the scopeId from the host instance.
      if (isDef(i = activeInstance) && i !== vnode.context && isDef(i = i.$options._scopeId)) {
        nodeOps.setAttribute(vnode.elm, i, '');
      }
    }

    function addVnodes(parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
      for (; startIdx <= endIdx; ++startIdx) {
        createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm);
      }
    }

    function invokeDestroyHook(vnode) {
      var i, j;
      var data = vnode.data;
      if (isDef(data)) {
        if (isDef(i = data.hook) && isDef(i = i.destroy)) {
          i(vnode);
        }
        for (i = 0; i < cbs.destroy.length; ++i) {
          cbs.destroy[i](vnode);
        }
      }
      if (isDef(i = vnode.children)) {
        for (j = 0; j < vnode.children.length; ++j) {
          invokeDestroyHook(vnode.children[j]);
        }
      }
    }

    function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
      for (; startIdx <= endIdx; ++startIdx) {
        var ch = vnodes[startIdx];
        if (isDef(ch)) {
          if (isDef(ch.tag)) {
            removeAndInvokeRemoveHook(ch);
            invokeDestroyHook(ch);
          } else {
            // Text node
            removeNode(ch.elm);
          }
        }
      }
    }

    function removeAndInvokeRemoveHook(vnode, rm) {
      if (rm || isDef(vnode.data)) {
        var listeners = cbs.remove.length + 1;
        if (!rm) {
          // directly removing
          rm = createRmCb(vnode.elm, listeners);
        } else {
          // we have a recursively passed down rm callback
          // increase the listeners count
          rm.listeners += listeners;
        }
        // recursively invoke hooks on child component root node
        if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
          removeAndInvokeRemoveHook(i, rm);
        }
        for (i = 0; i < cbs.remove.length; ++i) {
          cbs.remove[i](vnode, rm);
        }
        if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
          i(vnode, rm);
        } else {
          rm();
        }
      } else {
        removeNode(vnode.elm);
      }
    }

    function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
      var oldStartIdx = 0;
      var newStartIdx = 0;
      var oldEndIdx = oldCh.length - 1;
      var oldStartVnode = oldCh[0];
      var oldEndVnode = oldCh[oldEndIdx];
      var newEndIdx = newCh.length - 1;
      var newStartVnode = newCh[0];
      var newEndVnode = newCh[newEndIdx];
      var oldKeyToIdx, idxInOld, elmToMove, refElm;

      // removeOnly is a special flag used only by <transition-group>
      // to ensure removed elements stay in correct relative positions
      // during leaving transitions
      var canMove = !removeOnly;

      while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (isUndef(oldStartVnode)) {
          oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
        } else if (isUndef(oldEndVnode)) {
          oldEndVnode = oldCh[--oldEndIdx];
        } else if (sameVnode(oldStartVnode, newStartVnode)) {
          patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
          oldStartVnode = oldCh[++oldStartIdx];
          newStartVnode = newCh[++newStartIdx];
        } else if (sameVnode(oldEndVnode, newEndVnode)) {
          patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
          oldEndVnode = oldCh[--oldEndIdx];
          newEndVnode = newCh[--newEndIdx];
        } else if (sameVnode(oldStartVnode, newEndVnode)) {
          // Vnode moved right
          patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
          canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
          oldStartVnode = oldCh[++oldStartIdx];
          newEndVnode = newCh[--newEndIdx];
        } else if (sameVnode(oldEndVnode, newStartVnode)) {
          // Vnode moved left
          patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
          canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
          oldEndVnode = oldCh[--oldEndIdx];
          newStartVnode = newCh[++newStartIdx];
        } else {
          if (isUndef(oldKeyToIdx)) {
            oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
          }
          idxInOld = isDef(newStartVnode.key) ? oldKeyToIdx[newStartVnode.key] : null;
          if (isUndef(idxInOld)) {
            // New element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
            newStartVnode = newCh[++newStartIdx];
          } else {
            elmToMove = oldCh[idxInOld];
            /* istanbul ignore if */
            if ("development" !== 'production' && !elmToMove) {
              warn('It seems there are duplicate keys that is causing an update error. ' + 'Make sure each v-for item has a unique key.');
            }
            if (sameVnode(elmToMove, newStartVnode)) {
              patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
              oldCh[idxInOld] = undefined;
              canMove && nodeOps.insertBefore(parentElm, newStartVnode.elm, oldStartVnode.elm);
              newStartVnode = newCh[++newStartIdx];
            } else {
              // same key but different element. treat as new element
              createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
              newStartVnode = newCh[++newStartIdx];
            }
          }
        }
      }
      if (oldStartIdx > oldEndIdx) {
        refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
        addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
      } else if (newStartIdx > newEndIdx) {
        removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
      }
    }

    function patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly) {
      if (oldVnode === vnode) {
        return;
      }
      // reuse element for static trees.
      // note we only do this if the vnode is cloned -
      // if the new node is not cloned it means the render functions have been
      // reset by the hot-reload-api and we need to do a proper re-render.
      if (vnode.isStatic && oldVnode.isStatic && vnode.key === oldVnode.key && (vnode.isCloned || vnode.isOnce)) {
        vnode.elm = oldVnode.elm;
        vnode.componentInstance = oldVnode.componentInstance;
        return;
      }
      var i;
      var data = vnode.data;
      var hasData = isDef(data);
      if (hasData && isDef(i = data.hook) && isDef(i = i.prepatch)) {
        i(oldVnode, vnode);
      }
      var elm = vnode.elm = oldVnode.elm;
      var oldCh = oldVnode.children;
      var ch = vnode.children;
      if (hasData && isPatchable(vnode)) {
        for (i = 0; i < cbs.update.length; ++i) {
          cbs.update[i](oldVnode, vnode);
        }
        if (isDef(i = data.hook) && isDef(i = i.update)) {
          i(oldVnode, vnode);
        }
      }
      if (isUndef(vnode.text)) {
        if (isDef(oldCh) && isDef(ch)) {
          if (oldCh !== ch) {
            updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly);
          }
        } else if (isDef(ch)) {
          if (isDef(oldVnode.text)) {
            nodeOps.setTextContent(elm, '');
          }
          addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
        } else if (isDef(oldCh)) {
          removeVnodes(elm, oldCh, 0, oldCh.length - 1);
        } else if (isDef(oldVnode.text)) {
          nodeOps.setTextContent(elm, '');
        }
      } else if (oldVnode.text !== vnode.text) {
        nodeOps.setTextContent(elm, vnode.text);
      }
      if (hasData) {
        if (isDef(i = data.hook) && isDef(i = i.postpatch)) {
          i(oldVnode, vnode);
        }
      }
    }

    function invokeInsertHook(vnode, queue, initial) {
      // delay insert hooks for component root nodes, invoke them after the
      // element is really inserted
      if (initial && vnode.parent) {
        vnode.parent.data.pendingInsert = queue;
      } else {
        for (var i = 0; i < queue.length; ++i) {
          queue[i].data.hook.insert(queue[i]);
        }
      }
    }

    var bailed = false;
    // list of modules that can skip create hook during hydration because they
    // are already rendered on the client or has no need for initialization
    var isRenderedModule = makeMap('attrs,style,class,staticClass,staticStyle,key');

    // Note: this is a browser-only function so we can assume elms are DOM nodes.
    function hydrate(elm, vnode, insertedVnodeQueue) {
      {
        if (!assertNodeMatch(elm, vnode)) {
          return false;
        }
      }
      vnode.elm = elm;
      var tag = vnode.tag;
      var data = vnode.data;
      var children = vnode.children;
      if (isDef(data)) {
        if (isDef(i = data.hook) && isDef(i = i.init)) {
          i(vnode, true /* hydrating */);
        }
        if (isDef(i = vnode.componentInstance)) {
          // child component. it should have hydrated its own tree.
          initComponent(vnode, insertedVnodeQueue);
          return true;
        }
      }
      if (isDef(tag)) {
        if (isDef(children)) {
          // empty element, allow client to pick up and populate children
          if (!elm.hasChildNodes()) {
            createChildren(vnode, children, insertedVnodeQueue);
          } else {
            var childrenMatch = true;
            var childNode = elm.firstChild;
            for (var i$1 = 0; i$1 < children.length; i$1++) {
              if (!childNode || !hydrate(childNode, children[i$1], insertedVnodeQueue)) {
                childrenMatch = false;
                break;
              }
              childNode = childNode.nextSibling;
            }
            // if childNode is not null, it means the actual childNodes list is
            // longer than the virtual children list.
            if (!childrenMatch || childNode) {
              if ("development" !== 'production' && typeof console !== 'undefined' && !bailed) {
                bailed = true;
                console.warn('Parent: ', elm);
                console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children);
              }
              return false;
            }
          }
        }
        if (isDef(data)) {
          for (var key in data) {
            if (!isRenderedModule(key)) {
              invokeCreateHooks(vnode, insertedVnodeQueue);
              break;
            }
          }
        }
      } else if (elm.data !== vnode.text) {
        elm.data = vnode.text;
      }
      return true;
    }

    function assertNodeMatch(node, vnode) {
      if (vnode.tag) {
        return vnode.tag.indexOf('vue-component') === 0 || vnode.tag.toLowerCase() === (node.tagName && node.tagName.toLowerCase());
      } else {
        return node.nodeType === (vnode.isComment ? 8 : 3);
      }
    }

    return function patch(oldVnode, vnode, hydrating, removeOnly, parentElm, refElm) {
      if (!vnode) {
        if (oldVnode) {
          invokeDestroyHook(oldVnode);
        }
        return;
      }

      var isInitialPatch = false;
      var insertedVnodeQueue = [];

      if (!oldVnode) {
        // empty mount (likely as component), create new root element
        isInitialPatch = true;
        createElm(vnode, insertedVnodeQueue, parentElm, refElm);
      } else {
        var isRealElement = isDef(oldVnode.nodeType);
        if (!isRealElement && sameVnode(oldVnode, vnode)) {
          // patch existing root node
          patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly);
        } else {
          if (isRealElement) {
            // mounting to a real element
            // check if this is server-rendered content and if we can perform
            // a successful hydration.
            if (oldVnode.nodeType === 1 && oldVnode.hasAttribute('server-rendered')) {
              oldVnode.removeAttribute('server-rendered');
              hydrating = true;
            }
            if (hydrating) {
              if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
                invokeInsertHook(vnode, insertedVnodeQueue, true);
                return oldVnode;
              } else {
                warn('The client-side rendered virtual DOM tree is not matching ' + 'server-rendered content. This is likely caused by incorrect ' + 'HTML markup, for example nesting block-level elements inside ' + '<p>, or missing <tbody>. Bailing hydration and performing ' + 'full client-side render.');
              }
            }
            // either not server-rendered, or hydration failed.
            // create an empty node and replace it
            oldVnode = emptyNodeAt(oldVnode);
          }
          // replacing existing element
          var oldElm = oldVnode.elm;
          var parentElm$1 = nodeOps.parentNode(oldElm);
          createElm(vnode, insertedVnodeQueue,
          // extremely rare edge case: do not insert if old element is in a
          // leaving transition. Only happens when combining transition +
          // keep-alive + HOCs. (#4590)
          oldElm._leaveCb ? null : parentElm$1, nodeOps.nextSibling(oldElm));

          if (vnode.parent) {
            // component root element replaced.
            // update parent placeholder node element, recursively
            var ancestor = vnode.parent;
            while (ancestor) {
              ancestor.elm = vnode.elm;
              ancestor = ancestor.parent;
            }
            if (isPatchable(vnode)) {
              for (var i = 0; i < cbs.create.length; ++i) {
                cbs.create[i](emptyNode, vnode.parent);
              }
            }
          }

          if (parentElm$1 !== null) {
            removeVnodes(parentElm$1, [oldVnode], 0, 0);
          } else if (isDef(oldVnode.tag)) {
            invokeDestroyHook(oldVnode);
          }
        }
      }

      invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
      return vnode.elm;
    };
  }

  /*  */

  var directives = {
    create: updateDirectives,
    update: updateDirectives,
    destroy: function unbindDirectives(vnode) {
      updateDirectives(vnode, emptyNode);
    }
  };

  function updateDirectives(oldVnode, vnode) {
    if (oldVnode.data.directives || vnode.data.directives) {
      _update(oldVnode, vnode);
    }
  }

  function _update(oldVnode, vnode) {
    var isCreate = oldVnode === emptyNode;
    var isDestroy = vnode === emptyNode;
    var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
    var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);

    var dirsWithInsert = [];
    var dirsWithPostpatch = [];

    var key, oldDir, dir;
    for (key in newDirs) {
      oldDir = oldDirs[key];
      dir = newDirs[key];
      if (!oldDir) {
        // new directive, bind
        callHook$1(dir, 'bind', vnode, oldVnode);
        if (dir.def && dir.def.inserted) {
          dirsWithInsert.push(dir);
        }
      } else {
        // existing directive, update
        dir.oldValue = oldDir.value;
        callHook$1(dir, 'update', vnode, oldVnode);
        if (dir.def && dir.def.componentUpdated) {
          dirsWithPostpatch.push(dir);
        }
      }
    }

    if (dirsWithInsert.length) {
      var callInsert = function callInsert() {
        for (var i = 0; i < dirsWithInsert.length; i++) {
          callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode);
        }
      };
      if (isCreate) {
        mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'insert', callInsert);
      } else {
        callInsert();
      }
    }

    if (dirsWithPostpatch.length) {
      mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'postpatch', function () {
        for (var i = 0; i < dirsWithPostpatch.length; i++) {
          callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
        }
      });
    }

    if (!isCreate) {
      for (key in oldDirs) {
        if (!newDirs[key]) {
          // no longer present, unbind
          callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
        }
      }
    }
  }

  var emptyModifiers = Object.create(null);

  function normalizeDirectives$1(dirs, vm) {
    var res = Object.create(null);
    if (!dirs) {
      return res;
    }
    var i, dir;
    for (i = 0; i < dirs.length; i++) {
      dir = dirs[i];
      if (!dir.modifiers) {
        dir.modifiers = emptyModifiers;
      }
      res[getRawDirName(dir)] = dir;
      dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
    }
    return res;
  }

  function getRawDirName(dir) {
    return dir.rawName || dir.name + "." + Object.keys(dir.modifiers || {}).join('.');
  }

  function callHook$1(dir, hook, vnode, oldVnode, isDestroy) {
    var fn = dir.def && dir.def[hook];
    if (fn) {
      fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
    }
  }

  var baseModules = [ref, directives];

  /*  */

  function updateAttrs(oldVnode, vnode) {
    if (!oldVnode.data.attrs && !vnode.data.attrs) {
      return;
    }
    var key, cur, old;
    var elm = vnode.elm;
    var oldAttrs = oldVnode.data.attrs || {};
    var attrs = vnode.data.attrs || {};
    // clone observed objects, as the user probably wants to mutate it
    if (attrs.__ob__) {
      attrs = vnode.data.attrs = extend({}, attrs);
    }

    for (key in attrs) {
      cur = attrs[key];
      old = oldAttrs[key];
      if (old !== cur) {
        setAttr(elm, key, cur);
      }
    }
    // #4391: in IE9, setting type can reset value for input[type=radio]
    /* istanbul ignore if */
    if (isIE9 && attrs.value !== oldAttrs.value) {
      setAttr(elm, 'value', attrs.value);
    }
    for (key in oldAttrs) {
      if (attrs[key] == null) {
        if (isXlink(key)) {
          elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
        } else if (!isEnumeratedAttr(key)) {
          elm.removeAttribute(key);
        }
      }
    }
  }

  function setAttr(el, key, value) {
    if (isBooleanAttr(key)) {
      // set attribute for blank value
      // e.g. <option disabled>Select one</option>
      if (isFalsyAttrValue(value)) {
        el.removeAttribute(key);
      } else {
        el.setAttribute(key, key);
      }
    } else if (isEnumeratedAttr(key)) {
      el.setAttribute(key, isFalsyAttrValue(value) || value === 'false' ? 'false' : 'true');
    } else if (isXlink(key)) {
      if (isFalsyAttrValue(value)) {
        el.removeAttributeNS(xlinkNS, getXlinkProp(key));
      } else {
        el.setAttributeNS(xlinkNS, key, value);
      }
    } else {
      if (isFalsyAttrValue(value)) {
        el.removeAttribute(key);
      } else {
        el.setAttribute(key, value);
      }
    }
  }

  var attrs = {
    create: updateAttrs,
    update: updateAttrs
  };

  /*  */

  function updateClass(oldVnode, vnode) {
    var el = vnode.elm;
    var data = vnode.data;
    var oldData = oldVnode.data;
    if (!data.staticClass && !data.class && (!oldData || !oldData.staticClass && !oldData.class)) {
      return;
    }

    var cls = genClassForVnode(vnode);

    // handle transition classes
    var transitionClass = el._transitionClasses;
    if (transitionClass) {
      cls = concat(cls, stringifyClass(transitionClass));
    }

    // set the class
    if (cls !== el._prevClass) {
      el.setAttribute('class', cls);
      el._prevClass = cls;
    }
  }

  var klass = {
    create: updateClass,
    update: updateClass
  };

  /*  */

  var validDivisionCharRE = /[\w).+\-_$\]]/;

  function parseFilters(exp) {
    var inSingle = false;
    var inDouble = false;
    var inTemplateString = false;
    var inRegex = false;
    var curly = 0;
    var square = 0;
    var paren = 0;
    var lastFilterIndex = 0;
    var c, prev, i, expression, filters;

    for (i = 0; i < exp.length; i++) {
      prev = c;
      c = exp.charCodeAt(i);
      if (inSingle) {
        if (c === 0x27 && prev !== 0x5C) {
          inSingle = false;
        }
      } else if (inDouble) {
        if (c === 0x22 && prev !== 0x5C) {
          inDouble = false;
        }
      } else if (inTemplateString) {
        if (c === 0x60 && prev !== 0x5C) {
          inTemplateString = false;
        }
      } else if (inRegex) {
        if (c === 0x2f && prev !== 0x5C) {
          inRegex = false;
        }
      } else if (c === 0x7C && // pipe
      exp.charCodeAt(i + 1) !== 0x7C && exp.charCodeAt(i - 1) !== 0x7C && !curly && !square && !paren) {
        if (expression === undefined) {
          // first filter, end of expression
          lastFilterIndex = i + 1;
          expression = exp.slice(0, i).trim();
        } else {
          pushFilter();
        }
      } else {
        switch (c) {
          case 0x22:
            inDouble = true;break; // "
          case 0x27:
            inSingle = true;break; // '
          case 0x60:
            inTemplateString = true;break; // `
          case 0x28:
            paren++;break; // (
          case 0x29:
            paren--;break; // )
          case 0x5B:
            square++;break; // [
          case 0x5D:
            square--;break; // ]
          case 0x7B:
            curly++;break; // {
          case 0x7D:
            curly--;break; // }
        }
        if (c === 0x2f) {
          // /
          var j = i - 1;
          var p = void 0;
          // find first non-whitespace prev char
          for (; j >= 0; j--) {
            p = exp.charAt(j);
            if (p !== ' ') {
              break;
            }
          }
          if (!p || !validDivisionCharRE.test(p)) {
            inRegex = true;
          }
        }
      }
    }

    if (expression === undefined) {
      expression = exp.slice(0, i).trim();
    } else if (lastFilterIndex !== 0) {
      pushFilter();
    }

    function pushFilter() {
      (filters || (filters = [])).push(exp.slice(lastFilterIndex, i).trim());
      lastFilterIndex = i + 1;
    }

    if (filters) {
      for (i = 0; i < filters.length; i++) {
        expression = wrapFilter(expression, filters[i]);
      }
    }

    return expression;
  }

  function wrapFilter(exp, filter) {
    var i = filter.indexOf('(');
    if (i < 0) {
      // _f: resolveFilter
      return "_f(\"" + filter + "\")(" + exp + ")";
    } else {
      var name = filter.slice(0, i);
      var args = filter.slice(i + 1);
      return "_f(\"" + name + "\")(" + exp + "," + args;
    }
  }

  /*  */

  function baseWarn(msg) {
    console.error("[Vue compiler]: " + msg);
  }

  function pluckModuleFunction(modules, key) {
    return modules ? modules.map(function (m) {
      return m[key];
    }).filter(function (_) {
      return _;
    }) : [];
  }

  function addProp(el, name, value) {
    (el.props || (el.props = [])).push({ name: name, value: value });
  }

  function addAttr(el, name, value) {
    (el.attrs || (el.attrs = [])).push({ name: name, value: value });
  }

  function addDirective(el, name, rawName, value, arg, modifiers) {
    (el.directives || (el.directives = [])).push({ name: name, rawName: rawName, value: value, arg: arg, modifiers: modifiers });
  }

  function addHandler(el, name, value, modifiers, important) {
    // check capture modifier
    if (modifiers && modifiers.capture) {
      delete modifiers.capture;
      name = '!' + name; // mark the event as captured
    }
    if (modifiers && modifiers.once) {
      delete modifiers.once;
      name = '~' + name; // mark the event as once
    }
    var events;
    if (modifiers && modifiers.native) {
      delete modifiers.native;
      events = el.nativeEvents || (el.nativeEvents = {});
    } else {
      events = el.events || (el.events = {});
    }
    var newHandler = { value: value, modifiers: modifiers };
    var handlers = events[name];
    /* istanbul ignore if */
    if (Array.isArray(handlers)) {
      important ? handlers.unshift(newHandler) : handlers.push(newHandler);
    } else if (handlers) {
      events[name] = important ? [newHandler, handlers] : [handlers, newHandler];
    } else {
      events[name] = newHandler;
    }
  }

  function getBindingAttr(el, name, getStatic) {
    var dynamicValue = getAndRemoveAttr(el, ':' + name) || getAndRemoveAttr(el, 'v-bind:' + name);
    if (dynamicValue != null) {
      return parseFilters(dynamicValue);
    } else if (getStatic !== false) {
      var staticValue = getAndRemoveAttr(el, name);
      if (staticValue != null) {
        return JSON.stringify(staticValue);
      }
    }
  }

  function getAndRemoveAttr(el, name) {
    var val;
    if ((val = el.attrsMap[name]) != null) {
      var list = el.attrsList;
      for (var i = 0, l = list.length; i < l; i++) {
        if (list[i].name === name) {
          list.splice(i, 1);
          break;
        }
      }
    }
    return val;
  }

  /*  */

  /**
   * Cross-platform code generation for component v-model
   */
  function genComponentModel(el, value, modifiers) {
    var ref = modifiers || {};
    var number = ref.number;
    var trim = ref.trim;

    var baseValueExpression = '$$v';
    var valueExpression = baseValueExpression;
    if (trim) {
      valueExpression = "(typeof " + baseValueExpression + " === 'string'" + "? " + baseValueExpression + ".trim()" + ": " + baseValueExpression + ")";
    }
    if (number) {
      valueExpression = "_n(" + valueExpression + ")";
    }
    var assignment = genAssignmentCode(value, valueExpression);

    el.model = {
      value: "(" + value + ")",
      expression: "\"" + value + "\"",
      callback: "function (" + baseValueExpression + ") {" + assignment + "}"
    };
  }

  /**
   * Cross-platform codegen helper for generating v-model value assignment code.
   */
  function genAssignmentCode(value, assignment) {
    var modelRs = parseModel(value);
    if (modelRs.idx === null) {
      return value + "=" + assignment;
    } else {
      return "var $$exp = " + modelRs.exp + ", $$idx = " + modelRs.idx + ";" + "if (!Array.isArray($$exp)){" + value + "=" + assignment + "}" + "else{$$exp.splice($$idx, 1, " + assignment + ")}";
    }
  }

  /**
   * parse directive model to do the array update transform. a[idx] = val => $$a.splice($$idx, 1, val)
   *
   * for loop possible cases:
   *
   * - test
   * - test[idx]
   * - test[test1[idx]]
   * - test["a"][idx]
   * - xxx.test[a[a].test1[idx]]
   * - test.xxx.a["asa"][test1[idx]]
   *
   */

  var len;
  var str;
  var chr;
  var index$1;
  var expressionPos;
  var expressionEndPos;

  function parseModel(val) {
    str = val;
    len = str.length;
    index$1 = expressionPos = expressionEndPos = 0;

    if (val.indexOf('[') < 0 || val.lastIndexOf(']') < len - 1) {
      return {
        exp: val,
        idx: null
      };
    }

    while (!eof()) {
      chr = next();
      /* istanbul ignore if */
      if (isStringStart(chr)) {
        parseString(chr);
      } else if (chr === 0x5B) {
        parseBracket(chr);
      }
    }

    return {
      exp: val.substring(0, expressionPos),
      idx: val.substring(expressionPos + 1, expressionEndPos)
    };
  }

  function next() {
    return str.charCodeAt(++index$1);
  }

  function eof() {
    return index$1 >= len;
  }

  function isStringStart(chr) {
    return chr === 0x22 || chr === 0x27;
  }

  function parseBracket(chr) {
    var inBracket = 1;
    expressionPos = index$1;
    while (!eof()) {
      chr = next();
      if (isStringStart(chr)) {
        parseString(chr);
        continue;
      }
      if (chr === 0x5B) {
        inBracket++;
      }
      if (chr === 0x5D) {
        inBracket--;
      }
      if (inBracket === 0) {
        expressionEndPos = index$1;
        break;
      }
    }
  }

  function parseString(chr) {
    var stringQuote = chr;
    while (!eof()) {
      chr = next();
      if (chr === stringQuote) {
        break;
      }
    }
  }

  /*  */

  var warn$1;

  // in some cases, the event used has to be determined at runtime
  // so we used some reserved tokens during compile.
  var RANGE_TOKEN = '__r';
  var CHECKBOX_RADIO_TOKEN = '__c';

  function model(el, dir, _warn) {
    warn$1 = _warn;
    var value = dir.value;
    var modifiers = dir.modifiers;
    var tag = el.tag;
    var type = el.attrsMap.type;

    {
      var dynamicType = el.attrsMap['v-bind:type'] || el.attrsMap[':type'];
      if (tag === 'input' && dynamicType) {
        warn$1("<input :type=\"" + dynamicType + "\" v-model=\"" + value + "\">:\n" + "v-model does not support dynamic input types. Use v-if branches instead.");
      }
      // inputs with type="file" are read only and setting the input's
      // value will throw an error.
      if (tag === 'input' && type === 'file') {
        warn$1("<" + el.tag + " v-model=\"" + value + "\" type=\"file\">:\n" + "File inputs are read only. Use a v-on:change listener instead.");
      }
    }

    if (tag === 'select') {
      genSelect(el, value, modifiers);
    } else if (tag === 'input' && type === 'checkbox') {
      genCheckboxModel(el, value, modifiers);
    } else if (tag === 'input' && type === 'radio') {
      genRadioModel(el, value, modifiers);
    } else if (tag === 'input' || tag === 'textarea') {
      genDefaultModel(el, value, modifiers);
    } else if (!config.isReservedTag(tag)) {
      genComponentModel(el, value, modifiers);
      // component v-model doesn't need extra runtime
      return false;
    } else {
      warn$1("<" + el.tag + " v-model=\"" + value + "\">: " + "v-model is not supported on this element type. " + 'If you are working with contenteditable, it\'s recommended to ' + 'wrap a library dedicated for that purpose inside a custom component.');
    }

    // ensure runtime directive metadata
    return true;
  }

  function genCheckboxModel(el, value, modifiers) {
    var number = modifiers && modifiers.number;
    var valueBinding = getBindingAttr(el, 'value') || 'null';
    var trueValueBinding = getBindingAttr(el, 'true-value') || 'true';
    var falseValueBinding = getBindingAttr(el, 'false-value') || 'false';
    addProp(el, 'checked', "Array.isArray(" + value + ")" + "?_i(" + value + "," + valueBinding + ")>-1" + (trueValueBinding === 'true' ? ":(" + value + ")" : ":_q(" + value + "," + trueValueBinding + ")"));
    addHandler(el, CHECKBOX_RADIO_TOKEN, "var $$a=" + value + "," + '$$el=$event.target,' + "$$c=$$el.checked?(" + trueValueBinding + "):(" + falseValueBinding + ");" + 'if(Array.isArray($$a)){' + "var $$v=" + (number ? '_n(' + valueBinding + ')' : valueBinding) + "," + '$$i=_i($$a,$$v);' + "if($$c){$$i<0&&(" + value + "=$$a.concat($$v))}" + "else{$$i>-1&&(" + value + "=$$a.slice(0,$$i).concat($$a.slice($$i+1)))}" + "}else{" + value + "=$$c}", null, true);
  }

  function genRadioModel(el, value, modifiers) {
    var number = modifiers && modifiers.number;
    var valueBinding = getBindingAttr(el, 'value') || 'null';
    valueBinding = number ? "_n(" + valueBinding + ")" : valueBinding;
    addProp(el, 'checked', "_q(" + value + "," + valueBinding + ")");
    addHandler(el, CHECKBOX_RADIO_TOKEN, genAssignmentCode(value, valueBinding), null, true);
  }

  function genSelect(el, value, modifiers) {
    var number = modifiers && modifiers.number;
    var selectedVal = "Array.prototype.filter" + ".call($event.target.options,function(o){return o.selected})" + ".map(function(o){var val = \"_value\" in o ? o._value : o.value;" + "return " + (number ? '_n(val)' : 'val') + "})";

    var assignment = '$event.target.multiple ? $$selectedVal : $$selectedVal[0]';
    var code = "var $$selectedVal = " + selectedVal + ";";
    code = code + " " + genAssignmentCode(value, assignment);
    addHandler(el, 'change', code, null, true);
  }

  function genDefaultModel(el, value, modifiers) {
    var type = el.attrsMap.type;
    var ref = modifiers || {};
    var lazy = ref.lazy;
    var number = ref.number;
    var trim = ref.trim;
    var needCompositionGuard = !lazy && type !== 'range';
    var event = lazy ? 'change' : type === 'range' ? RANGE_TOKEN : 'input';

    var valueExpression = '$event.target.value';
    if (trim) {
      valueExpression = "$event.target.value.trim()";
    }
    if (number) {
      valueExpression = "_n(" + valueExpression + ")";
    }

    var code = genAssignmentCode(value, valueExpression);
    if (needCompositionGuard) {
      code = "if($event.target.composing)return;" + code;
    }

    addProp(el, 'value', "(" + value + ")");
    addHandler(el, event, code, null, true);
    if (trim || number || type === 'number') {
      addHandler(el, 'blur', '$forceUpdate()');
    }
  }

  /*  */

  // normalize v-model event tokens that can only be determined at runtime.
  // it's important to place the event as the first in the array because
  // the whole point is ensuring the v-model callback gets called before
  // user-attached handlers.
  function normalizeEvents(on) {
    var event;
    /* istanbul ignore if */
    if (on[RANGE_TOKEN]) {
      // IE input[type=range] only supports `change` event
      event = isIE ? 'change' : 'input';
      on[event] = [].concat(on[RANGE_TOKEN], on[event] || []);
      delete on[RANGE_TOKEN];
    }
    if (on[CHECKBOX_RADIO_TOKEN]) {
      // Chrome fires microtasks in between click/change, leads to #4521
      event = isChrome ? 'click' : 'change';
      on[event] = [].concat(on[CHECKBOX_RADIO_TOKEN], on[event] || []);
      delete on[CHECKBOX_RADIO_TOKEN];
    }
  }

  var target$1;

  function add$1(event, _handler, once, capture) {
    if (once) {
      var oldHandler = _handler;
      var _target = target$1; // save current target element in closure
      _handler = function handler(ev) {
        var res = arguments.length === 1 ? oldHandler(ev) : oldHandler.apply(null, arguments);
        if (res !== null) {
          remove$2(event, _handler, capture, _target);
        }
      };
    }
    target$1.addEventListener(event, _handler, capture);
  }

  function remove$2(event, handler, capture, _target) {
    (_target || target$1).removeEventListener(event, handler, capture);
  }

  function updateDOMListeners(oldVnode, vnode) {
    if (!oldVnode.data.on && !vnode.data.on) {
      return;
    }
    var on = vnode.data.on || {};
    var oldOn = oldVnode.data.on || {};
    target$1 = vnode.elm;
    normalizeEvents(on);
    updateListeners(on, oldOn, add$1, remove$2, vnode.context);
  }

  var events = {
    create: updateDOMListeners,
    update: updateDOMListeners
  };

  /*  */

  function updateDOMProps(oldVnode, vnode) {
    if (!oldVnode.data.domProps && !vnode.data.domProps) {
      return;
    }
    var key, cur;
    var elm = vnode.elm;
    var oldProps = oldVnode.data.domProps || {};
    var props = vnode.data.domProps || {};
    // clone observed objects, as the user probably wants to mutate it
    if (props.__ob__) {
      props = vnode.data.domProps = extend({}, props);
    }

    for (key in oldProps) {
      if (props[key] == null) {
        elm[key] = '';
      }
    }
    for (key in props) {
      cur = props[key];
      // ignore children if the node has textContent or innerHTML,
      // as these will throw away existing DOM nodes and cause removal errors
      // on subsequent patches (#3360)
      if (key === 'textContent' || key === 'innerHTML') {
        if (vnode.children) {
          vnode.children.length = 0;
        }
        if (cur === oldProps[key]) {
          continue;
        }
      }

      if (key === 'value') {
        // store value as _value as well since
        // non-string values will be stringified
        elm._value = cur;
        // avoid resetting cursor position when value is the same
        var strCur = cur == null ? '' : String(cur);
        if (shouldUpdateValue(elm, vnode, strCur)) {
          elm.value = strCur;
        }
      } else {
        elm[key] = cur;
      }
    }
  }

  // check platforms/web/util/attrs.js acceptValue


  function shouldUpdateValue(elm, vnode, checkVal) {
    return !elm.composing && (vnode.tag === 'option' || isDirty(elm, checkVal) || isInputChanged(elm, checkVal));
  }

  function isDirty(elm, checkVal) {
    // return true when textbox (.number and .trim) loses focus and its value is not equal to the updated value
    return document.activeElement !== elm && elm.value !== checkVal;
  }

  function isInputChanged(elm, newVal) {
    var value = elm.value;
    var modifiers = elm._vModifiers; // injected by v-model runtime
    if (modifiers && modifiers.number || elm.type === 'number') {
      return toNumber(value) !== toNumber(newVal);
    }
    if (modifiers && modifiers.trim) {
      return value.trim() !== newVal.trim();
    }
    return value !== newVal;
  }

  var domProps = {
    create: updateDOMProps,
    update: updateDOMProps
  };

  /*  */

  var parseStyleText = cached(function (cssText) {
    var res = {};
    var listDelimiter = /;(?![^(]*\))/g;
    var propertyDelimiter = /:(.+)/;
    cssText.split(listDelimiter).forEach(function (item) {
      if (item) {
        var tmp = item.split(propertyDelimiter);
        tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
      }
    });
    return res;
  });

  // merge static and dynamic style data on the same vnode
  function normalizeStyleData(data) {
    var style = normalizeStyleBinding(data.style);
    // static style is pre-processed into an object during compilation
    // and is always a fresh object, so it's safe to merge into it
    return data.staticStyle ? extend(data.staticStyle, style) : style;
  }

  // normalize possible array / string values into Object
  function normalizeStyleBinding(bindingStyle) {
    if (Array.isArray(bindingStyle)) {
      return toObject(bindingStyle);
    }
    if (typeof bindingStyle === 'string') {
      return parseStyleText(bindingStyle);
    }
    return bindingStyle;
  }

  /**
   * parent component style should be after child's
   * so that parent component's style could override it
   */
  function getStyle(vnode, checkChild) {
    var res = {};
    var styleData;

    if (checkChild) {
      var childNode = vnode;
      while (childNode.componentInstance) {
        childNode = childNode.componentInstance._vnode;
        if (childNode.data && (styleData = normalizeStyleData(childNode.data))) {
          extend(res, styleData);
        }
      }
    }

    if (styleData = normalizeStyleData(vnode.data)) {
      extend(res, styleData);
    }

    var parentNode = vnode;
    while (parentNode = parentNode.parent) {
      if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
        extend(res, styleData);
      }
    }
    return res;
  }

  /*  */

  var cssVarRE = /^--/;
  var importantRE = /\s*!important$/;
  var setProp = function setProp(el, name, val) {
    /* istanbul ignore if */
    if (cssVarRE.test(name)) {
      el.style.setProperty(name, val);
    } else if (importantRE.test(val)) {
      el.style.setProperty(name, val.replace(importantRE, ''), 'important');
    } else {
      el.style[normalize(name)] = val;
    }
  };

  var prefixes = ['Webkit', 'Moz', 'ms'];

  var testEl;
  var normalize = cached(function (prop) {
    testEl = testEl || document.createElement('div');
    prop = camelize(prop);
    if (prop !== 'filter' && prop in testEl.style) {
      return prop;
    }
    var upper = prop.charAt(0).toUpperCase() + prop.slice(1);
    for (var i = 0; i < prefixes.length; i++) {
      var prefixed = prefixes[i] + upper;
      if (prefixed in testEl.style) {
        return prefixed;
      }
    }
  });

  function updateStyle(oldVnode, vnode) {
    var data = vnode.data;
    var oldData = oldVnode.data;

    if (!data.staticStyle && !data.style && !oldData.staticStyle && !oldData.style) {
      return;
    }

    var cur, name;
    var el = vnode.elm;
    var oldStaticStyle = oldVnode.data.staticStyle;
    var oldStyleBinding = oldVnode.data.style || {};

    // if static style exists, stylebinding already merged into it when doing normalizeStyleData
    var oldStyle = oldStaticStyle || oldStyleBinding;

    var style = normalizeStyleBinding(vnode.data.style) || {};

    vnode.data.style = style.__ob__ ? extend({}, style) : style;

    var newStyle = getStyle(vnode, true);

    for (name in oldStyle) {
      if (newStyle[name] == null) {
        setProp(el, name, '');
      }
    }
    for (name in newStyle) {
      cur = newStyle[name];
      if (cur !== oldStyle[name]) {
        // ie9 setting to null has no effect, must use empty string
        setProp(el, name, cur == null ? '' : cur);
      }
    }
  }

  var style = {
    create: updateStyle,
    update: updateStyle
  };

  /*  */

  /**
   * Add class with compatibility for SVG since classList is not supported on
   * SVG elements in IE
   */
  function addClass(el, cls) {
    /* istanbul ignore if */
    if (!cls || !(cls = cls.trim())) {
      return;
    }

    /* istanbul ignore else */
    if (el.classList) {
      if (cls.indexOf(' ') > -1) {
        cls.split(/\s+/).forEach(function (c) {
          return el.classList.add(c);
        });
      } else {
        el.classList.add(cls);
      }
    } else {
      var cur = " " + (el.getAttribute('class') || '') + " ";
      if (cur.indexOf(' ' + cls + ' ') < 0) {
        el.setAttribute('class', (cur + cls).trim());
      }
    }
  }

  /**
   * Remove class with compatibility for SVG since classList is not supported on
   * SVG elements in IE
   */
  function removeClass(el, cls) {
    /* istanbul ignore if */
    if (!cls || !(cls = cls.trim())) {
      return;
    }

    /* istanbul ignore else */
    if (el.classList) {
      if (cls.indexOf(' ') > -1) {
        cls.split(/\s+/).forEach(function (c) {
          return el.classList.remove(c);
        });
      } else {
        el.classList.remove(cls);
      }
    } else {
      var cur = " " + (el.getAttribute('class') || '') + " ";
      var tar = ' ' + cls + ' ';
      while (cur.indexOf(tar) >= 0) {
        cur = cur.replace(tar, ' ');
      }
      el.setAttribute('class', cur.trim());
    }
  }

  /*  */

  function resolveTransition(def$$1) {
    if (!def$$1) {
      return;
    }
    /* istanbul ignore else */
    if ((typeof def$$1 === 'undefined' ? 'undefined' : _typeof(def$$1)) === 'object') {
      var res = {};
      if (def$$1.css !== false) {
        extend(res, autoCssTransition(def$$1.name || 'v'));
      }
      extend(res, def$$1);
      return res;
    } else if (typeof def$$1 === 'string') {
      return autoCssTransition(def$$1);
    }
  }

  var autoCssTransition = cached(function (name) {
    return {
      enterClass: name + "-enter",
      enterToClass: name + "-enter-to",
      enterActiveClass: name + "-enter-active",
      leaveClass: name + "-leave",
      leaveToClass: name + "-leave-to",
      leaveActiveClass: name + "-leave-active"
    };
  });

  var hasTransition = inBrowser && !isIE9;
  var TRANSITION = 'transition';
  var ANIMATION = 'animation';

  // Transition property/event sniffing
  var transitionProp = 'transition';
  var transitionEndEvent = 'transitionend';
  var animationProp = 'animation';
  var animationEndEvent = 'animationend';
  if (hasTransition) {
    /* istanbul ignore if */
    if (window.ontransitionend === undefined && window.onwebkittransitionend !== undefined) {
      transitionProp = 'WebkitTransition';
      transitionEndEvent = 'webkitTransitionEnd';
    }
    if (window.onanimationend === undefined && window.onwebkitanimationend !== undefined) {
      animationProp = 'WebkitAnimation';
      animationEndEvent = 'webkitAnimationEnd';
    }
  }

  // binding to window is necessary to make hot reload work in IE in strict mode
  var raf = inBrowser && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : setTimeout;

  function nextFrame(fn) {
    raf(function () {
      raf(fn);
    });
  }

  function addTransitionClass(el, cls) {
    (el._transitionClasses || (el._transitionClasses = [])).push(cls);
    addClass(el, cls);
  }

  function removeTransitionClass(el, cls) {
    if (el._transitionClasses) {
      remove(el._transitionClasses, cls);
    }
    removeClass(el, cls);
  }

  function whenTransitionEnds(el, expectedType, cb) {
    var ref = getTransitionInfo(el, expectedType);
    var type = ref.type;
    var timeout = ref.timeout;
    var propCount = ref.propCount;
    if (!type) {
      return cb();
    }
    var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
    var ended = 0;
    var end = function end() {
      el.removeEventListener(event, onEnd);
      cb();
    };
    var onEnd = function onEnd(e) {
      if (e.target === el) {
        if (++ended >= propCount) {
          end();
        }
      }
    };
    setTimeout(function () {
      if (ended < propCount) {
        end();
      }
    }, timeout + 1);
    el.addEventListener(event, onEnd);
  }

  var transformRE = /\b(transform|all)(,|$)/;

  function getTransitionInfo(el, expectedType) {
    var styles = window.getComputedStyle(el);
    var transitionDelays = styles[transitionProp + 'Delay'].split(', ');
    var transitionDurations = styles[transitionProp + 'Duration'].split(', ');
    var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
    var animationDelays = styles[animationProp + 'Delay'].split(', ');
    var animationDurations = styles[animationProp + 'Duration'].split(', ');
    var animationTimeout = getTimeout(animationDelays, animationDurations);

    var type;
    var timeout = 0;
    var propCount = 0;
    /* istanbul ignore if */
    if (expectedType === TRANSITION) {
      if (transitionTimeout > 0) {
        type = TRANSITION;
        timeout = transitionTimeout;
        propCount = transitionDurations.length;
      }
    } else if (expectedType === ANIMATION) {
      if (animationTimeout > 0) {
        type = ANIMATION;
        timeout = animationTimeout;
        propCount = animationDurations.length;
      }
    } else {
      timeout = Math.max(transitionTimeout, animationTimeout);
      type = timeout > 0 ? transitionTimeout > animationTimeout ? TRANSITION : ANIMATION : null;
      propCount = type ? type === TRANSITION ? transitionDurations.length : animationDurations.length : 0;
    }
    var hasTransform = type === TRANSITION && transformRE.test(styles[transitionProp + 'Property']);
    return {
      type: type,
      timeout: timeout,
      propCount: propCount,
      hasTransform: hasTransform
    };
  }

  function getTimeout(delays, durations) {
    /* istanbul ignore next */
    while (delays.length < durations.length) {
      delays = delays.concat(delays);
    }

    return Math.max.apply(null, durations.map(function (d, i) {
      return toMs(d) + toMs(delays[i]);
    }));
  }

  function toMs(s) {
    return Number(s.slice(0, -1)) * 1000;
  }

  /*  */

  function enter(vnode, toggleDisplay) {
    var el = vnode.elm;

    // call leave callback now
    if (el._leaveCb) {
      el._leaveCb.cancelled = true;
      el._leaveCb();
    }

    var data = resolveTransition(vnode.data.transition);
    if (!data) {
      return;
    }

    /* istanbul ignore if */
    if (el._enterCb || el.nodeType !== 1) {
      return;
    }

    var css = data.css;
    var type = data.type;
    var enterClass = data.enterClass;
    var enterToClass = data.enterToClass;
    var enterActiveClass = data.enterActiveClass;
    var appearClass = data.appearClass;
    var appearToClass = data.appearToClass;
    var appearActiveClass = data.appearActiveClass;
    var beforeEnter = data.beforeEnter;
    var enter = data.enter;
    var afterEnter = data.afterEnter;
    var enterCancelled = data.enterCancelled;
    var beforeAppear = data.beforeAppear;
    var appear = data.appear;
    var afterAppear = data.afterAppear;
    var appearCancelled = data.appearCancelled;
    var duration = data.duration;

    // activeInstance will always be the <transition> component managing this
    // transition. One edge case to check is when the <transition> is placed
    // as the root node of a child component. In that case we need to check
    // <transition>'s parent for appear check.
    var context = activeInstance;
    var transitionNode = activeInstance.$vnode;
    while (transitionNode && transitionNode.parent) {
      transitionNode = transitionNode.parent;
      context = transitionNode.context;
    }

    var isAppear = !context._isMounted || !vnode.isRootInsert;

    if (isAppear && !appear && appear !== '') {
      return;
    }

    var startClass = isAppear && appearClass ? appearClass : enterClass;
    var activeClass = isAppear && appearActiveClass ? appearActiveClass : enterActiveClass;
    var toClass = isAppear && appearToClass ? appearToClass : enterToClass;

    var beforeEnterHook = isAppear ? beforeAppear || beforeEnter : beforeEnter;
    var enterHook = isAppear ? typeof appear === 'function' ? appear : enter : enter;
    var afterEnterHook = isAppear ? afterAppear || afterEnter : afterEnter;
    var enterCancelledHook = isAppear ? appearCancelled || enterCancelled : enterCancelled;

    var explicitEnterDuration = toNumber(isObject(duration) ? duration.enter : duration);

    if ("development" !== 'production' && explicitEnterDuration != null) {
      checkDuration(explicitEnterDuration, 'enter', vnode);
    }

    var expectsCSS = css !== false && !isIE9;
    var userWantsControl = getHookArgumentsLength(enterHook);

    var cb = el._enterCb = once(function () {
      if (expectsCSS) {
        removeTransitionClass(el, toClass);
        removeTransitionClass(el, activeClass);
      }
      if (cb.cancelled) {
        if (expectsCSS) {
          removeTransitionClass(el, startClass);
        }
        enterCancelledHook && enterCancelledHook(el);
      } else {
        afterEnterHook && afterEnterHook(el);
      }
      el._enterCb = null;
    });

    if (!vnode.data.show) {
      // remove pending leave element on enter by injecting an insert hook
      mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'insert', function () {
        var parent = el.parentNode;
        var pendingNode = parent && parent._pending && parent._pending[vnode.key];
        if (pendingNode && pendingNode.tag === vnode.tag && pendingNode.elm._leaveCb) {
          pendingNode.elm._leaveCb();
        }
        enterHook && enterHook(el, cb);
      });
    }

    // start enter transition
    beforeEnterHook && beforeEnterHook(el);
    if (expectsCSS) {
      addTransitionClass(el, startClass);
      addTransitionClass(el, activeClass);
      nextFrame(function () {
        addTransitionClass(el, toClass);
        removeTransitionClass(el, startClass);
        if (!cb.cancelled && !userWantsControl) {
          if (isValidDuration(explicitEnterDuration)) {
            setTimeout(cb, explicitEnterDuration);
          } else {
            whenTransitionEnds(el, type, cb);
          }
        }
      });
    }

    if (vnode.data.show) {
      toggleDisplay && toggleDisplay();
      enterHook && enterHook(el, cb);
    }

    if (!expectsCSS && !userWantsControl) {
      cb();
    }
  }

  function leave(vnode, rm) {
    var el = vnode.elm;

    // call enter callback now
    if (el._enterCb) {
      el._enterCb.cancelled = true;
      el._enterCb();
    }

    var data = resolveTransition(vnode.data.transition);
    if (!data) {
      return rm();
    }

    /* istanbul ignore if */
    if (el._leaveCb || el.nodeType !== 1) {
      return;
    }

    var css = data.css;
    var type = data.type;
    var leaveClass = data.leaveClass;
    var leaveToClass = data.leaveToClass;
    var leaveActiveClass = data.leaveActiveClass;
    var beforeLeave = data.beforeLeave;
    var leave = data.leave;
    var afterLeave = data.afterLeave;
    var leaveCancelled = data.leaveCancelled;
    var delayLeave = data.delayLeave;
    var duration = data.duration;

    var expectsCSS = css !== false && !isIE9;
    var userWantsControl = getHookArgumentsLength(leave);

    var explicitLeaveDuration = toNumber(isObject(duration) ? duration.leave : duration);

    if ("development" !== 'production' && explicitLeaveDuration != null) {
      checkDuration(explicitLeaveDuration, 'leave', vnode);
    }

    var cb = el._leaveCb = once(function () {
      if (el.parentNode && el.parentNode._pending) {
        el.parentNode._pending[vnode.key] = null;
      }
      if (expectsCSS) {
        removeTransitionClass(el, leaveToClass);
        removeTransitionClass(el, leaveActiveClass);
      }
      if (cb.cancelled) {
        if (expectsCSS) {
          removeTransitionClass(el, leaveClass);
        }
        leaveCancelled && leaveCancelled(el);
      } else {
        rm();
        afterLeave && afterLeave(el);
      }
      el._leaveCb = null;
    });

    if (delayLeave) {
      delayLeave(performLeave);
    } else {
      performLeave();
    }

    function performLeave() {
      // the delayed leave may have already been cancelled
      if (cb.cancelled) {
        return;
      }
      // record leaving element
      if (!vnode.data.show) {
        (el.parentNode._pending || (el.parentNode._pending = {}))[vnode.key] = vnode;
      }
      beforeLeave && beforeLeave(el);
      if (expectsCSS) {
        addTransitionClass(el, leaveClass);
        addTransitionClass(el, leaveActiveClass);
        nextFrame(function () {
          addTransitionClass(el, leaveToClass);
          removeTransitionClass(el, leaveClass);
          if (!cb.cancelled && !userWantsControl) {
            if (isValidDuration(explicitLeaveDuration)) {
              setTimeout(cb, explicitLeaveDuration);
            } else {
              whenTransitionEnds(el, type, cb);
            }
          }
        });
      }
      leave && leave(el, cb);
      if (!expectsCSS && !userWantsControl) {
        cb();
      }
    }
  }

  // only used in dev mode
  function checkDuration(val, name, vnode) {
    if (typeof val !== 'number') {
      warn("<transition> explicit " + name + " duration is not a valid number - " + "got " + JSON.stringify(val) + ".", vnode.context);
    } else if (isNaN(val)) {
      warn("<transition> explicit " + name + " duration is NaN - " + 'the duration expression might be incorrect.', vnode.context);
    }
  }

  function isValidDuration(val) {
    return typeof val === 'number' && !isNaN(val);
  }

  /**
   * Normalize a transition hook's argument length. The hook may be:
   * - a merged hook (invoker) with the original in .fns
   * - a wrapped component method (check ._length)
   * - a plain function (.length)
   */
  function getHookArgumentsLength(fn) {
    if (!fn) {
      return false;
    }
    var invokerFns = fn.fns;
    if (invokerFns) {
      // invoker
      return getHookArgumentsLength(Array.isArray(invokerFns) ? invokerFns[0] : invokerFns);
    } else {
      return (fn._length || fn.length) > 1;
    }
  }

  function _enter(_, vnode) {
    if (!vnode.data.show) {
      enter(vnode);
    }
  }

  var transition = inBrowser ? {
    create: _enter,
    activate: _enter,
    remove: function remove$$1(vnode, rm) {
      /* istanbul ignore else */
      if (!vnode.data.show) {
        leave(vnode, rm);
      } else {
        rm();
      }
    }
  } : {};

  var platformModules = [attrs, klass, events, domProps, style, transition];

  /*  */

  // the directive module should be applied last, after all
  // built-in modules have been applied.
  var modules = platformModules.concat(baseModules);

  var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules });

  /**
   * Not type checking this file because flow doesn't like attaching
   * properties to Elements.
   */

  /* istanbul ignore if */
  if (isIE9) {
    // http://www.matts411.com/post/internet-explorer-9-oninput/
    document.addEventListener('selectionchange', function () {
      var el = document.activeElement;
      if (el && el.vmodel) {
        trigger(el, 'input');
      }
    });
  }

  var model$1 = {
    inserted: function inserted(el, binding, vnode) {
      if (vnode.tag === 'select') {
        var cb = function cb() {
          setSelected(el, binding, vnode.context);
        };
        cb();
        /* istanbul ignore if */
        if (isIE || isEdge) {
          setTimeout(cb, 0);
        }
      } else if (vnode.tag === 'textarea' || el.type === 'text') {
        el._vModifiers = binding.modifiers;
        if (!binding.modifiers.lazy) {
          if (!isAndroid) {
            el.addEventListener('compositionstart', onCompositionStart);
            el.addEventListener('compositionend', onCompositionEnd);
          }
          /* istanbul ignore if */
          if (isIE9) {
            el.vmodel = true;
          }
        }
      }
    },
    componentUpdated: function componentUpdated(el, binding, vnode) {
      if (vnode.tag === 'select') {
        setSelected(el, binding, vnode.context);
        // in case the options rendered by v-for have changed,
        // it's possible that the value is out-of-sync with the rendered options.
        // detect such cases and filter out values that no longer has a matching
        // option in the DOM.
        var needReset = el.multiple ? binding.value.some(function (v) {
          return hasNoMatchingOption(v, el.options);
        }) : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, el.options);
        if (needReset) {
          trigger(el, 'change');
        }
      }
    }
  };

  function setSelected(el, binding, vm) {
    var value = binding.value;
    var isMultiple = el.multiple;
    if (isMultiple && !Array.isArray(value)) {
      "development" !== 'production' && warn("<select multiple v-model=\"" + binding.expression + "\"> " + "expects an Array value for its binding, but got " + Object.prototype.toString.call(value).slice(8, -1), vm);
      return;
    }
    var selected, option;
    for (var i = 0, l = el.options.length; i < l; i++) {
      option = el.options[i];
      if (isMultiple) {
        selected = looseIndexOf(value, getValue(option)) > -1;
        if (option.selected !== selected) {
          option.selected = selected;
        }
      } else {
        if (looseEqual(getValue(option), value)) {
          if (el.selectedIndex !== i) {
            el.selectedIndex = i;
          }
          return;
        }
      }
    }
    if (!isMultiple) {
      el.selectedIndex = -1;
    }
  }

  function hasNoMatchingOption(value, options) {
    for (var i = 0, l = options.length; i < l; i++) {
      if (looseEqual(getValue(options[i]), value)) {
        return false;
      }
    }
    return true;
  }

  function getValue(option) {
    return '_value' in option ? option._value : option.value;
  }

  function onCompositionStart(e) {
    e.target.composing = true;
  }

  function onCompositionEnd(e) {
    e.target.composing = false;
    trigger(e.target, 'input');
  }

  function trigger(el, type) {
    var e = document.createEvent('HTMLEvents');
    e.initEvent(type, true, true);
    el.dispatchEvent(e);
  }

  /*  */

  // recursively search for possible transition defined inside the component root
  function locateNode(vnode) {
    return vnode.componentInstance && (!vnode.data || !vnode.data.transition) ? locateNode(vnode.componentInstance._vnode) : vnode;
  }

  var show = {
    bind: function bind(el, ref, vnode) {
      var value = ref.value;

      vnode = locateNode(vnode);
      var transition = vnode.data && vnode.data.transition;
      var originalDisplay = el.__vOriginalDisplay = el.style.display === 'none' ? '' : el.style.display;
      if (value && transition && !isIE9) {
        vnode.data.show = true;
        enter(vnode, function () {
          el.style.display = originalDisplay;
        });
      } else {
        el.style.display = value ? originalDisplay : 'none';
      }
    },

    update: function update(el, ref, vnode) {
      var value = ref.value;
      var oldValue = ref.oldValue;

      /* istanbul ignore if */
      if (value === oldValue) {
        return;
      }
      vnode = locateNode(vnode);
      var transition = vnode.data && vnode.data.transition;
      if (transition && !isIE9) {
        vnode.data.show = true;
        if (value) {
          enter(vnode, function () {
            el.style.display = el.__vOriginalDisplay;
          });
        } else {
          leave(vnode, function () {
            el.style.display = 'none';
          });
        }
      } else {
        el.style.display = value ? el.__vOriginalDisplay : 'none';
      }
    },

    unbind: function unbind(el, binding, vnode, oldVnode, isDestroy) {
      if (!isDestroy) {
        el.style.display = el.__vOriginalDisplay;
      }
    }
  };

  var platformDirectives = {
    model: model$1,
    show: show
  };

  /*  */

  // Provides transition support for a single element/component.
  // supports transition mode (out-in / in-out)

  var transitionProps = {
    name: String,
    appear: Boolean,
    css: Boolean,
    mode: String,
    type: String,
    enterClass: String,
    leaveClass: String,
    enterToClass: String,
    leaveToClass: String,
    enterActiveClass: String,
    leaveActiveClass: String,
    appearClass: String,
    appearActiveClass: String,
    appearToClass: String,
    duration: [Number, String, Object]
  };

  // in case the child is also an abstract component, e.g. <keep-alive>
  // we want to recursively retrieve the real component to be rendered
  function getRealChild(vnode) {
    var compOptions = vnode && vnode.componentOptions;
    if (compOptions && compOptions.Ctor.options.abstract) {
      return getRealChild(getFirstComponentChild(compOptions.children));
    } else {
      return vnode;
    }
  }

  function extractTransitionData(comp) {
    var data = {};
    var options = comp.$options;
    // props
    for (var key in options.propsData) {
      data[key] = comp[key];
    }
    // events.
    // extract listeners and pass them directly to the transition methods
    var listeners = options._parentListeners;
    for (var key$1 in listeners) {
      data[camelize(key$1)] = listeners[key$1];
    }
    return data;
  }

  function placeholder(h, rawChild) {
    return (/\d-keep-alive$/.test(rawChild.tag) ? h('keep-alive') : null
    );
  }

  function hasParentTransition(vnode) {
    while (vnode = vnode.parent) {
      if (vnode.data.transition) {
        return true;
      }
    }
  }

  function isSameChild(child, oldChild) {
    return oldChild.key === child.key && oldChild.tag === child.tag;
  }

  var Transition = {
    name: 'transition',
    props: transitionProps,
    abstract: true,

    render: function render(h) {
      var this$1 = this;

      var children = this.$slots.default;
      if (!children) {
        return;
      }

      // filter out text nodes (possible whitespaces)
      children = children.filter(function (c) {
        return c.tag;
      });
      /* istanbul ignore if */
      if (!children.length) {
        return;
      }

      // warn multiple elements
      if ("development" !== 'production' && children.length > 1) {
        warn('<transition> can only be used on a single element. Use ' + '<transition-group> for lists.', this.$parent);
      }

      var mode = this.mode;

      // warn invalid mode
      if ("development" !== 'production' && mode && mode !== 'in-out' && mode !== 'out-in') {
        warn('invalid <transition> mode: ' + mode, this.$parent);
      }

      var rawChild = children[0];

      // if this is a component root node and the component's
      // parent container node also has transition, skip.
      if (hasParentTransition(this.$vnode)) {
        return rawChild;
      }

      // apply transition data to child
      // use getRealChild() to ignore abstract components e.g. keep-alive
      var child = getRealChild(rawChild);
      /* istanbul ignore if */
      if (!child) {
        return rawChild;
      }

      if (this._leaving) {
        return placeholder(h, rawChild);
      }

      // ensure a key that is unique to the vnode type and to this transition
      // component instance. This key will be used to remove pending leaving nodes
      // during entering.
      var id = "__transition-" + this._uid + "-";
      child.key = child.key == null ? id + child.tag : isPrimitive(child.key) ? String(child.key).indexOf(id) === 0 ? child.key : id + child.key : child.key;

      var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
      var oldRawChild = this._vnode;
      var oldChild = getRealChild(oldRawChild);

      // mark v-show
      // so that the transition module can hand over the control to the directive
      if (child.data.directives && child.data.directives.some(function (d) {
        return d.name === 'show';
      })) {
        child.data.show = true;
      }

      if (oldChild && oldChild.data && !isSameChild(child, oldChild)) {
        // replace old child transition data with fresh one
        // important for dynamic transitions!
        var oldData = oldChild && (oldChild.data.transition = extend({}, data));
        // handle transition mode
        if (mode === 'out-in') {
          // return placeholder node and queue update when leave finishes
          this._leaving = true;
          mergeVNodeHook(oldData, 'afterLeave', function () {
            this$1._leaving = false;
            this$1.$forceUpdate();
          });
          return placeholder(h, rawChild);
        } else if (mode === 'in-out') {
          var delayedLeave;
          var performLeave = function performLeave() {
            delayedLeave();
          };
          mergeVNodeHook(data, 'afterEnter', performLeave);
          mergeVNodeHook(data, 'enterCancelled', performLeave);
          mergeVNodeHook(oldData, 'delayLeave', function (leave) {
            delayedLeave = leave;
          });
        }
      }

      return rawChild;
    }
  };

  /*  */

  // Provides transition support for list items.
  // supports move transitions using the FLIP technique.

  // Because the vdom's children update algorithm is "unstable" - i.e.
  // it doesn't guarantee the relative positioning of removed elements,
  // we force transition-group to update its children into two passes:
  // in the first pass, we remove all nodes that need to be removed,
  // triggering their leaving transition; in the second pass, we insert/move
  // into the final desired state. This way in the second pass removed
  // nodes will remain where they should be.

  var props = extend({
    tag: String,
    moveClass: String
  }, transitionProps);

  delete props.mode;

  var TransitionGroup = {
    props: props,

    render: function render(h) {
      var tag = this.tag || this.$vnode.data.tag || 'span';
      var map = Object.create(null);
      var prevChildren = this.prevChildren = this.children;
      var rawChildren = this.$slots.default || [];
      var children = this.children = [];
      var transitionData = extractTransitionData(this);

      for (var i = 0; i < rawChildren.length; i++) {
        var c = rawChildren[i];
        if (c.tag) {
          if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
            children.push(c);
            map[c.key] = c;(c.data || (c.data = {})).transition = transitionData;
          } else {
            var opts = c.componentOptions;
            var name = opts ? opts.Ctor.options.name || opts.tag || '' : c.tag;
            warn("<transition-group> children must be keyed: <" + name + ">");
          }
        }
      }

      if (prevChildren) {
        var kept = [];
        var removed = [];
        for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
          var c$1 = prevChildren[i$1];
          c$1.data.transition = transitionData;
          c$1.data.pos = c$1.elm.getBoundingClientRect();
          if (map[c$1.key]) {
            kept.push(c$1);
          } else {
            removed.push(c$1);
          }
        }
        this.kept = h(tag, null, kept);
        this.removed = removed;
      }

      return h(tag, null, children);
    },

    beforeUpdate: function beforeUpdate() {
      // force removing pass
      this.__patch__(this._vnode, this.kept, false, // hydrating
      true // removeOnly (!important, avoids unnecessary moves)
      );
      this._vnode = this.kept;
    },

    updated: function updated() {
      var children = this.prevChildren;
      var moveClass = this.moveClass || (this.name || 'v') + '-move';
      if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
        return;
      }

      // we divide the work into three loops to avoid mixing DOM reads and writes
      // in each iteration - which helps prevent layout thrashing.
      children.forEach(callPendingCbs);
      children.forEach(recordPosition);
      children.forEach(applyTranslation);

      // force reflow to put everything in position
      var body = document.body;
      var f = body.offsetHeight; // eslint-disable-line

      children.forEach(function (c) {
        if (c.data.moved) {
          var el = c.elm;
          var s = el.style;
          addTransitionClass(el, moveClass);
          s.transform = s.WebkitTransform = s.transitionDuration = '';
          el.addEventListener(transitionEndEvent, el._moveCb = function cb(e) {
            if (!e || /transform$/.test(e.propertyName)) {
              el.removeEventListener(transitionEndEvent, cb);
              el._moveCb = null;
              removeTransitionClass(el, moveClass);
            }
          });
        }
      });
    },

    methods: {
      hasMove: function hasMove(el, moveClass) {
        /* istanbul ignore if */
        if (!hasTransition) {
          return false;
        }
        if (this._hasMove != null) {
          return this._hasMove;
        }
        // Detect whether an element with the move class applied has
        // CSS transitions. Since the element may be inside an entering
        // transition at this very moment, we make a clone of it and remove
        // all other transition classes applied to ensure only the move class
        // is applied.
        var clone = el.cloneNode();
        if (el._transitionClasses) {
          el._transitionClasses.forEach(function (cls) {
            removeClass(clone, cls);
          });
        }
        addClass(clone, moveClass);
        clone.style.display = 'none';
        this.$el.appendChild(clone);
        var info = getTransitionInfo(clone);
        this.$el.removeChild(clone);
        return this._hasMove = info.hasTransform;
      }
    }
  };

  function callPendingCbs(c) {
    /* istanbul ignore if */
    if (c.elm._moveCb) {
      c.elm._moveCb();
    }
    /* istanbul ignore if */
    if (c.elm._enterCb) {
      c.elm._enterCb();
    }
  }

  function recordPosition(c) {
    c.data.newPos = c.elm.getBoundingClientRect();
  }

  function applyTranslation(c) {
    var oldPos = c.data.pos;
    var newPos = c.data.newPos;
    var dx = oldPos.left - newPos.left;
    var dy = oldPos.top - newPos.top;
    if (dx || dy) {
      c.data.moved = true;
      var s = c.elm.style;
      s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
      s.transitionDuration = '0s';
    }
  }

  var platformComponents = {
    Transition: Transition,
    TransitionGroup: TransitionGroup
  };

  /*  */

  // install platform specific utils
  Vue$3.config.mustUseProp = mustUseProp;
  Vue$3.config.isReservedTag = isReservedTag;
  Vue$3.config.getTagNamespace = getTagNamespace;
  Vue$3.config.isUnknownElement = isUnknownElement;

  // install platform runtime directives & components
  extend(Vue$3.options.directives, platformDirectives);
  extend(Vue$3.options.components, platformComponents);

  // install platform patch function
  Vue$3.prototype.__patch__ = inBrowser ? patch : noop;

  // public mount method
  Vue$3.prototype.$mount = function (el, hydrating) {
    el = el && inBrowser ? query(el) : undefined;
    return mountComponent(this, el, hydrating);
  };

  // devtools global hook
  /* istanbul ignore next */
  setTimeout(function () {
    if (config.devtools) {
      if (devtools) {
        devtools.emit('init', Vue$3);
      } else if ("development" !== 'production' && isChrome) {
        console[console.info ? 'info' : 'log']('Download the Vue Devtools extension for a better development experience:\n' + 'https://github.com/vuejs/vue-devtools');
      }
    }
    if ("development" !== 'production' && config.productionTip !== false && inBrowser && typeof console !== 'undefined') {
      console[console.info ? 'info' : 'log']("You are running Vue in development mode.\n" + "Make sure to turn on production mode when deploying for production.\n" + "See more tips at https://vuejs.org/guide/deployment.html");
    }
  }, 0);

  /*  */

  // check whether current browser encodes a char inside attribute values
  function shouldDecode(content, encoded) {
    var div = document.createElement('div');
    div.innerHTML = "<div a=\"" + content + "\">";
    return div.innerHTML.indexOf(encoded) > 0;
  }

  // #3663
  // IE encodes newlines inside attribute values while other browsers don't
  var shouldDecodeNewlines = inBrowser ? shouldDecode('\n', '&#10;') : false;

  /*  */

  var isUnaryTag = makeMap('area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' + 'link,meta,param,source,track,wbr');

  // Elements that you can, intentionally, leave open
  // (and which close themselves)
  var canBeLeftOpenTag = makeMap('colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source');

  // HTML5 tags https://html.spec.whatwg.org/multipage/indices.html#elements-3
  // Phrasing Content https://html.spec.whatwg.org/multipage/dom.html#phrasing-content
  var isNonPhrasingTag = makeMap('address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' + 'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' + 'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' + 'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' + 'title,tr,track');

  /*  */

  var decoder;

  function decode(html) {
    decoder = decoder || document.createElement('div');
    decoder.innerHTML = html;
    return decoder.textContent;
  }

  /**
   * Not type-checking this file because it's mostly vendor code.
   */

  /*!
   * HTML Parser By John Resig (ejohn.org)
   * Modified by Juriy "kangax" Zaytsev
   * Original code by Erik Arvidsson, Mozilla Public License
   * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
   */

  // Regular Expressions for parsing tags and attributes
  var singleAttrIdentifier = /([^\s"'<>/=]+)/;
  var singleAttrAssign = /(?:=)/;
  var singleAttrValues = [
  // attr value double quotes
  /"([^"]*)"+/.source,
  // attr value, single quotes
  /'([^']*)'+/.source,
  // attr value, no quotes
  /([^\s"'=<>`]+)/.source];
  var attribute = new RegExp('^\\s*' + singleAttrIdentifier.source + '(?:\\s*(' + singleAttrAssign.source + ')' + '\\s*(?:' + singleAttrValues.join('|') + '))?');

  // could use https://www.w3.org/TR/1999/REC-xml-names-19990114/#NT-QName
  // but for Vue templates we can enforce a simple charset
  var ncname = '[a-zA-Z_][\\w\\-\\.]*';
  var qnameCapture = '((?:' + ncname + '\\:)?' + ncname + ')';
  var startTagOpen = new RegExp('^<' + qnameCapture);
  var startTagClose = /^\s*(\/?)>/;
  var endTag = new RegExp('^<\\/' + qnameCapture + '[^>]*>');
  var doctype = /^<!DOCTYPE [^>]+>/i;
  var comment = /^<!--/;
  var conditionalComment = /^<!\[/;

  var IS_REGEX_CAPTURING_BROKEN = false;
  'x'.replace(/x(.)?/g, function (m, g) {
    IS_REGEX_CAPTURING_BROKEN = g === '';
  });

  // Special Elements (can contain anything)
  var isScriptOrStyle = makeMap('script,style', true);
  var reCache = {};

  var decodingMap = {
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&amp;': '&',
    '&#10;': '\n'
  };
  var encodedAttr = /&(?:lt|gt|quot|amp);/g;
  var encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#10);/g;

  function decodeAttr(value, shouldDecodeNewlines) {
    var re = shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr;
    return value.replace(re, function (match) {
      return decodingMap[match];
    });
  }

  function parseHTML(html, options) {
    var stack = [];
    var expectHTML = options.expectHTML;
    var isUnaryTag$$1 = options.isUnaryTag || no;
    var index = 0;
    var last, lastTag;
    while (html) {
      last = html;
      // Make sure we're not in a script or style element
      if (!lastTag || !isScriptOrStyle(lastTag)) {
        var textEnd = html.indexOf('<');
        if (textEnd === 0) {
          // Comment:
          if (comment.test(html)) {
            var commentEnd = html.indexOf('-->');

            if (commentEnd >= 0) {
              advance(commentEnd + 3);
              continue;
            }
          }

          // http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
          if (conditionalComment.test(html)) {
            var conditionalEnd = html.indexOf(']>');

            if (conditionalEnd >= 0) {
              advance(conditionalEnd + 2);
              continue;
            }
          }

          // Doctype:
          var doctypeMatch = html.match(doctype);
          if (doctypeMatch) {
            advance(doctypeMatch[0].length);
            continue;
          }

          // End tag:
          var endTagMatch = html.match(endTag);
          if (endTagMatch) {
            var curIndex = index;
            advance(endTagMatch[0].length);
            parseEndTag(endTagMatch[1], curIndex, index);
            continue;
          }

          // Start tag:
          var startTagMatch = parseStartTag();
          if (startTagMatch) {
            handleStartTag(startTagMatch);
            continue;
          }
        }

        var text = void 0,
            rest$1 = void 0,
            next = void 0;
        if (textEnd >= 0) {
          rest$1 = html.slice(textEnd);
          while (!endTag.test(rest$1) && !startTagOpen.test(rest$1) && !comment.test(rest$1) && !conditionalComment.test(rest$1)) {
            // < in plain text, be forgiving and treat it as text
            next = rest$1.indexOf('<', 1);
            if (next < 0) {
              break;
            }
            textEnd += next;
            rest$1 = html.slice(textEnd);
          }
          text = html.substring(0, textEnd);
          advance(textEnd);
        }

        if (textEnd < 0) {
          text = html;
          html = '';
        }

        if (options.chars && text) {
          options.chars(text);
        }
      } else {
        var stackedTag = lastTag.toLowerCase();
        var reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp('([\\s\\S]*?)(</' + stackedTag + '[^>]*>)', 'i'));
        var endTagLength = 0;
        var rest = html.replace(reStackedTag, function (all, text, endTag) {
          endTagLength = endTag.length;
          if (stackedTag !== 'script' && stackedTag !== 'style' && stackedTag !== 'noscript') {
            text = text.replace(/<!--([\s\S]*?)-->/g, '$1').replace(/<!\[CDATA\[([\s\S]*?)]]>/g, '$1');
          }
          if (options.chars) {
            options.chars(text);
          }
          return '';
        });
        index += html.length - rest.length;
        html = rest;
        parseEndTag(stackedTag, index - endTagLength, index);
      }

      if (html === last) {
        options.chars && options.chars(html);
        if ("development" !== 'production' && !stack.length && options.warn) {
          options.warn("Mal-formatted tag at end of template: \"" + html + "\"");
        }
        break;
      }
    }

    // Clean up any remaining tags
    parseEndTag();

    function advance(n) {
      index += n;
      html = html.substring(n);
    }

    function parseStartTag() {
      var start = html.match(startTagOpen);
      if (start) {
        var match = {
          tagName: start[1],
          attrs: [],
          start: index
        };
        advance(start[0].length);
        var end, attr;
        while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          advance(attr[0].length);
          match.attrs.push(attr);
        }
        if (end) {
          match.unarySlash = end[1];
          advance(end[0].length);
          match.end = index;
          return match;
        }
      }
    }

    function handleStartTag(match) {
      var tagName = match.tagName;
      var unarySlash = match.unarySlash;

      if (expectHTML) {
        if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
          parseEndTag(lastTag);
        }
        if (canBeLeftOpenTag(tagName) && lastTag === tagName) {
          parseEndTag(tagName);
        }
      }

      var unary = isUnaryTag$$1(tagName) || tagName === 'html' && lastTag === 'head' || !!unarySlash;

      var l = match.attrs.length;
      var attrs = new Array(l);
      for (var i = 0; i < l; i++) {
        var args = match.attrs[i];
        // hackish work around FF bug https://bugzilla.mozilla.org/show_bug.cgi?id=369778
        if (IS_REGEX_CAPTURING_BROKEN && args[0].indexOf('""') === -1) {
          if (args[3] === '') {
            delete args[3];
          }
          if (args[4] === '') {
            delete args[4];
          }
          if (args[5] === '') {
            delete args[5];
          }
        }
        var value = args[3] || args[4] || args[5] || '';
        attrs[i] = {
          name: args[1],
          value: decodeAttr(value, options.shouldDecodeNewlines)
        };
      }

      if (!unary) {
        stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs });
        lastTag = tagName;
      }

      if (options.start) {
        options.start(tagName, attrs, unary, match.start, match.end);
      }
    }

    function parseEndTag(tagName, start, end) {
      var pos, lowerCasedTagName;
      if (start == null) {
        start = index;
      }
      if (end == null) {
        end = index;
      }

      if (tagName) {
        lowerCasedTagName = tagName.toLowerCase();
      }

      // Find the closest opened tag of the same type
      if (tagName) {
        for (pos = stack.length - 1; pos >= 0; pos--) {
          if (stack[pos].lowerCasedTag === lowerCasedTagName) {
            break;
          }
        }
      } else {
        // If no tag name is provided, clean shop
        pos = 0;
      }

      if (pos >= 0) {
        // Close all the open elements, up the stack
        for (var i = stack.length - 1; i >= pos; i--) {
          if ("development" !== 'production' && (i > pos || !tagName) && options.warn) {
            options.warn("tag <" + stack[i].tag + "> has no matching end tag.");
          }
          if (options.end) {
            options.end(stack[i].tag, start, end);
          }
        }

        // Remove the open elements from the stack
        stack.length = pos;
        lastTag = pos && stack[pos - 1].tag;
      } else if (lowerCasedTagName === 'br') {
        if (options.start) {
          options.start(tagName, [], true, start, end);
        }
      } else if (lowerCasedTagName === 'p') {
        if (options.start) {
          options.start(tagName, [], false, start, end);
        }
        if (options.end) {
          options.end(tagName, start, end);
        }
      }
    }
  }

  /*  */

  var defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g;
  var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;

  var buildRegex = cached(function (delimiters) {
    var open = delimiters[0].replace(regexEscapeRE, '\\$&');
    var close = delimiters[1].replace(regexEscapeRE, '\\$&');
    return new RegExp(open + '((?:.|\\n)+?)' + close, 'g');
  });

  function parseText(text, delimiters) {
    var tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE;
    if (!tagRE.test(text)) {
      return;
    }
    var tokens = [];
    var lastIndex = tagRE.lastIndex = 0;
    var match, index;
    while (match = tagRE.exec(text)) {
      index = match.index;
      // push text token
      if (index > lastIndex) {
        tokens.push(JSON.stringify(text.slice(lastIndex, index)));
      }
      // tag token
      var exp = parseFilters(match[1].trim());
      tokens.push("_s(" + exp + ")");
      lastIndex = index + match[0].length;
    }
    if (lastIndex < text.length) {
      tokens.push(JSON.stringify(text.slice(lastIndex)));
    }
    return tokens.join('+');
  }

  /*  */

  var dirRE = /^v-|^@|^:/;
  var onRE = /^@|^v-on:/;
  var forAliasRE = /(.*?)\s+(?:in|of)\s+(.*)/;
  var forIteratorRE = /\((\{[^}]*\}|[^,]*),([^,]*)(?:,([^,]*))?\)/;
  var bindRE = /^:|^v-bind:/;
  var argRE = /:(.*)$/;
  var modifierRE = /\.[^.]+/g;

  var decodeHTMLCached = cached(decode);

  // configurable state
  var warn$2;
  var platformGetTagNamespace;
  var platformMustUseProp;
  var platformIsPreTag;
  var preTransforms;
  var transforms;
  var postTransforms;
  var delimiters;

  /**
   * Convert HTML string to AST.
   */
  function parse(template, options) {
    warn$2 = options.warn || baseWarn;
    platformGetTagNamespace = options.getTagNamespace || no;
    platformMustUseProp = options.mustUseProp || no;
    platformIsPreTag = options.isPreTag || no;
    preTransforms = pluckModuleFunction(options.modules, 'preTransformNode');
    transforms = pluckModuleFunction(options.modules, 'transformNode');
    postTransforms = pluckModuleFunction(options.modules, 'postTransformNode');
    delimiters = options.delimiters;

    var stack = [];
    var preserveWhitespace = options.preserveWhitespace !== false;
    var root;
    var currentParent;
    var inVPre = false;
    var inPre = false;
    var warned = false;

    function endPre(element) {
      // check pre state
      if (element.pre) {
        inVPre = false;
      }
      if (platformIsPreTag(element.tag)) {
        inPre = false;
      }
    }

    parseHTML(template, {
      warn: warn$2,
      expectHTML: options.expectHTML,
      isUnaryTag: options.isUnaryTag,
      shouldDecodeNewlines: options.shouldDecodeNewlines,
      start: function start(tag, attrs, unary) {
        // check namespace.
        // inherit parent ns if there is one
        var ns = currentParent && currentParent.ns || platformGetTagNamespace(tag);

        // handle IE svg bug
        /* istanbul ignore if */
        if (isIE && ns === 'svg') {
          attrs = guardIESVGBug(attrs);
        }

        var element = {
          type: 1,
          tag: tag,
          attrsList: attrs,
          attrsMap: makeAttrsMap(attrs),
          parent: currentParent,
          children: []
        };
        if (ns) {
          element.ns = ns;
        }

        if (isForbiddenTag(element) && !isServerRendering()) {
          element.forbidden = true;
          "development" !== 'production' && warn$2('Templates should only be responsible for mapping the state to the ' + 'UI. Avoid placing tags with side-effects in your templates, such as ' + "<" + tag + ">" + ', as they will not be parsed.');
        }

        // apply pre-transforms
        for (var i = 0; i < preTransforms.length; i++) {
          preTransforms[i](element, options);
        }

        if (!inVPre) {
          processPre(element);
          if (element.pre) {
            inVPre = true;
          }
        }
        if (platformIsPreTag(element.tag)) {
          inPre = true;
        }
        if (inVPre) {
          processRawAttrs(element);
        } else {
          processFor(element);
          processIf(element);
          processOnce(element);
          processKey(element);

          // determine whether this is a plain element after
          // removing structural attributes
          element.plain = !element.key && !attrs.length;

          processRef(element);
          processSlot(element);
          processComponent(element);
          for (var i$1 = 0; i$1 < transforms.length; i$1++) {
            transforms[i$1](element, options);
          }
          processAttrs(element);
        }

        function checkRootConstraints(el) {
          if ("development" !== 'production' && !warned) {
            if (el.tag === 'slot' || el.tag === 'template') {
              warned = true;
              warn$2("Cannot use <" + el.tag + "> as component root element because it may " + 'contain multiple nodes.');
            }
            if (el.attrsMap.hasOwnProperty('v-for')) {
              warned = true;
              warn$2('Cannot use v-for on stateful component root element because ' + 'it renders multiple elements.');
            }
          }
        }

        // tree management
        if (!root) {
          root = element;
          checkRootConstraints(root);
        } else if (!stack.length) {
          // allow root elements with v-if, v-else-if and v-else
          if (root.if && (element.elseif || element.else)) {
            checkRootConstraints(element);
            addIfCondition(root, {
              exp: element.elseif,
              block: element
            });
          } else if ("development" !== 'production' && !warned) {
            warned = true;
            warn$2("Component template should contain exactly one root element. " + "If you are using v-if on multiple elements, " + "use v-else-if to chain them instead.");
          }
        }
        if (currentParent && !element.forbidden) {
          if (element.elseif || element.else) {
            processIfConditions(element, currentParent);
          } else if (element.slotScope) {
            // scoped slot
            currentParent.plain = false;
            var name = element.slotTarget || '"default"';(currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element;
          } else {
            currentParent.children.push(element);
            element.parent = currentParent;
          }
        }
        if (!unary) {
          currentParent = element;
          stack.push(element);
        } else {
          endPre(element);
        }
        // apply post-transforms
        for (var i$2 = 0; i$2 < postTransforms.length; i$2++) {
          postTransforms[i$2](element, options);
        }
      },

      end: function end() {
        // remove trailing whitespace
        var element = stack[stack.length - 1];
        var lastNode = element.children[element.children.length - 1];
        if (lastNode && lastNode.type === 3 && lastNode.text === ' ' && !inPre) {
          element.children.pop();
        }
        // pop stack
        stack.length -= 1;
        currentParent = stack[stack.length - 1];
        endPre(element);
      },

      chars: function chars(text) {
        if (!currentParent) {
          if ("development" !== 'production' && !warned && text === template) {
            warned = true;
            warn$2('Component template requires a root element, rather than just text.');
          }
          return;
        }
        // IE textarea placeholder bug
        /* istanbul ignore if */
        if (isIE && currentParent.tag === 'textarea' && currentParent.attrsMap.placeholder === text) {
          return;
        }
        var children = currentParent.children;
        text = inPre || text.trim() ? decodeHTMLCached(text)
        // only preserve whitespace if its not right after a starting tag
        : preserveWhitespace && children.length ? ' ' : '';
        if (text) {
          var expression;
          if (!inVPre && text !== ' ' && (expression = parseText(text, delimiters))) {
            children.push({
              type: 2,
              expression: expression,
              text: text
            });
          } else if (text !== ' ' || !children.length || children[children.length - 1].text !== ' ') {
            children.push({
              type: 3,
              text: text
            });
          }
        }
      }
    });
    return root;
  }

  function processPre(el) {
    if (getAndRemoveAttr(el, 'v-pre') != null) {
      el.pre = true;
    }
  }

  function processRawAttrs(el) {
    var l = el.attrsList.length;
    if (l) {
      var attrs = el.attrs = new Array(l);
      for (var i = 0; i < l; i++) {
        attrs[i] = {
          name: el.attrsList[i].name,
          value: JSON.stringify(el.attrsList[i].value)
        };
      }
    } else if (!el.pre) {
      // non root node in pre blocks with no attributes
      el.plain = true;
    }
  }

  function processKey(el) {
    var exp = getBindingAttr(el, 'key');
    if (exp) {
      if ("development" !== 'production' && el.tag === 'template') {
        warn$2("<template> cannot be keyed. Place the key on real elements instead.");
      }
      el.key = exp;
    }
  }

  function processRef(el) {
    var ref = getBindingAttr(el, 'ref');
    if (ref) {
      el.ref = ref;
      el.refInFor = checkInFor(el);
    }
  }

  function processFor(el) {
    var exp;
    if (exp = getAndRemoveAttr(el, 'v-for')) {
      var inMatch = exp.match(forAliasRE);
      if (!inMatch) {
        "development" !== 'production' && warn$2("Invalid v-for expression: " + exp);
        return;
      }
      el.for = inMatch[2].trim();
      var alias = inMatch[1].trim();
      var iteratorMatch = alias.match(forIteratorRE);
      if (iteratorMatch) {
        el.alias = iteratorMatch[1].trim();
        el.iterator1 = iteratorMatch[2].trim();
        if (iteratorMatch[3]) {
          el.iterator2 = iteratorMatch[3].trim();
        }
      } else {
        el.alias = alias;
      }
    }
  }

  function processIf(el) {
    var exp = getAndRemoveAttr(el, 'v-if');
    if (exp) {
      el.if = exp;
      addIfCondition(el, {
        exp: exp,
        block: el
      });
    } else {
      if (getAndRemoveAttr(el, 'v-else') != null) {
        el.else = true;
      }
      var elseif = getAndRemoveAttr(el, 'v-else-if');
      if (elseif) {
        el.elseif = elseif;
      }
    }
  }

  function processIfConditions(el, parent) {
    var prev = findPrevElement(parent.children);
    if (prev && prev.if) {
      addIfCondition(prev, {
        exp: el.elseif,
        block: el
      });
    } else {
      warn$2("v-" + (el.elseif ? 'else-if="' + el.elseif + '"' : 'else') + " " + "used on element <" + el.tag + "> without corresponding v-if.");
    }
  }

  function findPrevElement(children) {
    var i = children.length;
    while (i--) {
      if (children[i].type === 1) {
        return children[i];
      } else {
        if ("development" !== 'production' && children[i].text !== ' ') {
          warn$2("text \"" + children[i].text.trim() + "\" between v-if and v-else(-if) " + "will be ignored.");
        }
        children.pop();
      }
    }
  }

  function addIfCondition(el, condition) {
    if (!el.ifConditions) {
      el.ifConditions = [];
    }
    el.ifConditions.push(condition);
  }

  function processOnce(el) {
    var once$$1 = getAndRemoveAttr(el, 'v-once');
    if (once$$1 != null) {
      el.once = true;
    }
  }

  function processSlot(el) {
    if (el.tag === 'slot') {
      el.slotName = getBindingAttr(el, 'name');
      if ("development" !== 'production' && el.key) {
        warn$2("`key` does not work on <slot> because slots are abstract outlets " + "and can possibly expand into multiple elements. " + "Use the key on a wrapping element instead.");
      }
    } else {
      var slotTarget = getBindingAttr(el, 'slot');
      if (slotTarget) {
        el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget;
      }
      if (el.tag === 'template') {
        el.slotScope = getAndRemoveAttr(el, 'scope');
      }
    }
  }

  function processComponent(el) {
    var binding;
    if (binding = getBindingAttr(el, 'is')) {
      el.component = binding;
    }
    if (getAndRemoveAttr(el, 'inline-template') != null) {
      el.inlineTemplate = true;
    }
  }

  function processAttrs(el) {
    var list = el.attrsList;
    var i, l, name, rawName, value, arg, modifiers, isProp;
    for (i = 0, l = list.length; i < l; i++) {
      name = rawName = list[i].name;
      value = list[i].value;
      if (dirRE.test(name)) {
        // mark element as dynamic
        el.hasBindings = true;
        // modifiers
        modifiers = parseModifiers(name);
        if (modifiers) {
          name = name.replace(modifierRE, '');
        }
        if (bindRE.test(name)) {
          // v-bind
          name = name.replace(bindRE, '');
          value = parseFilters(value);
          isProp = false;
          if (modifiers) {
            if (modifiers.prop) {
              isProp = true;
              name = camelize(name);
              if (name === 'innerHtml') {
                name = 'innerHTML';
              }
            }
            if (modifiers.camel) {
              name = camelize(name);
            }
          }
          if (isProp || platformMustUseProp(el.tag, el.attrsMap.type, name)) {
            addProp(el, name, value);
          } else {
            addAttr(el, name, value);
          }
        } else if (onRE.test(name)) {
          // v-on
          name = name.replace(onRE, '');
          addHandler(el, name, value, modifiers);
        } else {
          // normal directives
          name = name.replace(dirRE, '');
          // parse arg
          var argMatch = name.match(argRE);
          if (argMatch && (arg = argMatch[1])) {
            name = name.slice(0, -(arg.length + 1));
          }
          addDirective(el, name, rawName, value, arg, modifiers);
          if ("development" !== 'production' && name === 'model') {
            checkForAliasModel(el, value);
          }
        }
      } else {
        // literal attribute
        {
          var expression = parseText(value, delimiters);
          if (expression) {
            warn$2(name + "=\"" + value + "\": " + 'Interpolation inside attributes has been removed. ' + 'Use v-bind or the colon shorthand instead. For example, ' + 'instead of <div id="{{ val }}">, use <div :id="val">.');
          }
        }
        addAttr(el, name, JSON.stringify(value));
      }
    }
  }

  function checkInFor(el) {
    var parent = el;
    while (parent) {
      if (parent.for !== undefined) {
        return true;
      }
      parent = parent.parent;
    }
    return false;
  }

  function parseModifiers(name) {
    var match = name.match(modifierRE);
    if (match) {
      var ret = {};
      match.forEach(function (m) {
        ret[m.slice(1)] = true;
      });
      return ret;
    }
  }

  function makeAttrsMap(attrs) {
    var map = {};
    for (var i = 0, l = attrs.length; i < l; i++) {
      if ("development" !== 'production' && map[attrs[i].name] && !isIE) {
        warn$2('duplicate attribute: ' + attrs[i].name);
      }
      map[attrs[i].name] = attrs[i].value;
    }
    return map;
  }

  function isForbiddenTag(el) {
    return el.tag === 'style' || el.tag === 'script' && (!el.attrsMap.type || el.attrsMap.type === 'text/javascript');
  }

  var ieNSBug = /^xmlns:NS\d+/;
  var ieNSPrefix = /^NS\d+:/;

  /* istanbul ignore next */
  function guardIESVGBug(attrs) {
    var res = [];
    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];
      if (!ieNSBug.test(attr.name)) {
        attr.name = attr.name.replace(ieNSPrefix, '');
        res.push(attr);
      }
    }
    return res;
  }

  function checkForAliasModel(el, value) {
    var _el = el;
    while (_el) {
      if (_el.for && _el.alias === value) {
        warn$2("<" + el.tag + " v-model=\"" + value + "\">: " + "You are binding v-model directly to a v-for iteration alias. " + "This will not be able to modify the v-for source array because " + "writing to the alias is like modifying a function local variable. " + "Consider using an array of objects and use v-model on an object property instead.");
      }
      _el = _el.parent;
    }
  }

  /*  */

  var isStaticKey;
  var isPlatformReservedTag;

  var genStaticKeysCached = cached(genStaticKeys$1);

  /**
   * Goal of the optimizer: walk the generated template AST tree
   * and detect sub-trees that are purely static, i.e. parts of
   * the DOM that never needs to change.
   *
   * Once we detect these sub-trees, we can:
   *
   * 1. Hoist them into constants, so that we no longer need to
   *    create fresh nodes for them on each re-render;
   * 2. Completely skip them in the patching process.
   */
  function optimize(root, options) {
    if (!root) {
      return;
    }
    isStaticKey = genStaticKeysCached(options.staticKeys || '');
    isPlatformReservedTag = options.isReservedTag || no;
    // first pass: mark all non-static nodes.
    markStatic$1(root);
    // second pass: mark static roots.
    markStaticRoots(root, false);
  }

  function genStaticKeys$1(keys) {
    return makeMap('type,tag,attrsList,attrsMap,plain,parent,children,attrs' + (keys ? ',' + keys : ''));
  }

  function markStatic$1(node) {
    node.static = isStatic(node);
    if (node.type === 1) {
      // do not make component slot content static. this avoids
      // 1. components not able to mutate slot nodes
      // 2. static slot content fails for hot-reloading
      if (!isPlatformReservedTag(node.tag) && node.tag !== 'slot' && node.attrsMap['inline-template'] == null) {
        return;
      }
      for (var i = 0, l = node.children.length; i < l; i++) {
        var child = node.children[i];
        markStatic$1(child);
        if (!child.static) {
          node.static = false;
        }
      }
    }
  }

  function markStaticRoots(node, isInFor) {
    if (node.type === 1) {
      if (node.static || node.once) {
        node.staticInFor = isInFor;
      }
      // For a node to qualify as a static root, it should have children that
      // are not just static text. Otherwise the cost of hoisting out will
      // outweigh the benefits and it's better off to just always render it fresh.
      if (node.static && node.children.length && !(node.children.length === 1 && node.children[0].type === 3)) {
        node.staticRoot = true;
        return;
      } else {
        node.staticRoot = false;
      }
      if (node.children) {
        for (var i = 0, l = node.children.length; i < l; i++) {
          markStaticRoots(node.children[i], isInFor || !!node.for);
        }
      }
      if (node.ifConditions) {
        walkThroughConditionsBlocks(node.ifConditions, isInFor);
      }
    }
  }

  function walkThroughConditionsBlocks(conditionBlocks, isInFor) {
    for (var i = 1, len = conditionBlocks.length; i < len; i++) {
      markStaticRoots(conditionBlocks[i].block, isInFor);
    }
  }

  function isStatic(node) {
    if (node.type === 2) {
      // expression
      return false;
    }
    if (node.type === 3) {
      // text
      return true;
    }
    return !!(node.pre || !node.hasBindings && // no dynamic bindings
    !node.if && !node.for && // not v-if or v-for or v-else
    !isBuiltInTag(node.tag) && // not a built-in
    isPlatformReservedTag(node.tag) && // not a component
    !isDirectChildOfTemplateFor(node) && Object.keys(node).every(isStaticKey));
  }

  function isDirectChildOfTemplateFor(node) {
    while (node.parent) {
      node = node.parent;
      if (node.tag !== 'template') {
        return false;
      }
      if (node.for) {
        return true;
      }
    }
    return false;
  }

  /*  */

  var fnExpRE = /^\s*([\w$_]+|\([^)]*?\))\s*=>|^function\s*\(/;
  var simplePathRE = /^\s*[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?']|\[".*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*\s*$/;

  // keyCode aliases
  var keyCodes = {
    esc: 27,
    tab: 9,
    enter: 13,
    space: 32,
    up: 38,
    left: 37,
    right: 39,
    down: 40,
    'delete': [8, 46]
  };

  // #4868: modifiers that prevent the execution of the listener
  // need to explicitly return null so that we can determine whether to remove
  // the listener for .once
  var genGuard = function genGuard(condition) {
    return "if(" + condition + ")return null;";
  };

  var modifierCode = {
    stop: '$event.stopPropagation();',
    prevent: '$event.preventDefault();',
    self: genGuard("$event.target !== $event.currentTarget"),
    ctrl: genGuard("!$event.ctrlKey"),
    shift: genGuard("!$event.shiftKey"),
    alt: genGuard("!$event.altKey"),
    meta: genGuard("!$event.metaKey"),
    left: genGuard("'button' in $event && $event.button !== 0"),
    middle: genGuard("'button' in $event && $event.button !== 1"),
    right: genGuard("'button' in $event && $event.button !== 2")
  };

  function genHandlers(events, native) {
    var res = native ? 'nativeOn:{' : 'on:{';
    for (var name in events) {
      res += "\"" + name + "\":" + genHandler(name, events[name]) + ",";
    }
    return res.slice(0, -1) + '}';
  }

  function genHandler(name, handler) {
    if (!handler) {
      return 'function(){}';
    }

    if (Array.isArray(handler)) {
      return "[" + handler.map(function (handler) {
        return genHandler(name, handler);
      }).join(',') + "]";
    }

    var isMethodPath = simplePathRE.test(handler.value);
    var isFunctionExpression = fnExpRE.test(handler.value);

    if (!handler.modifiers) {
      return isMethodPath || isFunctionExpression ? handler.value : "function($event){" + handler.value + "}"; // inline statement
    } else {
      var code = '';
      var keys = [];
      for (var key in handler.modifiers) {
        if (modifierCode[key]) {
          code += modifierCode[key];
          // left/right
          if (keyCodes[key]) {
            keys.push(key);
          }
        } else {
          keys.push(key);
        }
      }
      if (keys.length) {
        code += genKeyFilter(keys);
      }
      var handlerCode = isMethodPath ? handler.value + '($event)' : isFunctionExpression ? "(" + handler.value + ")($event)" : handler.value;
      return "function($event){" + code + handlerCode + "}";
    }
  }

  function genKeyFilter(keys) {
    return "if(!('button' in $event)&&" + keys.map(genFilterCode).join('&&') + ")return null;";
  }

  function genFilterCode(key) {
    var keyVal = parseInt(key, 10);
    if (keyVal) {
      return "$event.keyCode!==" + keyVal;
    }
    var alias = keyCodes[key];
    return "_k($event.keyCode," + JSON.stringify(key) + (alias ? ',' + JSON.stringify(alias) : '') + ")";
  }

  /*  */

  function bind$1(el, dir) {
    el.wrapData = function (code) {
      return "_b(" + code + ",'" + el.tag + "'," + dir.value + (dir.modifiers && dir.modifiers.prop ? ',true' : '') + ")";
    };
  }

  /*  */

  var baseDirectives = {
    bind: bind$1,
    cloak: noop
  };

  /*  */

  // configurable state
  var warn$3;
  var transforms$1;
  var dataGenFns;
  var platformDirectives$1;
  var isPlatformReservedTag$1;
  var staticRenderFns;
  var onceCount;
  var currentOptions;

  function generate(ast, options) {
    // save previous staticRenderFns so generate calls can be nested
    var prevStaticRenderFns = staticRenderFns;
    var currentStaticRenderFns = staticRenderFns = [];
    var prevOnceCount = onceCount;
    onceCount = 0;
    currentOptions = options;
    warn$3 = options.warn || baseWarn;
    transforms$1 = pluckModuleFunction(options.modules, 'transformCode');
    dataGenFns = pluckModuleFunction(options.modules, 'genData');
    platformDirectives$1 = options.directives || {};
    isPlatformReservedTag$1 = options.isReservedTag || no;
    var code = ast ? genElement(ast) : '_c("div")';
    staticRenderFns = prevStaticRenderFns;
    onceCount = prevOnceCount;
    return {
      render: "with(this){return " + code + "}",
      staticRenderFns: currentStaticRenderFns
    };
  }

  function genElement(el) {
    if (el.staticRoot && !el.staticProcessed) {
      return genStatic(el);
    } else if (el.once && !el.onceProcessed) {
      return genOnce(el);
    } else if (el.for && !el.forProcessed) {
      return genFor(el);
    } else if (el.if && !el.ifProcessed) {
      return genIf(el);
    } else if (el.tag === 'template' && !el.slotTarget) {
      return genChildren(el) || 'void 0';
    } else if (el.tag === 'slot') {
      return genSlot(el);
    } else {
      // component or element
      var code;
      if (el.component) {
        code = genComponent(el.component, el);
      } else {
        var data = el.plain ? undefined : genData(el);

        var children = el.inlineTemplate ? null : genChildren(el, true);
        code = "_c('" + el.tag + "'" + (data ? "," + data : '') + (children ? "," + children : '') + ")";
      }
      // module transforms
      for (var i = 0; i < transforms$1.length; i++) {
        code = transforms$1[i](el, code);
      }
      return code;
    }
  }

  // hoist static sub-trees out
  function genStatic(el) {
    el.staticProcessed = true;
    staticRenderFns.push("with(this){return " + genElement(el) + "}");
    return "_m(" + (staticRenderFns.length - 1) + (el.staticInFor ? ',true' : '') + ")";
  }

  // v-once
  function genOnce(el) {
    el.onceProcessed = true;
    if (el.if && !el.ifProcessed) {
      return genIf(el);
    } else if (el.staticInFor) {
      var key = '';
      var parent = el.parent;
      while (parent) {
        if (parent.for) {
          key = parent.key;
          break;
        }
        parent = parent.parent;
      }
      if (!key) {
        "development" !== 'production' && warn$3("v-once can only be used inside v-for that is keyed. ");
        return genElement(el);
      }
      return "_o(" + genElement(el) + "," + onceCount++ + (key ? "," + key : "") + ")";
    } else {
      return genStatic(el);
    }
  }

  function genIf(el) {
    el.ifProcessed = true; // avoid recursion
    return genIfConditions(el.ifConditions.slice());
  }

  function genIfConditions(conditions) {
    if (!conditions.length) {
      return '_e()';
    }

    var condition = conditions.shift();
    if (condition.exp) {
      return "(" + condition.exp + ")?" + genTernaryExp(condition.block) + ":" + genIfConditions(conditions);
    } else {
      return "" + genTernaryExp(condition.block);
    }

    // v-if with v-once should generate code like (a)?_m(0):_m(1)
    function genTernaryExp(el) {
      return el.once ? genOnce(el) : genElement(el);
    }
  }

  function genFor(el) {
    var exp = el.for;
    var alias = el.alias;
    var iterator1 = el.iterator1 ? "," + el.iterator1 : '';
    var iterator2 = el.iterator2 ? "," + el.iterator2 : '';

    if ("development" !== 'production' && maybeComponent(el) && el.tag !== 'slot' && el.tag !== 'template' && !el.key) {
      warn$3("<" + el.tag + " v-for=\"" + alias + " in " + exp + "\">: component lists rendered with " + "v-for should have explicit keys. " + "See https://vuejs.org/guide/list.html#key for more info.", true /* tip */
      );
    }

    el.forProcessed = true; // avoid recursion
    return "_l((" + exp + ")," + "function(" + alias + iterator1 + iterator2 + "){" + "return " + genElement(el) + '})';
  }

  function genData(el) {
    var data = '{';

    // directives first.
    // directives may mutate the el's other properties before they are generated.
    var dirs = genDirectives(el);
    if (dirs) {
      data += dirs + ',';
    }

    // key
    if (el.key) {
      data += "key:" + el.key + ",";
    }
    // ref
    if (el.ref) {
      data += "ref:" + el.ref + ",";
    }
    if (el.refInFor) {
      data += "refInFor:true,";
    }
    // pre
    if (el.pre) {
      data += "pre:true,";
    }
    // record original tag name for components using "is" attribute
    if (el.component) {
      data += "tag:\"" + el.tag + "\",";
    }
    // module data generation functions
    for (var i = 0; i < dataGenFns.length; i++) {
      data += dataGenFns[i](el);
    }
    // attributes
    if (el.attrs) {
      data += "attrs:{" + genProps(el.attrs) + "},";
    }
    // DOM props
    if (el.props) {
      data += "domProps:{" + genProps(el.props) + "},";
    }
    // event handlers
    if (el.events) {
      data += genHandlers(el.events) + ",";
    }
    if (el.nativeEvents) {
      data += genHandlers(el.nativeEvents, true) + ",";
    }
    // slot target
    if (el.slotTarget) {
      data += "slot:" + el.slotTarget + ",";
    }
    // scoped slots
    if (el.scopedSlots) {
      data += genScopedSlots(el.scopedSlots) + ",";
    }
    // component v-model
    if (el.model) {
      data += "model:{value:" + el.model.value + ",callback:" + el.model.callback + ",expression:" + el.model.expression + "},";
    }
    // inline-template
    if (el.inlineTemplate) {
      var inlineTemplate = genInlineTemplate(el);
      if (inlineTemplate) {
        data += inlineTemplate + ",";
      }
    }
    data = data.replace(/,$/, '') + '}';
    // v-bind data wrap
    if (el.wrapData) {
      data = el.wrapData(data);
    }
    return data;
  }

  function genDirectives(el) {
    var dirs = el.directives;
    if (!dirs) {
      return;
    }
    var res = 'directives:[';
    var hasRuntime = false;
    var i, l, dir, needRuntime;
    for (i = 0, l = dirs.length; i < l; i++) {
      dir = dirs[i];
      needRuntime = true;
      var gen = platformDirectives$1[dir.name] || baseDirectives[dir.name];
      if (gen) {
        // compile-time directive that manipulates AST.
        // returns true if it also needs a runtime counterpart.
        needRuntime = !!gen(el, dir, warn$3);
      }
      if (needRuntime) {
        hasRuntime = true;
        res += "{name:\"" + dir.name + "\",rawName:\"" + dir.rawName + "\"" + (dir.value ? ",value:(" + dir.value + "),expression:" + JSON.stringify(dir.value) : '') + (dir.arg ? ",arg:\"" + dir.arg + "\"" : '') + (dir.modifiers ? ",modifiers:" + JSON.stringify(dir.modifiers) : '') + "},";
      }
    }
    if (hasRuntime) {
      return res.slice(0, -1) + ']';
    }
  }

  function genInlineTemplate(el) {
    var ast = el.children[0];
    if ("development" !== 'production' && (el.children.length > 1 || ast.type !== 1)) {
      warn$3('Inline-template components must have exactly one child element.');
    }
    if (ast.type === 1) {
      var inlineRenderFns = generate(ast, currentOptions);
      return "inlineTemplate:{render:function(){" + inlineRenderFns.render + "},staticRenderFns:[" + inlineRenderFns.staticRenderFns.map(function (code) {
        return "function(){" + code + "}";
      }).join(',') + "]}";
    }
  }

  function genScopedSlots(slots) {
    return "scopedSlots:_u([" + Object.keys(slots).map(function (key) {
      return genScopedSlot(key, slots[key]);
    }).join(',') + "])";
  }

  function genScopedSlot(key, el) {
    return "[" + key + ",function(" + String(el.attrsMap.scope) + "){" + "return " + (el.tag === 'template' ? genChildren(el) || 'void 0' : genElement(el)) + "}]";
  }

  function genChildren(el, checkSkip) {
    var children = el.children;
    if (children.length) {
      var el$1 = children[0];
      // optimize single v-for
      if (children.length === 1 && el$1.for && el$1.tag !== 'template' && el$1.tag !== 'slot') {
        return genElement(el$1);
      }
      var normalizationType = checkSkip ? getNormalizationType(children) : 0;
      return "[" + children.map(genNode).join(',') + "]" + (normalizationType ? "," + normalizationType : '');
    }
  }

  // determine the normalization needed for the children array.
  // 0: no normalization needed
  // 1: simple normalization needed (possible 1-level deep nested array)
  // 2: full normalization needed
  function getNormalizationType(children) {
    var res = 0;
    for (var i = 0; i < children.length; i++) {
      var el = children[i];
      if (el.type !== 1) {
        continue;
      }
      if (needsNormalization(el) || el.ifConditions && el.ifConditions.some(function (c) {
        return needsNormalization(c.block);
      })) {
        res = 2;
        break;
      }
      if (maybeComponent(el) || el.ifConditions && el.ifConditions.some(function (c) {
        return maybeComponent(c.block);
      })) {
        res = 1;
      }
    }
    return res;
  }

  function needsNormalization(el) {
    return el.for !== undefined || el.tag === 'template' || el.tag === 'slot';
  }

  function maybeComponent(el) {
    return !isPlatformReservedTag$1(el.tag);
  }

  function genNode(node) {
    if (node.type === 1) {
      return genElement(node);
    } else {
      return genText(node);
    }
  }

  function genText(text) {
    return "_v(" + (text.type === 2 ? text.expression // no need for () because already wrapped in _s()
    : transformSpecialNewlines(JSON.stringify(text.text))) + ")";
  }

  function genSlot(el) {
    var slotName = el.slotName || '"default"';
    var children = genChildren(el);
    var res = "_t(" + slotName + (children ? "," + children : '');
    var attrs = el.attrs && "{" + el.attrs.map(function (a) {
      return camelize(a.name) + ":" + a.value;
    }).join(',') + "}";
    var bind$$1 = el.attrsMap['v-bind'];
    if ((attrs || bind$$1) && !children) {
      res += ",null";
    }
    if (attrs) {
      res += "," + attrs;
    }
    if (bind$$1) {
      res += (attrs ? '' : ',null') + "," + bind$$1;
    }
    return res + ')';
  }

  // componentName is el.component, take it as argument to shun flow's pessimistic refinement
  function genComponent(componentName, el) {
    var children = el.inlineTemplate ? null : genChildren(el, true);
    return "_c(" + componentName + "," + genData(el) + (children ? "," + children : '') + ")";
  }

  function genProps(props) {
    var res = '';
    for (var i = 0; i < props.length; i++) {
      var prop = props[i];
      res += "\"" + prop.name + "\":" + transformSpecialNewlines(prop.value) + ",";
    }
    return res.slice(0, -1);
  }

  // #3895, #4268
  function transformSpecialNewlines(text) {
    return text.replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
  }

  /*  */

  // these keywords should not appear inside expressions, but operators like
  // typeof, instanceof and in are allowed
  var prohibitedKeywordRE = new RegExp('\\b' + ('do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,' + 'super,throw,while,yield,delete,export,import,return,switch,default,' + 'extends,finally,continue,debugger,function,arguments').split(',').join('\\b|\\b') + '\\b');

  // these unary operators should not be used as property/method names
  var unaryOperatorsRE = new RegExp('\\b' + 'delete,typeof,void'.split(',').join('\\s*\\([^\\)]*\\)|\\b') + '\\s*\\([^\\)]*\\)');

  // check valid identifier for v-for
  var identRE = /[A-Za-z_$][\w$]*/;

  // strip strings in expressions
  var stripStringRE = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`/g;

  // detect problematic expressions in a template
  function detectErrors(ast) {
    var errors = [];
    if (ast) {
      checkNode(ast, errors);
    }
    return errors;
  }

  function checkNode(node, errors) {
    if (node.type === 1) {
      for (var name in node.attrsMap) {
        if (dirRE.test(name)) {
          var value = node.attrsMap[name];
          if (value) {
            if (name === 'v-for') {
              checkFor(node, "v-for=\"" + value + "\"", errors);
            } else if (onRE.test(name)) {
              checkEvent(value, name + "=\"" + value + "\"", errors);
            } else {
              checkExpression(value, name + "=\"" + value + "\"", errors);
            }
          }
        }
      }
      if (node.children) {
        for (var i = 0; i < node.children.length; i++) {
          checkNode(node.children[i], errors);
        }
      }
    } else if (node.type === 2) {
      checkExpression(node.expression, node.text, errors);
    }
  }

  function checkEvent(exp, text, errors) {
    var keywordMatch = exp.replace(stripStringRE, '').match(unaryOperatorsRE);
    if (keywordMatch) {
      errors.push("avoid using JavaScript unary operator as property name: " + "\"" + keywordMatch[0] + "\" in expression " + text.trim());
    }
    checkExpression(exp, text, errors);
  }

  function checkFor(node, text, errors) {
    checkExpression(node.for || '', text, errors);
    checkIdentifier(node.alias, 'v-for alias', text, errors);
    checkIdentifier(node.iterator1, 'v-for iterator', text, errors);
    checkIdentifier(node.iterator2, 'v-for iterator', text, errors);
  }

  function checkIdentifier(ident, type, text, errors) {
    if (typeof ident === 'string' && !identRE.test(ident)) {
      errors.push("invalid " + type + " \"" + ident + "\" in expression: " + text.trim());
    }
  }

  function checkExpression(exp, text, errors) {
    try {
      new Function("return " + exp);
    } catch (e) {
      var keywordMatch = exp.replace(stripStringRE, '').match(prohibitedKeywordRE);
      if (keywordMatch) {
        errors.push("avoid using JavaScript keyword as property name: " + "\"" + keywordMatch[0] + "\" in expression " + text.trim());
      } else {
        errors.push("invalid expression: " + text.trim());
      }
    }
  }

  /*  */

  function baseCompile(template, options) {
    var ast = parse(template.trim(), options);
    optimize(ast, options);
    var code = generate(ast, options);
    return {
      ast: ast,
      render: code.render,
      staticRenderFns: code.staticRenderFns
    };
  }

  function makeFunction(code, errors) {
    try {
      return new Function(code);
    } catch (err) {
      errors.push({ err: err, code: code });
      return noop;
    }
  }

  function createCompiler(baseOptions) {
    var functionCompileCache = Object.create(null);

    function compile(template, options) {
      var finalOptions = Object.create(baseOptions);
      var errors = [];
      var tips = [];
      finalOptions.warn = function (msg, tip$$1) {
        (tip$$1 ? tips : errors).push(msg);
      };

      if (options) {
        // merge custom modules
        if (options.modules) {
          finalOptions.modules = (baseOptions.modules || []).concat(options.modules);
        }
        // merge custom directives
        if (options.directives) {
          finalOptions.directives = extend(Object.create(baseOptions.directives), options.directives);
        }
        // copy other options
        for (var key in options) {
          if (key !== 'modules' && key !== 'directives') {
            finalOptions[key] = options[key];
          }
        }
      }

      var compiled = baseCompile(template, finalOptions);
      {
        errors.push.apply(errors, detectErrors(compiled.ast));
      }
      compiled.errors = errors;
      compiled.tips = tips;
      return compiled;
    }

    function compileToFunctions(template, options, vm) {
      options = options || {};

      /* istanbul ignore if */
      {
        // detect possible CSP restriction
        try {
          new Function('return 1');
        } catch (e) {
          if (e.toString().match(/unsafe-eval|CSP/)) {
            warn('It seems you are using the standalone build of Vue.js in an ' + 'environment with Content Security Policy that prohibits unsafe-eval. ' + 'The template compiler cannot work in this environment. Consider ' + 'relaxing the policy to allow unsafe-eval or pre-compiling your ' + 'templates into render functions.');
          }
        }
      }

      // check cache
      var key = options.delimiters ? String(options.delimiters) + template : template;
      if (functionCompileCache[key]) {
        return functionCompileCache[key];
      }

      // compile
      var compiled = compile(template, options);

      // check compilation errors/tips
      {
        if (compiled.errors && compiled.errors.length) {
          warn("Error compiling template:\n\n" + template + "\n\n" + compiled.errors.map(function (e) {
            return "- " + e;
          }).join('\n') + '\n', vm);
        }
        if (compiled.tips && compiled.tips.length) {
          compiled.tips.forEach(function (msg) {
            return tip(msg, vm);
          });
        }
      }

      // turn code into functions
      var res = {};
      var fnGenErrors = [];
      res.render = makeFunction(compiled.render, fnGenErrors);
      var l = compiled.staticRenderFns.length;
      res.staticRenderFns = new Array(l);
      for (var i = 0; i < l; i++) {
        res.staticRenderFns[i] = makeFunction(compiled.staticRenderFns[i], fnGenErrors);
      }

      // check function generation errors.
      // this should only happen if there is a bug in the compiler itself.
      // mostly for codegen development use
      /* istanbul ignore if */
      {
        if ((!compiled.errors || !compiled.errors.length) && fnGenErrors.length) {
          warn("Failed to generate render function:\n\n" + fnGenErrors.map(function (ref) {
            var err = ref.err;
            var code = ref.code;

            return err.toString() + " in\n\n" + code + "\n";
          }).join('\n'), vm);
        }
      }

      return functionCompileCache[key] = res;
    }

    return {
      compile: compile,
      compileToFunctions: compileToFunctions
    };
  }

  /*  */

  function transformNode(el, options) {
    var warn = options.warn || baseWarn;
    var staticClass = getAndRemoveAttr(el, 'class');
    if ("development" !== 'production' && staticClass) {
      var expression = parseText(staticClass, options.delimiters);
      if (expression) {
        warn("class=\"" + staticClass + "\": " + 'Interpolation inside attributes has been removed. ' + 'Use v-bind or the colon shorthand instead. For example, ' + 'instead of <div class="{{ val }}">, use <div :class="val">.');
      }
    }
    if (staticClass) {
      el.staticClass = JSON.stringify(staticClass);
    }
    var classBinding = getBindingAttr(el, 'class', false /* getStatic */);
    if (classBinding) {
      el.classBinding = classBinding;
    }
  }

  function genData$1(el) {
    var data = '';
    if (el.staticClass) {
      data += "staticClass:" + el.staticClass + ",";
    }
    if (el.classBinding) {
      data += "class:" + el.classBinding + ",";
    }
    return data;
  }

  var klass$1 = {
    staticKeys: ['staticClass'],
    transformNode: transformNode,
    genData: genData$1
  };

  /*  */

  function transformNode$1(el, options) {
    var warn = options.warn || baseWarn;
    var staticStyle = getAndRemoveAttr(el, 'style');
    if (staticStyle) {
      /* istanbul ignore if */
      {
        var expression = parseText(staticStyle, options.delimiters);
        if (expression) {
          warn("style=\"" + staticStyle + "\": " + 'Interpolation inside attributes has been removed. ' + 'Use v-bind or the colon shorthand instead. For example, ' + 'instead of <div style="{{ val }}">, use <div :style="val">.');
        }
      }
      el.staticStyle = JSON.stringify(parseStyleText(staticStyle));
    }

    var styleBinding = getBindingAttr(el, 'style', false /* getStatic */);
    if (styleBinding) {
      el.styleBinding = styleBinding;
    }
  }

  function genData$2(el) {
    var data = '';
    if (el.staticStyle) {
      data += "staticStyle:" + el.staticStyle + ",";
    }
    if (el.styleBinding) {
      data += "style:(" + el.styleBinding + "),";
    }
    return data;
  }

  var style$1 = {
    staticKeys: ['staticStyle'],
    transformNode: transformNode$1,
    genData: genData$2
  };

  var modules$1 = [klass$1, style$1];

  /*  */

  function text(el, dir) {
    if (dir.value) {
      addProp(el, 'textContent', "_s(" + dir.value + ")");
    }
  }

  /*  */

  function html(el, dir) {
    if (dir.value) {
      addProp(el, 'innerHTML', "_s(" + dir.value + ")");
    }
  }

  var directives$1 = {
    model: model,
    text: text,
    html: html
  };

  /*  */

  var baseOptions = {
    expectHTML: true,
    modules: modules$1,
    directives: directives$1,
    isPreTag: isPreTag,
    isUnaryTag: isUnaryTag,
    mustUseProp: mustUseProp,
    isReservedTag: isReservedTag,
    getTagNamespace: getTagNamespace,
    staticKeys: genStaticKeys(modules$1)
  };

  var ref$1 = createCompiler(baseOptions);
  var compileToFunctions = ref$1.compileToFunctions;

  /*  */

  var idToTemplate = cached(function (id) {
    var el = query(id);
    return el && el.innerHTML;
  });

  var mount = Vue$3.prototype.$mount;
  Vue$3.prototype.$mount = function (el, hydrating) {
    el = el && query(el);

    /* istanbul ignore if */
    if (el === document.body || el === document.documentElement) {
      "development" !== 'production' && warn("Do not mount Vue to <html> or <body> - mount to normal elements instead.");
      return this;
    }

    var options = this.$options;
    // resolve template/el and convert to render function
    if (!options.render) {
      var template = options.template;
      if (template) {
        if (typeof template === 'string') {
          if (template.charAt(0) === '#') {
            template = idToTemplate(template);
            /* istanbul ignore if */
            if ("development" !== 'production' && !template) {
              warn("Template element not found or is empty: " + options.template, this);
            }
          }
        } else if (template.nodeType) {
          template = template.innerHTML;
        } else {
          {
            warn('invalid template option:' + template, this);
          }
          return this;
        }
      } else if (el) {
        template = getOuterHTML(el);
      }
      if (template) {
        /* istanbul ignore if */
        if ("development" !== 'production' && config.performance && perf) {
          perf.mark('compile');
        }

        var ref = compileToFunctions(template, {
          shouldDecodeNewlines: shouldDecodeNewlines,
          delimiters: options.delimiters
        }, this);
        var render = ref.render;
        var staticRenderFns = ref.staticRenderFns;
        options.render = render;
        options.staticRenderFns = staticRenderFns;

        /* istanbul ignore if */
        if ("development" !== 'production' && config.performance && perf) {
          perf.mark('compile end');
          perf.measure(this._name + " compile", 'compile', 'compile end');
        }
      }
    }
    return mount.call(this, el, hydrating);
  };

  /**
   * Get outerHTML of elements, taking care
   * of SVG elements in IE as well.
   */
  function getOuterHTML(el) {
    if (el.outerHTML) {
      return el.outerHTML;
    } else {
      var container = document.createElement('div');
      container.appendChild(el.cloneNode(true));
      return container.innerHTML;
    }
  }

  Vue$3.compile = compileToFunctions;

  return Vue$3;
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _vue = __webpack_require__(0);

var _vue2 = _interopRequireDefault(_vue);

__webpack_require__(6);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// <seat v-for='col in row.columns'></seat>
_vue2.default.component('floor-plan', {
  template: '\n              <div class=\'floor-plan\'>\n                <div class=\'screen\' v-if=\'plan.screenPos === \'top\'\'></div>\n                <div class=\'row\' v-for=\'row in plan.rows\'>\n                  <span class=\'row-name\'>{{row.name}}</span>\n                </div>\n                <div class=\'screen\' v-if=\'plan.screenPos === \'bottom\'\'></div>\n              </div>\n            ',
  props: {
    plan: {
      type: Object,
      required: true
    }
  }
});

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _vue = __webpack_require__(0);

var _vue2 = _interopRequireDefault(_vue);

var _tab = __webpack_require__(7);

var _tab2 = _interopRequireDefault(_tab);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_vue2.default.component('tab', {
	template: _tab2.default,
	data: function data() {
		return {
			houselist: [{
				name: 'House 1',
				url: '/1',
				isActive: true
			}, {
				name: 'House 2',
				url: '/2'
			}, {
				name: 'House 3',
				url: '/3'
			}]
		};
	}
});

/***/ }),
/* 3 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 4 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var g;

// This works in non-strict mode
g = function () {
	return this;
}();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = "<div class=hkcinema-tab> <ul class=\"nav nav-tabs\"> <li v-for=\"house in houselist\" v-bind:class=\"{ active: house.isActive }\"> <a v-bind:href=house.url>{{ house.name }}</a> </li> </ul> </div> ";

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _vue = __webpack_require__(0);

var _vue2 = _interopRequireDefault(_vue);

__webpack_require__(4);

__webpack_require__(3);

__webpack_require__(1);

__webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

new _vue2.default({
	el: '#app',
	data: {
		message: 'Hello world!',
		header: 'Cinema WTF HIabc',
		plan: {
			screenPos: 'top',
			rows: [{
				name: 'A',
				columns: [{
					seat: '1',
					score: 10
				}]
			}]
		},
		cinemaList: [{
			region: '港島',
			list: ['AMC 太古廣場', 'L Cinema', 'MCL JP', 'MCL 康怡戲院', 'MCL 海怡戲院', 'MCL 皇室戲院', 'UA Cine Times', 'UA 銀河影院 Director\'s Club', '新寶 總統戲院', '百老匯 PALACE ifc', '百老匯 數碼港']
		}, {
			region: '九龍',
			list: ['Cinema City 朗豪坊', 'FESTIVAL GRAND CINEMA ', 'MCL 德福戲院', 'The Grand Cinema', 'UA Cine Moko', 'UA Cine Moko IMAX', 'UA iSQUARE', 'UA iSQUARE IMAX', 'UA iSQUARE 鳳凰影院', 'UA MegaBox', 'UA MegaBox BEA IMAX', '嘉禾 the sky', '嘉禾 海運戲院', '嘉禾 黃埔', '寶石戲院', '影藝戲院', '新寶 新寶戲院', '新寶 豪華戲院', '星影匯', '百老匯 PALACE apm', '百老匯 The ONE', '百老匯 旺角', '百老匯 荷里活', '百老匯電影中心']

		}, {
			region: '新界',
			list: ['MCL新都城戲院', 'MCL粉嶺戲院', 'STAR Cinema', 'UA 屯門市廣場', 'UA 機場IMAX', '元朗戲院', '嘉禾 粉嶺', '嘉禾 荃新天地', '嘉禾 青衣', '巴黎倫敦紐約米蘭', '新寶 凱都', '百老匯 嘉湖銀座', '百老匯 荃灣', '百老匯 葵芳', '馬鞍山戲院']
		}]
	}
});

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZDU2NjYyZTZmNzMwNTE0NDJkZjUiLCJ3ZWJwYWNrOi8vLy4uL34vdnVlL2Rpc3QvdnVlLmpzIiwid2VicGFjazovLy8uL2NvbXBvbmVudHMvZmxvb3ItcGxhbi9mbG9vci1wbGFuLmpzIiwid2VicGFjazovLy8uL2NvbXBvbmVudHMvdGFiL3RhYi5qcyIsIndlYnBhY2s6Ly8vLi9jb21tb24vY2luZW1hbGlzdC5jc3MiLCJ3ZWJwYWNrOi8vLy4vY29tbW9uL2NsZWFyLmNzcyIsIndlYnBhY2s6Ly8vLi4vfi93ZWJwYWNrL2J1aWxkaW4vZ2xvYmFsLmpzIiwid2VicGFjazovLy8uL2NvbXBvbmVudHMvZmxvb3ItcGxhbi9mbG9vci1wbGFuLmNzcyIsIndlYnBhY2s6Ly8vLi9jb21wb25lbnRzL3RhYi90YWIuaHRtbCIsIndlYnBhY2s6Ly8vLi9pbmRleC5qcyJdLCJuYW1lcyI6WyJnbG9iYWwiLCJmYWN0b3J5IiwiZXhwb3J0cyIsIm1vZHVsZSIsIlZ1ZSIsIl90b1N0cmluZyIsInZhbCIsIkpTT04iLCJzdHJpbmdpZnkiLCJTdHJpbmciLCJ0b051bWJlciIsIm4iLCJwYXJzZUZsb2F0IiwiaXNOYU4iLCJtYWtlTWFwIiwic3RyIiwiZXhwZWN0c0xvd2VyQ2FzZSIsIm1hcCIsIk9iamVjdCIsImNyZWF0ZSIsImxpc3QiLCJzcGxpdCIsImkiLCJsZW5ndGgiLCJ0b0xvd2VyQ2FzZSIsImlzQnVpbHRJblRhZyIsInJlbW92ZSIsImFyciIsIml0ZW0iLCJpbmRleCIsImluZGV4T2YiLCJzcGxpY2UiLCJoYXNPd25Qcm9wZXJ0eSIsInByb3RvdHlwZSIsImhhc093biIsIm9iaiIsImtleSIsImNhbGwiLCJpc1ByaW1pdGl2ZSIsInZhbHVlIiwiY2FjaGVkIiwiZm4iLCJjYWNoZSIsImNhY2hlZEZuIiwiaGl0IiwiY2FtZWxpemVSRSIsImNhbWVsaXplIiwicmVwbGFjZSIsIl8iLCJjIiwidG9VcHBlckNhc2UiLCJjYXBpdGFsaXplIiwiY2hhckF0Iiwic2xpY2UiLCJoeXBoZW5hdGVSRSIsImh5cGhlbmF0ZSIsImJpbmQiLCJjdHgiLCJib3VuZEZuIiwiYSIsImwiLCJhcmd1bWVudHMiLCJhcHBseSIsIl9sZW5ndGgiLCJ0b0FycmF5Iiwic3RhcnQiLCJyZXQiLCJBcnJheSIsImV4dGVuZCIsInRvIiwiX2Zyb20iLCJpc09iamVjdCIsInRvU3RyaW5nIiwiT0JKRUNUX1NUUklORyIsImlzUGxhaW5PYmplY3QiLCJ0b09iamVjdCIsInJlcyIsIm5vb3AiLCJubyIsImlkZW50aXR5IiwiZ2VuU3RhdGljS2V5cyIsIm1vZHVsZXMiLCJyZWR1Y2UiLCJrZXlzIiwibSIsImNvbmNhdCIsInN0YXRpY0tleXMiLCJqb2luIiwibG9vc2VFcXVhbCIsImIiLCJpc09iamVjdEEiLCJpc09iamVjdEIiLCJlIiwibG9vc2VJbmRleE9mIiwib25jZSIsImNhbGxlZCIsImNvbmZpZyIsIm9wdGlvbk1lcmdlU3RyYXRlZ2llcyIsInNpbGVudCIsInByb2R1Y3Rpb25UaXAiLCJkZXZ0b29scyIsInBlcmZvcm1hbmNlIiwiZXJyb3JIYW5kbGVyIiwiaWdub3JlZEVsZW1lbnRzIiwia2V5Q29kZXMiLCJpc1Jlc2VydmVkVGFnIiwiaXNVbmtub3duRWxlbWVudCIsImdldFRhZ05hbWVzcGFjZSIsInBhcnNlUGxhdGZvcm1UYWdOYW1lIiwibXVzdFVzZVByb3AiLCJfYXNzZXRUeXBlcyIsIl9saWZlY3ljbGVIb29rcyIsIl9tYXhVcGRhdGVDb3VudCIsImhhc1Byb3RvIiwiaW5Ccm93c2VyIiwid2luZG93IiwiVUEiLCJuYXZpZ2F0b3IiLCJ1c2VyQWdlbnQiLCJpc0lFIiwidGVzdCIsImlzSUU5IiwiaXNFZGdlIiwiaXNBbmRyb2lkIiwiaXNJT1MiLCJpc0Nocm9tZSIsIl9pc1NlcnZlciIsImlzU2VydmVyUmVuZGVyaW5nIiwidW5kZWZpbmVkIiwiZW52IiwiVlVFX0VOViIsIl9fVlVFX0RFVlRPT0xTX0dMT0JBTF9IT09LX18iLCJpc05hdGl2ZSIsIkN0b3IiLCJoYXNTeW1ib2wiLCJTeW1ib2wiLCJSZWZsZWN0Iiwib3duS2V5cyIsIm5leHRUaWNrIiwiY2FsbGJhY2tzIiwicGVuZGluZyIsInRpbWVyRnVuYyIsIm5leHRUaWNrSGFuZGxlciIsImNvcGllcyIsIlByb21pc2UiLCJwIiwicmVzb2x2ZSIsImxvZ0Vycm9yIiwiZXJyIiwiY29uc29sZSIsImVycm9yIiwidGhlbiIsImNhdGNoIiwic2V0VGltZW91dCIsIk11dGF0aW9uT2JzZXJ2ZXIiLCJjb3VudGVyIiwib2JzZXJ2ZXIiLCJ0ZXh0Tm9kZSIsImRvY3VtZW50IiwiY3JlYXRlVGV4dE5vZGUiLCJvYnNlcnZlIiwiY2hhcmFjdGVyRGF0YSIsImRhdGEiLCJxdWV1ZU5leHRUaWNrIiwiY2IiLCJfcmVzb2x2ZSIsInB1c2giLCJfU2V0IiwiU2V0Iiwic2V0IiwiaGFzIiwiYWRkIiwiY2xlYXIiLCJwZXJmIiwibWFyayIsIm1lYXN1cmUiLCJlbXB0eU9iamVjdCIsImZyZWV6ZSIsImlzUmVzZXJ2ZWQiLCJjaGFyQ29kZUF0IiwiZGVmIiwiZW51bWVyYWJsZSIsImRlZmluZVByb3BlcnR5Iiwid3JpdGFibGUiLCJjb25maWd1cmFibGUiLCJiYWlsUkUiLCJwYXJzZVBhdGgiLCJwYXRoIiwic2VnbWVudHMiLCJ3YXJuIiwidGlwIiwiZm9ybWF0Q29tcG9uZW50TmFtZSIsImhhc0NvbnNvbGUiLCJjbGFzc2lmeVJFIiwiY2xhc3NpZnkiLCJtc2ciLCJ2bSIsImZvcm1hdExvY2F0aW9uIiwiaW5jbHVkZUZpbGUiLCIkcm9vdCIsIm5hbWUiLCJfaXNWdWUiLCIkb3B0aW9ucyIsIl9jb21wb25lbnRUYWciLCJmaWxlIiwiX19maWxlIiwibWF0Y2giLCJ1aWQkMSIsIkRlcCIsImlkIiwic3VicyIsImFkZFN1YiIsInN1YiIsInJlbW92ZVN1YiIsImRlcGVuZCIsInRhcmdldCIsImFkZERlcCIsIm5vdGlmeSIsInVwZGF0ZSIsInRhcmdldFN0YWNrIiwicHVzaFRhcmdldCIsIl90YXJnZXQiLCJwb3BUYXJnZXQiLCJwb3AiLCJhcnJheVByb3RvIiwiYXJyYXlNZXRob2RzIiwiZm9yRWFjaCIsIm1ldGhvZCIsIm9yaWdpbmFsIiwibXV0YXRvciIsImFyZ3VtZW50cyQxIiwiYXJncyIsInJlc3VsdCIsIm9iIiwiX19vYl9fIiwiaW5zZXJ0ZWQiLCJvYnNlcnZlQXJyYXkiLCJkZXAiLCJhcnJheUtleXMiLCJnZXRPd25Qcm9wZXJ0eU5hbWVzIiwib2JzZXJ2ZXJTdGF0ZSIsInNob3VsZENvbnZlcnQiLCJpc1NldHRpbmdQcm9wcyIsIk9ic2VydmVyIiwidm1Db3VudCIsImlzQXJyYXkiLCJhdWdtZW50IiwicHJvdG9BdWdtZW50IiwiY29weUF1Z21lbnQiLCJ3YWxrIiwiZGVmaW5lUmVhY3RpdmUkJDEiLCJpdGVtcyIsInNyYyIsIl9fcHJvdG9fXyIsImFzUm9vdERhdGEiLCJpc0V4dGVuc2libGUiLCJjdXN0b21TZXR0ZXIiLCJwcm9wZXJ0eSIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsImdldHRlciIsImdldCIsInNldHRlciIsImNoaWxkT2IiLCJyZWFjdGl2ZUdldHRlciIsImRlcGVuZEFycmF5IiwicmVhY3RpdmVTZXR0ZXIiLCJuZXdWYWwiLCJNYXRoIiwibWF4IiwiZGVsIiwic3RyYXRzIiwiZWwiLCJwcm9wc0RhdGEiLCJwYXJlbnQiLCJjaGlsZCIsImRlZmF1bHRTdHJhdCIsIm1lcmdlRGF0YSIsImZyb20iLCJ0b1ZhbCIsImZyb21WYWwiLCJwYXJlbnRWYWwiLCJjaGlsZFZhbCIsIm1lcmdlZERhdGFGbiIsIm1lcmdlZEluc3RhbmNlRGF0YUZuIiwiaW5zdGFuY2VEYXRhIiwiZGVmYXVsdERhdGEiLCJtZXJnZUhvb2siLCJob29rIiwibWVyZ2VBc3NldHMiLCJ0eXBlIiwid2F0Y2giLCJwcm9wcyIsIm1ldGhvZHMiLCJjb21wdXRlZCIsImNoZWNrQ29tcG9uZW50cyIsIm9wdGlvbnMiLCJjb21wb25lbnRzIiwibG93ZXIiLCJub3JtYWxpemVQcm9wcyIsIm5vcm1hbGl6ZURpcmVjdGl2ZXMiLCJkaXJzIiwiZGlyZWN0aXZlcyIsIm1lcmdlT3B0aW9ucyIsImV4dGVuZHNGcm9tIiwiZXh0ZW5kcyIsIm1peGlucyIsIm1peGluIiwiVnVlJDMiLCJtZXJnZUZpZWxkIiwic3RyYXQiLCJyZXNvbHZlQXNzZXQiLCJ3YXJuTWlzc2luZyIsImFzc2V0cyIsImNhbWVsaXplZElkIiwiUGFzY2FsQ2FzZUlkIiwidmFsaWRhdGVQcm9wIiwicHJvcE9wdGlvbnMiLCJwcm9wIiwiYWJzZW50IiwiaXNUeXBlIiwiQm9vbGVhbiIsImdldFByb3BEZWZhdWx0VmFsdWUiLCJwcmV2U2hvdWxkQ29udmVydCIsImFzc2VydFByb3AiLCJkZWZhdWx0IiwiX3Byb3BzIiwiZ2V0VHlwZSIsInJlcXVpcmVkIiwidmFsaWQiLCJleHBlY3RlZFR5cGVzIiwiYXNzZXJ0ZWRUeXBlIiwiYXNzZXJ0VHlwZSIsImV4cGVjdGVkVHlwZSIsInZhbGlkYXRvciIsImxlbiIsImhhbmRsZUVycm9yIiwiaW5mbyIsImluaXRQcm94eSIsImFsbG93ZWRHbG9iYWxzIiwid2Fybk5vblByZXNlbnQiLCJoYXNQcm94eSIsIlByb3h5IiwiaXNCdWlsdEluTW9kaWZpZXIiLCJoYXNIYW5kbGVyIiwiaXNBbGxvd2VkIiwiZ2V0SGFuZGxlciIsImhhbmRsZXJzIiwicmVuZGVyIiwiX3dpdGhTdHJpcHBlZCIsIl9yZW5kZXJQcm94eSIsIlZOb2RlIiwidGFnIiwiY2hpbGRyZW4iLCJ0ZXh0IiwiZWxtIiwiY29udGV4dCIsImNvbXBvbmVudE9wdGlvbnMiLCJucyIsImZ1bmN0aW9uYWxDb250ZXh0IiwiY29tcG9uZW50SW5zdGFuY2UiLCJyYXciLCJpc1N0YXRpYyIsImlzUm9vdEluc2VydCIsImlzQ29tbWVudCIsImlzQ2xvbmVkIiwiaXNPbmNlIiwicHJvdG90eXBlQWNjZXNzb3JzIiwiZGVmaW5lUHJvcGVydGllcyIsImNyZWF0ZUVtcHR5Vk5vZGUiLCJub2RlIiwiY3JlYXRlVGV4dFZOb2RlIiwiY2xvbmVWTm9kZSIsInZub2RlIiwiY2xvbmVkIiwiY2xvbmVWTm9kZXMiLCJ2bm9kZXMiLCJub3JtYWxpemVFdmVudCIsIm9uY2UkJDEiLCJjYXB0dXJlIiwiY3JlYXRlRm5JbnZva2VyIiwiZm5zIiwiaW52b2tlciIsInVwZGF0ZUxpc3RlbmVycyIsIm9uIiwib2xkT24iLCJyZW1vdmUkJDEiLCJjdXIiLCJvbGQiLCJldmVudCIsIm1lcmdlVk5vZGVIb29rIiwiaG9va0tleSIsIm9sZEhvb2siLCJ3cmFwcGVkSG9vayIsIm1lcmdlZCIsInNpbXBsZU5vcm1hbGl6ZUNoaWxkcmVuIiwibm9ybWFsaXplQ2hpbGRyZW4iLCJub3JtYWxpemVBcnJheUNoaWxkcmVuIiwibmVzdGVkSW5kZXgiLCJsYXN0IiwiZ2V0Rmlyc3RDb21wb25lbnRDaGlsZCIsImZpbHRlciIsImluaXRFdmVudHMiLCJfZXZlbnRzIiwiX2hhc0hvb2tFdmVudCIsImxpc3RlbmVycyIsIl9wYXJlbnRMaXN0ZW5lcnMiLCJ1cGRhdGVDb21wb25lbnRMaXN0ZW5lcnMiLCIkb25jZSIsIiRvbiIsInJlbW92ZSQxIiwiJG9mZiIsIm9sZExpc3RlbmVycyIsImV2ZW50c01peGluIiwiaG9va1JFIiwidGhpcyQxIiwiaSQxIiwiY2JzIiwiJGVtaXQiLCJyZXNvbHZlU2xvdHMiLCJzbG90cyIsImRlZmF1bHRTbG90Iiwic2xvdCIsImV2ZXJ5IiwiaXNXaGl0ZXNwYWNlIiwicmVzb2x2ZVNjb3BlZFNsb3RzIiwiYWN0aXZlSW5zdGFuY2UiLCJpbml0TGlmZWN5Y2xlIiwiYWJzdHJhY3QiLCIkcGFyZW50IiwiJGNoaWxkcmVuIiwiJHJlZnMiLCJfd2F0Y2hlciIsIl9pbmFjdGl2ZSIsIl9kaXJlY3RJbmFjdGl2ZSIsIl9pc01vdW50ZWQiLCJfaXNEZXN0cm95ZWQiLCJfaXNCZWluZ0Rlc3Ryb3llZCIsImxpZmVjeWNsZU1peGluIiwiX3VwZGF0ZSIsImh5ZHJhdGluZyIsImNhbGxIb29rIiwicHJldkVsIiwiJGVsIiwicHJldlZub2RlIiwiX3Zub2RlIiwicHJldkFjdGl2ZUluc3RhbmNlIiwiX19wYXRjaF9fIiwiX3BhcmVudEVsbSIsIl9yZWZFbG0iLCJfX3Z1ZV9fIiwiJHZub2RlIiwiJGZvcmNlVXBkYXRlIiwiJGRlc3Ryb3kiLCJ0ZWFyZG93biIsIl93YXRjaGVycyIsIl9kYXRhIiwibW91bnRDb21wb25lbnQiLCJ0ZW1wbGF0ZSIsInVwZGF0ZUNvbXBvbmVudCIsIl9uYW1lIiwic3RhcnRUYWciLCJlbmRUYWciLCJfcmVuZGVyIiwiV2F0Y2hlciIsInVwZGF0ZUNoaWxkQ29tcG9uZW50IiwicGFyZW50Vm5vZGUiLCJyZW5kZXJDaGlsZHJlbiIsImhhc0NoaWxkcmVuIiwiX3JlbmRlckNoaWxkcmVuIiwic2NvcGVkU2xvdHMiLCIkc2NvcGVkU2xvdHMiLCJfcGFyZW50Vm5vZGUiLCJwcm9wS2V5cyIsIl9wcm9wS2V5cyIsIiRzbG90cyIsImlzSW5JbmFjdGl2ZVRyZWUiLCJhY3RpdmF0ZUNoaWxkQ29tcG9uZW50IiwiZGlyZWN0IiwiZGVhY3RpdmF0ZUNoaWxkQ29tcG9uZW50IiwiaiIsInF1ZXVlIiwiY2lyY3VsYXIiLCJ3YWl0aW5nIiwiZmx1c2hpbmciLCJyZXNldFNjaGVkdWxlclN0YXRlIiwiZmx1c2hTY2hlZHVsZXJRdWV1ZSIsIndhdGNoZXIiLCJzb3J0IiwicnVuIiwidXNlciIsImV4cHJlc3Npb24iLCJlbWl0IiwicXVldWVXYXRjaGVyIiwidWlkJDIiLCJleHBPckZuIiwiZGVlcCIsImxhenkiLCJzeW5jIiwiYWN0aXZlIiwiZGlydHkiLCJkZXBzIiwibmV3RGVwcyIsImRlcElkcyIsIm5ld0RlcElkcyIsInRyYXZlcnNlIiwiY2xlYW51cERlcHMiLCJ0bXAiLCJvbGRWYWx1ZSIsImV2YWx1YXRlIiwic2Vlbk9iamVjdHMiLCJfdHJhdmVyc2UiLCJzZWVuIiwiaXNBIiwiZGVwSWQiLCJzaGFyZWRQcm9wZXJ0eURlZmluaXRpb24iLCJwcm94eSIsInNvdXJjZUtleSIsInByb3h5R2V0dGVyIiwicHJveHlTZXR0ZXIiLCJpbml0U3RhdGUiLCJvcHRzIiwiaW5pdFByb3BzIiwiaW5pdE1ldGhvZHMiLCJpbml0RGF0YSIsImluaXRDb21wdXRlZCIsImluaXRXYXRjaCIsImlzUmVzZXJ2ZWRQcm9wIiwicmVmIiwicHJvcHNPcHRpb25zIiwiaXNSb290IiwibG9vcCIsImNvbXB1dGVkV2F0Y2hlck9wdGlvbnMiLCJ3YXRjaGVycyIsIl9jb21wdXRlZFdhdGNoZXJzIiwidXNlckRlZiIsImRlZmluZUNvbXB1dGVkIiwiY3JlYXRlQ29tcHV0ZWRHZXR0ZXIiLCJjb21wdXRlZEdldHRlciIsImhhbmRsZXIiLCJjcmVhdGVXYXRjaGVyIiwiJHdhdGNoIiwic3RhdGVNaXhpbiIsImRhdGFEZWYiLCJwcm9wc0RlZiIsIm5ld0RhdGEiLCIkc2V0IiwiJGRlbGV0ZSIsImltbWVkaWF0ZSIsInVud2F0Y2hGbiIsImhvb2tzIiwiaW5pdCIsInByZXBhdGNoIiwiaW5zZXJ0IiwiZGVzdHJveSIsImhvb2tzVG9NZXJnZSIsImNyZWF0ZUNvbXBvbmVudCIsImJhc2VDdG9yIiwiX2Jhc2UiLCJjaWQiLCJyZXNvbHZlZCIsInJlc29sdmVBc3luY0NvbXBvbmVudCIsInJlc29sdmVDb25zdHJ1Y3Rvck9wdGlvbnMiLCJtb2RlbCIsInRyYW5zZm9ybU1vZGVsIiwiZXh0cmFjdFByb3BzIiwiZnVuY3Rpb25hbCIsImNyZWF0ZUZ1bmN0aW9uYWxDb21wb25lbnQiLCJuYXRpdmVPbiIsIm1lcmdlSG9va3MiLCJfY29udGV4dCIsImgiLCJkIiwiY3JlYXRlRWxlbWVudCIsImNyZWF0ZUNvbXBvbmVudEluc3RhbmNlRm9yVm5vZGUiLCJwYXJlbnRFbG0iLCJyZWZFbG0iLCJ2bm9kZUNvbXBvbmVudE9wdGlvbnMiLCJfaXNDb21wb25lbnQiLCJpbmxpbmVUZW1wbGF0ZSIsInN0YXRpY1JlbmRlckZucyIsIiRtb3VudCIsImtlZXBBbGl2ZSIsIm1vdW50ZWROb2RlIiwib2xkVm5vZGUiLCJyZXF1ZXN0ZWQiLCJwZW5kaW5nQ2FsbGJhY2tzIiwicmVqZWN0IiwicmVhc29uIiwiYXR0cnMiLCJkb21Qcm9wcyIsImFsdEtleSIsImNoZWNrUHJvcCIsImhhc2giLCJwcmVzZXJ2ZSIsImZyb21QYXJlbnQiLCJvdXJzIiwibWVyZ2VIb29rJDEiLCJvbmUiLCJ0d28iLCJjYWxsYmFjayIsIlNJTVBMRV9OT1JNQUxJWkUiLCJBTFdBWVNfTk9STUFMSVpFIiwibm9ybWFsaXphdGlvblR5cGUiLCJhbHdheXNOb3JtYWxpemUiLCJfY3JlYXRlRWxlbWVudCIsImFwcGx5TlMiLCJyZW5kZXJMaXN0IiwicmVuZGVyU2xvdCIsImZhbGxiYWNrIiwiYmluZE9iamVjdCIsInNjb3BlZFNsb3RGbiIsInNsb3ROb2RlcyIsIl9yZW5kZXJlZCIsInJlc29sdmVGaWx0ZXIiLCJjaGVja0tleUNvZGVzIiwiZXZlbnRLZXlDb2RlIiwiYnVpbHRJbkFsaWFzIiwiYmluZE9iamVjdFByb3BzIiwiYXNQcm9wIiwicmVuZGVyU3RhdGljIiwiaXNJbkZvciIsInRyZWUiLCJfc3RhdGljVHJlZXMiLCJtYXJrU3RhdGljIiwibWFya09uY2UiLCJtYXJrU3RhdGljTm9kZSIsImluaXRSZW5kZXIiLCJyZW5kZXJDb250ZXh0IiwiX2MiLCIkY3JlYXRlRWxlbWVudCIsInJlbmRlck1peGluIiwiJG5leHRUaWNrIiwicmVuZGVyRXJyb3IiLCJfbyIsIl9uIiwiX3MiLCJfbCIsIl90IiwiX3EiLCJfaSIsIl9tIiwiX2YiLCJfayIsIl9iIiwiX3YiLCJfZSIsIl91IiwiaW5pdFByb3ZpZGUiLCJwcm92aWRlIiwiX3Byb3ZpZGVkIiwiaW5pdEluamVjdGlvbnMiLCJpbmplY3QiLCJwcm92aWRlS2V5Iiwic291cmNlIiwidWlkIiwiaW5pdE1peGluIiwiX2luaXQiLCJfdWlkIiwiaW5pdEludGVybmFsQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJfc2VsZiIsInN1cGVyIiwic3VwZXJPcHRpb25zIiwiY2FjaGVkU3VwZXJPcHRpb25zIiwibW9kaWZpZWRPcHRpb25zIiwicmVzb2x2ZU1vZGlmaWVkT3B0aW9ucyIsImV4dGVuZE9wdGlvbnMiLCJtb2RpZmllZCIsImxhdGVzdCIsInNlYWxlZCIsInNlYWxlZE9wdGlvbnMiLCJkZWR1cGUiLCJpbml0VXNlIiwidXNlIiwicGx1Z2luIiwiaW5zdGFsbGVkIiwidW5zaGlmdCIsImluc3RhbGwiLCJpbml0TWl4aW4kMSIsImluaXRFeHRlbmQiLCJTdXBlciIsIlN1cGVySWQiLCJjYWNoZWRDdG9ycyIsIl9DdG9yIiwiU3ViIiwiVnVlQ29tcG9uZW50IiwiaW5pdFByb3BzJDEiLCJpbml0Q29tcHV0ZWQkMSIsIkNvbXAiLCJpbml0QXNzZXRSZWdpc3RlcnMiLCJkZWZpbml0aW9uIiwicGF0dGVyblR5cGVzIiwiUmVnRXhwIiwiZ2V0Q29tcG9uZW50TmFtZSIsIm1hdGNoZXMiLCJwYXR0ZXJuIiwicHJ1bmVDYWNoZSIsImNhY2hlZE5vZGUiLCJwcnVuZUNhY2hlRW50cnkiLCJLZWVwQWxpdmUiLCJpbmNsdWRlIiwiZXhjbHVkZSIsImNyZWF0ZWQiLCJkZXN0cm95ZWQiLCJidWlsdEluQ29tcG9uZW50cyIsImluaXRHbG9iYWxBUEkiLCJjb25maWdEZWYiLCJ1dGlsIiwiZGVmaW5lUmVhY3RpdmUiLCJkZWxldGUiLCJ2ZXJzaW9uIiwiYWNjZXB0VmFsdWUiLCJhdHRyIiwiaXNFbnVtZXJhdGVkQXR0ciIsImlzQm9vbGVhbkF0dHIiLCJ4bGlua05TIiwiaXNYbGluayIsImdldFhsaW5rUHJvcCIsImlzRmFsc3lBdHRyVmFsdWUiLCJnZW5DbGFzc0ZvclZub2RlIiwicGFyZW50Tm9kZSIsImNoaWxkTm9kZSIsIm1lcmdlQ2xhc3NEYXRhIiwiZ2VuQ2xhc3NGcm9tRGF0YSIsInN0YXRpY0NsYXNzIiwiY2xhc3MiLCJkeW5hbWljQ2xhc3MiLCJzdHJpbmdpZnlDbGFzcyIsInN0cmluZ2lmaWVkIiwibmFtZXNwYWNlTWFwIiwic3ZnIiwibWF0aCIsImlzSFRNTFRhZyIsImlzU1ZHIiwiaXNQcmVUYWciLCJ1bmtub3duRWxlbWVudENhY2hlIiwiSFRNTFVua25vd25FbGVtZW50IiwiSFRNTEVsZW1lbnQiLCJxdWVyeSIsInNlbGVjdGVkIiwicXVlcnlTZWxlY3RvciIsImNyZWF0ZUVsZW1lbnQkMSIsInRhZ05hbWUiLCJtdWx0aXBsZSIsInNldEF0dHJpYnV0ZSIsImNyZWF0ZUVsZW1lbnROUyIsIm5hbWVzcGFjZSIsImNyZWF0ZUNvbW1lbnQiLCJpbnNlcnRCZWZvcmUiLCJuZXdOb2RlIiwicmVmZXJlbmNlTm9kZSIsInJlbW92ZUNoaWxkIiwiYXBwZW5kQ2hpbGQiLCJuZXh0U2libGluZyIsInNldFRleHRDb250ZW50IiwidGV4dENvbnRlbnQiLCJub2RlT3BzIiwicmVnaXN0ZXJSZWYiLCJpc1JlbW92YWwiLCJyZWZzIiwicmVmSW5Gb3IiLCJlbXB0eU5vZGUiLCJob29rcyQxIiwiaXNVbmRlZiIsInMiLCJpc0RlZiIsInNhbWVWbm9kZSIsInZub2RlMSIsInZub2RlMiIsImNyZWF0ZUtleVRvT2xkSWR4IiwiYmVnaW5JZHgiLCJlbmRJZHgiLCJjcmVhdGVQYXRjaEZ1bmN0aW9uIiwiYmFja2VuZCIsImVtcHR5Tm9kZUF0IiwiY3JlYXRlUm1DYiIsImNoaWxkRWxtIiwicmVtb3ZlTm9kZSIsImluUHJlIiwiY3JlYXRlRWxtIiwiaW5zZXJ0ZWRWbm9kZVF1ZXVlIiwibmVzdGVkIiwicHJlIiwic2V0U2NvcGUiLCJjcmVhdGVDaGlsZHJlbiIsImludm9rZUNyZWF0ZUhvb2tzIiwiaXNSZWFjdGl2YXRlZCIsImluaXRDb21wb25lbnQiLCJyZWFjdGl2YXRlQ29tcG9uZW50IiwicGVuZGluZ0luc2VydCIsImlzUGF0Y2hhYmxlIiwiaW5uZXJOb2RlIiwidHJhbnNpdGlvbiIsImFjdGl2YXRlIiwiYW5jZXN0b3IiLCJfc2NvcGVJZCIsImFkZFZub2RlcyIsInN0YXJ0SWR4IiwiaW52b2tlRGVzdHJveUhvb2siLCJyZW1vdmVWbm9kZXMiLCJjaCIsInJlbW92ZUFuZEludm9rZVJlbW92ZUhvb2siLCJybSIsInVwZGF0ZUNoaWxkcmVuIiwib2xkQ2giLCJuZXdDaCIsInJlbW92ZU9ubHkiLCJvbGRTdGFydElkeCIsIm5ld1N0YXJ0SWR4Iiwib2xkRW5kSWR4Iiwib2xkU3RhcnRWbm9kZSIsIm9sZEVuZFZub2RlIiwibmV3RW5kSWR4IiwibmV3U3RhcnRWbm9kZSIsIm5ld0VuZFZub2RlIiwib2xkS2V5VG9JZHgiLCJpZHhJbk9sZCIsImVsbVRvTW92ZSIsImNhbk1vdmUiLCJwYXRjaFZub2RlIiwiaGFzRGF0YSIsInBvc3RwYXRjaCIsImludm9rZUluc2VydEhvb2siLCJpbml0aWFsIiwiYmFpbGVkIiwiaXNSZW5kZXJlZE1vZHVsZSIsImh5ZHJhdGUiLCJhc3NlcnROb2RlTWF0Y2giLCJoYXNDaGlsZE5vZGVzIiwiY2hpbGRyZW5NYXRjaCIsImZpcnN0Q2hpbGQiLCJjaGlsZE5vZGVzIiwibm9kZVR5cGUiLCJwYXRjaCIsImlzSW5pdGlhbFBhdGNoIiwiaXNSZWFsRWxlbWVudCIsImhhc0F0dHJpYnV0ZSIsInJlbW92ZUF0dHJpYnV0ZSIsIm9sZEVsbSIsInBhcmVudEVsbSQxIiwiX2xlYXZlQ2IiLCJ1cGRhdGVEaXJlY3RpdmVzIiwidW5iaW5kRGlyZWN0aXZlcyIsImlzQ3JlYXRlIiwiaXNEZXN0cm95Iiwib2xkRGlycyIsIm5vcm1hbGl6ZURpcmVjdGl2ZXMkMSIsIm5ld0RpcnMiLCJkaXJzV2l0aEluc2VydCIsImRpcnNXaXRoUG9zdHBhdGNoIiwib2xkRGlyIiwiZGlyIiwiY2FsbEhvb2skMSIsImNvbXBvbmVudFVwZGF0ZWQiLCJjYWxsSW5zZXJ0IiwiZW1wdHlNb2RpZmllcnMiLCJtb2RpZmllcnMiLCJnZXRSYXdEaXJOYW1lIiwicmF3TmFtZSIsImJhc2VNb2R1bGVzIiwidXBkYXRlQXR0cnMiLCJvbGRBdHRycyIsInNldEF0dHIiLCJyZW1vdmVBdHRyaWJ1dGVOUyIsInNldEF0dHJpYnV0ZU5TIiwidXBkYXRlQ2xhc3MiLCJvbGREYXRhIiwiY2xzIiwidHJhbnNpdGlvbkNsYXNzIiwiX3RyYW5zaXRpb25DbGFzc2VzIiwiX3ByZXZDbGFzcyIsImtsYXNzIiwidmFsaWREaXZpc2lvbkNoYXJSRSIsInBhcnNlRmlsdGVycyIsImV4cCIsImluU2luZ2xlIiwiaW5Eb3VibGUiLCJpblRlbXBsYXRlU3RyaW5nIiwiaW5SZWdleCIsImN1cmx5Iiwic3F1YXJlIiwicGFyZW4iLCJsYXN0RmlsdGVySW5kZXgiLCJwcmV2IiwiZmlsdGVycyIsInRyaW0iLCJwdXNoRmlsdGVyIiwid3JhcEZpbHRlciIsImJhc2VXYXJuIiwicGx1Y2tNb2R1bGVGdW5jdGlvbiIsImFkZFByb3AiLCJhZGRBdHRyIiwiYWRkRGlyZWN0aXZlIiwiYXJnIiwiYWRkSGFuZGxlciIsImltcG9ydGFudCIsImV2ZW50cyIsIm5hdGl2ZSIsIm5hdGl2ZUV2ZW50cyIsIm5ld0hhbmRsZXIiLCJnZXRCaW5kaW5nQXR0ciIsImdldFN0YXRpYyIsImR5bmFtaWNWYWx1ZSIsImdldEFuZFJlbW92ZUF0dHIiLCJzdGF0aWNWYWx1ZSIsImF0dHJzTWFwIiwiYXR0cnNMaXN0IiwiZ2VuQ29tcG9uZW50TW9kZWwiLCJudW1iZXIiLCJiYXNlVmFsdWVFeHByZXNzaW9uIiwidmFsdWVFeHByZXNzaW9uIiwiYXNzaWdubWVudCIsImdlbkFzc2lnbm1lbnRDb2RlIiwibW9kZWxScyIsInBhcnNlTW9kZWwiLCJpZHgiLCJjaHIiLCJpbmRleCQxIiwiZXhwcmVzc2lvblBvcyIsImV4cHJlc3Npb25FbmRQb3MiLCJsYXN0SW5kZXhPZiIsImVvZiIsIm5leHQiLCJpc1N0cmluZ1N0YXJ0IiwicGFyc2VTdHJpbmciLCJwYXJzZUJyYWNrZXQiLCJzdWJzdHJpbmciLCJpbkJyYWNrZXQiLCJzdHJpbmdRdW90ZSIsIndhcm4kMSIsIlJBTkdFX1RPS0VOIiwiQ0hFQ0tCT1hfUkFESU9fVE9LRU4iLCJfd2FybiIsImR5bmFtaWNUeXBlIiwiZ2VuU2VsZWN0IiwiZ2VuQ2hlY2tib3hNb2RlbCIsImdlblJhZGlvTW9kZWwiLCJnZW5EZWZhdWx0TW9kZWwiLCJ2YWx1ZUJpbmRpbmciLCJ0cnVlVmFsdWVCaW5kaW5nIiwiZmFsc2VWYWx1ZUJpbmRpbmciLCJzZWxlY3RlZFZhbCIsImNvZGUiLCJuZWVkQ29tcG9zaXRpb25HdWFyZCIsIm5vcm1hbGl6ZUV2ZW50cyIsInRhcmdldCQxIiwiYWRkJDEiLCJvbGRIYW5kbGVyIiwiZXYiLCJyZW1vdmUkMiIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwidXBkYXRlRE9NTGlzdGVuZXJzIiwidXBkYXRlRE9NUHJvcHMiLCJvbGRQcm9wcyIsIl92YWx1ZSIsInN0ckN1ciIsInNob3VsZFVwZGF0ZVZhbHVlIiwiY2hlY2tWYWwiLCJjb21wb3NpbmciLCJpc0RpcnR5IiwiaXNJbnB1dENoYW5nZWQiLCJhY3RpdmVFbGVtZW50IiwiX3ZNb2RpZmllcnMiLCJwYXJzZVN0eWxlVGV4dCIsImNzc1RleHQiLCJsaXN0RGVsaW1pdGVyIiwicHJvcGVydHlEZWxpbWl0ZXIiLCJub3JtYWxpemVTdHlsZURhdGEiLCJzdHlsZSIsIm5vcm1hbGl6ZVN0eWxlQmluZGluZyIsInN0YXRpY1N0eWxlIiwiYmluZGluZ1N0eWxlIiwiZ2V0U3R5bGUiLCJjaGVja0NoaWxkIiwic3R5bGVEYXRhIiwiY3NzVmFyUkUiLCJpbXBvcnRhbnRSRSIsInNldFByb3AiLCJzZXRQcm9wZXJ0eSIsIm5vcm1hbGl6ZSIsInByZWZpeGVzIiwidGVzdEVsIiwidXBwZXIiLCJwcmVmaXhlZCIsInVwZGF0ZVN0eWxlIiwib2xkU3RhdGljU3R5bGUiLCJvbGRTdHlsZUJpbmRpbmciLCJvbGRTdHlsZSIsIm5ld1N0eWxlIiwiYWRkQ2xhc3MiLCJjbGFzc0xpc3QiLCJnZXRBdHRyaWJ1dGUiLCJyZW1vdmVDbGFzcyIsInRhciIsInJlc29sdmVUcmFuc2l0aW9uIiwiZGVmJCQxIiwiY3NzIiwiYXV0b0Nzc1RyYW5zaXRpb24iLCJlbnRlckNsYXNzIiwiZW50ZXJUb0NsYXNzIiwiZW50ZXJBY3RpdmVDbGFzcyIsImxlYXZlQ2xhc3MiLCJsZWF2ZVRvQ2xhc3MiLCJsZWF2ZUFjdGl2ZUNsYXNzIiwiaGFzVHJhbnNpdGlvbiIsIlRSQU5TSVRJT04iLCJBTklNQVRJT04iLCJ0cmFuc2l0aW9uUHJvcCIsInRyYW5zaXRpb25FbmRFdmVudCIsImFuaW1hdGlvblByb3AiLCJhbmltYXRpb25FbmRFdmVudCIsIm9udHJhbnNpdGlvbmVuZCIsIm9ud2Via2l0dHJhbnNpdGlvbmVuZCIsIm9uYW5pbWF0aW9uZW5kIiwib253ZWJraXRhbmltYXRpb25lbmQiLCJyYWYiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJuZXh0RnJhbWUiLCJhZGRUcmFuc2l0aW9uQ2xhc3MiLCJyZW1vdmVUcmFuc2l0aW9uQ2xhc3MiLCJ3aGVuVHJhbnNpdGlvbkVuZHMiLCJnZXRUcmFuc2l0aW9uSW5mbyIsInRpbWVvdXQiLCJwcm9wQ291bnQiLCJlbmRlZCIsImVuZCIsIm9uRW5kIiwidHJhbnNmb3JtUkUiLCJzdHlsZXMiLCJnZXRDb21wdXRlZFN0eWxlIiwidHJhbnNpdGlvbkRlbGF5cyIsInRyYW5zaXRpb25EdXJhdGlvbnMiLCJ0cmFuc2l0aW9uVGltZW91dCIsImdldFRpbWVvdXQiLCJhbmltYXRpb25EZWxheXMiLCJhbmltYXRpb25EdXJhdGlvbnMiLCJhbmltYXRpb25UaW1lb3V0IiwiaGFzVHJhbnNmb3JtIiwiZGVsYXlzIiwiZHVyYXRpb25zIiwidG9NcyIsIk51bWJlciIsImVudGVyIiwidG9nZ2xlRGlzcGxheSIsImNhbmNlbGxlZCIsIl9lbnRlckNiIiwiYXBwZWFyQ2xhc3MiLCJhcHBlYXJUb0NsYXNzIiwiYXBwZWFyQWN0aXZlQ2xhc3MiLCJiZWZvcmVFbnRlciIsImFmdGVyRW50ZXIiLCJlbnRlckNhbmNlbGxlZCIsImJlZm9yZUFwcGVhciIsImFwcGVhciIsImFmdGVyQXBwZWFyIiwiYXBwZWFyQ2FuY2VsbGVkIiwiZHVyYXRpb24iLCJ0cmFuc2l0aW9uTm9kZSIsImlzQXBwZWFyIiwic3RhcnRDbGFzcyIsImFjdGl2ZUNsYXNzIiwidG9DbGFzcyIsImJlZm9yZUVudGVySG9vayIsImVudGVySG9vayIsImFmdGVyRW50ZXJIb29rIiwiZW50ZXJDYW5jZWxsZWRIb29rIiwiZXhwbGljaXRFbnRlckR1cmF0aW9uIiwiY2hlY2tEdXJhdGlvbiIsImV4cGVjdHNDU1MiLCJ1c2VyV2FudHNDb250cm9sIiwiZ2V0SG9va0FyZ3VtZW50c0xlbmd0aCIsInNob3ciLCJwZW5kaW5nTm9kZSIsIl9wZW5kaW5nIiwiaXNWYWxpZER1cmF0aW9uIiwibGVhdmUiLCJiZWZvcmVMZWF2ZSIsImFmdGVyTGVhdmUiLCJsZWF2ZUNhbmNlbGxlZCIsImRlbGF5TGVhdmUiLCJleHBsaWNpdExlYXZlRHVyYXRpb24iLCJwZXJmb3JtTGVhdmUiLCJpbnZva2VyRm5zIiwiX2VudGVyIiwicGxhdGZvcm1Nb2R1bGVzIiwidm1vZGVsIiwidHJpZ2dlciIsIm1vZGVsJDEiLCJiaW5kaW5nIiwic2V0U2VsZWN0ZWQiLCJvbkNvbXBvc2l0aW9uU3RhcnQiLCJvbkNvbXBvc2l0aW9uRW5kIiwibmVlZFJlc2V0Iiwic29tZSIsInYiLCJoYXNOb01hdGNoaW5nT3B0aW9uIiwiaXNNdWx0aXBsZSIsIm9wdGlvbiIsImdldFZhbHVlIiwic2VsZWN0ZWRJbmRleCIsImNyZWF0ZUV2ZW50IiwiaW5pdEV2ZW50IiwiZGlzcGF0Y2hFdmVudCIsImxvY2F0ZU5vZGUiLCJvcmlnaW5hbERpc3BsYXkiLCJfX3ZPcmlnaW5hbERpc3BsYXkiLCJkaXNwbGF5IiwidW5iaW5kIiwicGxhdGZvcm1EaXJlY3RpdmVzIiwidHJhbnNpdGlvblByb3BzIiwibW9kZSIsImdldFJlYWxDaGlsZCIsImNvbXBPcHRpb25zIiwiZXh0cmFjdFRyYW5zaXRpb25EYXRhIiwiY29tcCIsImtleSQxIiwicGxhY2Vob2xkZXIiLCJyYXdDaGlsZCIsImhhc1BhcmVudFRyYW5zaXRpb24iLCJpc1NhbWVDaGlsZCIsIm9sZENoaWxkIiwiVHJhbnNpdGlvbiIsIl9sZWF2aW5nIiwib2xkUmF3Q2hpbGQiLCJkZWxheWVkTGVhdmUiLCJtb3ZlQ2xhc3MiLCJUcmFuc2l0aW9uR3JvdXAiLCJwcmV2Q2hpbGRyZW4iLCJyYXdDaGlsZHJlbiIsInRyYW5zaXRpb25EYXRhIiwia2VwdCIsInJlbW92ZWQiLCJjJDEiLCJwb3MiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJiZWZvcmVVcGRhdGUiLCJ1cGRhdGVkIiwiaGFzTW92ZSIsImNhbGxQZW5kaW5nQ2JzIiwicmVjb3JkUG9zaXRpb24iLCJhcHBseVRyYW5zbGF0aW9uIiwiYm9keSIsImYiLCJvZmZzZXRIZWlnaHQiLCJtb3ZlZCIsInRyYW5zZm9ybSIsIldlYmtpdFRyYW5zZm9ybSIsInRyYW5zaXRpb25EdXJhdGlvbiIsIl9tb3ZlQ2IiLCJwcm9wZXJ0eU5hbWUiLCJfaGFzTW92ZSIsImNsb25lIiwiY2xvbmVOb2RlIiwibmV3UG9zIiwib2xkUG9zIiwiZHgiLCJsZWZ0IiwiZHkiLCJ0b3AiLCJwbGF0Zm9ybUNvbXBvbmVudHMiLCJzaG91bGREZWNvZGUiLCJjb250ZW50IiwiZW5jb2RlZCIsImRpdiIsImlubmVySFRNTCIsInNob3VsZERlY29kZU5ld2xpbmVzIiwiaXNVbmFyeVRhZyIsImNhbkJlTGVmdE9wZW5UYWciLCJpc05vblBocmFzaW5nVGFnIiwiZGVjb2RlciIsImRlY29kZSIsImh0bWwiLCJzaW5nbGVBdHRySWRlbnRpZmllciIsInNpbmdsZUF0dHJBc3NpZ24iLCJzaW5nbGVBdHRyVmFsdWVzIiwiYXR0cmlidXRlIiwibmNuYW1lIiwicW5hbWVDYXB0dXJlIiwic3RhcnRUYWdPcGVuIiwic3RhcnRUYWdDbG9zZSIsImRvY3R5cGUiLCJjb21tZW50IiwiY29uZGl0aW9uYWxDb21tZW50IiwiSVNfUkVHRVhfQ0FQVFVSSU5HX0JST0tFTiIsImciLCJpc1NjcmlwdE9yU3R5bGUiLCJyZUNhY2hlIiwiZGVjb2RpbmdNYXAiLCJlbmNvZGVkQXR0ciIsImVuY29kZWRBdHRyV2l0aE5ld0xpbmVzIiwiZGVjb2RlQXR0ciIsInJlIiwicGFyc2VIVE1MIiwic3RhY2siLCJleHBlY3RIVE1MIiwiaXNVbmFyeVRhZyQkMSIsImxhc3RUYWciLCJ0ZXh0RW5kIiwiY29tbWVudEVuZCIsImFkdmFuY2UiLCJjb25kaXRpb25hbEVuZCIsImRvY3R5cGVNYXRjaCIsImVuZFRhZ01hdGNoIiwiY3VySW5kZXgiLCJwYXJzZUVuZFRhZyIsInN0YXJ0VGFnTWF0Y2giLCJwYXJzZVN0YXJ0VGFnIiwiaGFuZGxlU3RhcnRUYWciLCJyZXN0JDEiLCJjaGFycyIsInN0YWNrZWRUYWciLCJyZVN0YWNrZWRUYWciLCJlbmRUYWdMZW5ndGgiLCJyZXN0IiwiYWxsIiwidW5hcnlTbGFzaCIsInVuYXJ5IiwibG93ZXJDYXNlZFRhZyIsImxvd2VyQ2FzZWRUYWdOYW1lIiwiZGVmYXVsdFRhZ1JFIiwicmVnZXhFc2NhcGVSRSIsImJ1aWxkUmVnZXgiLCJkZWxpbWl0ZXJzIiwib3BlbiIsImNsb3NlIiwicGFyc2VUZXh0IiwidGFnUkUiLCJ0b2tlbnMiLCJsYXN0SW5kZXgiLCJleGVjIiwiZGlyUkUiLCJvblJFIiwiZm9yQWxpYXNSRSIsImZvckl0ZXJhdG9yUkUiLCJiaW5kUkUiLCJhcmdSRSIsIm1vZGlmaWVyUkUiLCJkZWNvZGVIVE1MQ2FjaGVkIiwid2FybiQyIiwicGxhdGZvcm1HZXRUYWdOYW1lc3BhY2UiLCJwbGF0Zm9ybU11c3RVc2VQcm9wIiwicGxhdGZvcm1Jc1ByZVRhZyIsInByZVRyYW5zZm9ybXMiLCJ0cmFuc2Zvcm1zIiwicG9zdFRyYW5zZm9ybXMiLCJwYXJzZSIsInByZXNlcnZlV2hpdGVzcGFjZSIsInJvb3QiLCJjdXJyZW50UGFyZW50IiwiaW5WUHJlIiwid2FybmVkIiwiZW5kUHJlIiwiZWxlbWVudCIsImd1YXJkSUVTVkdCdWciLCJtYWtlQXR0cnNNYXAiLCJpc0ZvcmJpZGRlblRhZyIsImZvcmJpZGRlbiIsInByb2Nlc3NQcmUiLCJwcm9jZXNzUmF3QXR0cnMiLCJwcm9jZXNzRm9yIiwicHJvY2Vzc0lmIiwicHJvY2Vzc09uY2UiLCJwcm9jZXNzS2V5IiwicGxhaW4iLCJwcm9jZXNzUmVmIiwicHJvY2Vzc1Nsb3QiLCJwcm9jZXNzQ29tcG9uZW50IiwicHJvY2Vzc0F0dHJzIiwiY2hlY2tSb290Q29uc3RyYWludHMiLCJpZiIsImVsc2VpZiIsImVsc2UiLCJhZGRJZkNvbmRpdGlvbiIsImJsb2NrIiwicHJvY2Vzc0lmQ29uZGl0aW9ucyIsInNsb3RTY29wZSIsInNsb3RUYXJnZXQiLCJpJDIiLCJsYXN0Tm9kZSIsImNoZWNrSW5Gb3IiLCJpbk1hdGNoIiwiZm9yIiwiYWxpYXMiLCJpdGVyYXRvck1hdGNoIiwiaXRlcmF0b3IxIiwiaXRlcmF0b3IyIiwiZmluZFByZXZFbGVtZW50IiwiY29uZGl0aW9uIiwiaWZDb25kaXRpb25zIiwic2xvdE5hbWUiLCJjb21wb25lbnQiLCJpc1Byb3AiLCJoYXNCaW5kaW5ncyIsInBhcnNlTW9kaWZpZXJzIiwiY2FtZWwiLCJhcmdNYXRjaCIsImNoZWNrRm9yQWxpYXNNb2RlbCIsImllTlNCdWciLCJpZU5TUHJlZml4IiwiX2VsIiwiaXNTdGF0aWNLZXkiLCJpc1BsYXRmb3JtUmVzZXJ2ZWRUYWciLCJnZW5TdGF0aWNLZXlzQ2FjaGVkIiwiZ2VuU3RhdGljS2V5cyQxIiwib3B0aW1pemUiLCJtYXJrU3RhdGljJDEiLCJtYXJrU3RhdGljUm9vdHMiLCJzdGF0aWMiLCJzdGF0aWNJbkZvciIsInN0YXRpY1Jvb3QiLCJ3YWxrVGhyb3VnaENvbmRpdGlvbnNCbG9ja3MiLCJjb25kaXRpb25CbG9ja3MiLCJpc0RpcmVjdENoaWxkT2ZUZW1wbGF0ZUZvciIsImZuRXhwUkUiLCJzaW1wbGVQYXRoUkUiLCJlc2MiLCJ0YWIiLCJzcGFjZSIsInVwIiwicmlnaHQiLCJkb3duIiwiZ2VuR3VhcmQiLCJtb2RpZmllckNvZGUiLCJzdG9wIiwicHJldmVudCIsInNlbGYiLCJjdHJsIiwic2hpZnQiLCJhbHQiLCJtZXRhIiwibWlkZGxlIiwiZ2VuSGFuZGxlcnMiLCJnZW5IYW5kbGVyIiwiaXNNZXRob2RQYXRoIiwiaXNGdW5jdGlvbkV4cHJlc3Npb24iLCJnZW5LZXlGaWx0ZXIiLCJoYW5kbGVyQ29kZSIsImdlbkZpbHRlckNvZGUiLCJrZXlWYWwiLCJwYXJzZUludCIsImJpbmQkMSIsIndyYXBEYXRhIiwiYmFzZURpcmVjdGl2ZXMiLCJjbG9hayIsIndhcm4kMyIsInRyYW5zZm9ybXMkMSIsImRhdGFHZW5GbnMiLCJwbGF0Zm9ybURpcmVjdGl2ZXMkMSIsImlzUGxhdGZvcm1SZXNlcnZlZFRhZyQxIiwib25jZUNvdW50IiwiY3VycmVudE9wdGlvbnMiLCJnZW5lcmF0ZSIsImFzdCIsInByZXZTdGF0aWNSZW5kZXJGbnMiLCJjdXJyZW50U3RhdGljUmVuZGVyRm5zIiwicHJldk9uY2VDb3VudCIsImdlbkVsZW1lbnQiLCJzdGF0aWNQcm9jZXNzZWQiLCJnZW5TdGF0aWMiLCJvbmNlUHJvY2Vzc2VkIiwiZ2VuT25jZSIsImZvclByb2Nlc3NlZCIsImdlbkZvciIsImlmUHJvY2Vzc2VkIiwiZ2VuSWYiLCJnZW5DaGlsZHJlbiIsImdlblNsb3QiLCJnZW5Db21wb25lbnQiLCJnZW5EYXRhIiwiZ2VuSWZDb25kaXRpb25zIiwiY29uZGl0aW9ucyIsImdlblRlcm5hcnlFeHAiLCJtYXliZUNvbXBvbmVudCIsImdlbkRpcmVjdGl2ZXMiLCJnZW5Qcm9wcyIsImdlblNjb3BlZFNsb3RzIiwiZ2VuSW5saW5lVGVtcGxhdGUiLCJoYXNSdW50aW1lIiwibmVlZFJ1bnRpbWUiLCJnZW4iLCJpbmxpbmVSZW5kZXJGbnMiLCJnZW5TY29wZWRTbG90Iiwic2NvcGUiLCJjaGVja1NraXAiLCJlbCQxIiwiZ2V0Tm9ybWFsaXphdGlvblR5cGUiLCJnZW5Ob2RlIiwibmVlZHNOb3JtYWxpemF0aW9uIiwiZ2VuVGV4dCIsInRyYW5zZm9ybVNwZWNpYWxOZXdsaW5lcyIsImJpbmQkJDEiLCJjb21wb25lbnROYW1lIiwicHJvaGliaXRlZEtleXdvcmRSRSIsInVuYXJ5T3BlcmF0b3JzUkUiLCJpZGVudFJFIiwic3RyaXBTdHJpbmdSRSIsImRldGVjdEVycm9ycyIsImVycm9ycyIsImNoZWNrTm9kZSIsImNoZWNrRm9yIiwiY2hlY2tFdmVudCIsImNoZWNrRXhwcmVzc2lvbiIsImtleXdvcmRNYXRjaCIsImNoZWNrSWRlbnRpZmllciIsImlkZW50IiwiRnVuY3Rpb24iLCJiYXNlQ29tcGlsZSIsIm1ha2VGdW5jdGlvbiIsImNyZWF0ZUNvbXBpbGVyIiwiYmFzZU9wdGlvbnMiLCJmdW5jdGlvbkNvbXBpbGVDYWNoZSIsImNvbXBpbGUiLCJmaW5hbE9wdGlvbnMiLCJ0aXBzIiwidGlwJCQxIiwiY29tcGlsZWQiLCJjb21waWxlVG9GdW5jdGlvbnMiLCJmbkdlbkVycm9ycyIsInRyYW5zZm9ybU5vZGUiLCJjbGFzc0JpbmRpbmciLCJnZW5EYXRhJDEiLCJrbGFzcyQxIiwidHJhbnNmb3JtTm9kZSQxIiwic3R5bGVCaW5kaW5nIiwiZ2VuRGF0YSQyIiwic3R5bGUkMSIsIm1vZHVsZXMkMSIsImRpcmVjdGl2ZXMkMSIsInJlZiQxIiwiaWRUb1RlbXBsYXRlIiwibW91bnQiLCJkb2N1bWVudEVsZW1lbnQiLCJnZXRPdXRlckhUTUwiLCJvdXRlckhUTUwiLCJjb250YWluZXIiLCJwbGFuIiwiaG91c2VsaXN0IiwidXJsIiwiaXNBY3RpdmUiLCJldmFsIiwibWVzc2FnZSIsImhlYWRlciIsInNjcmVlblBvcyIsInJvd3MiLCJjb2x1bW5zIiwic2VhdCIsInNjb3JlIiwiY2luZW1hTGlzdCIsInJlZ2lvbiJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtRUFBMkQ7QUFDM0Q7QUFDQTtBQUNBLFdBQUc7O0FBRUgsb0RBQTRDO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDBDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBLGVBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7Ozs7QUFJQTtBQUNBLHNEQUE4QztBQUM5QztBQUNBLG1DQUEyQjtBQUMzQixxQ0FBNkI7QUFDN0IseUNBQWlDOztBQUVqQywrQ0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNOztBQUVOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQUk7QUFDSjtBQUNBOztBQUVBLDhDQUFzQztBQUN0QztBQUNBO0FBQ0EscUNBQTZCO0FBQzdCLHFDQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQW9CLGdCQUFnQjtBQUNwQztBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBb0IsZ0JBQWdCO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsYUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxhQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx5QkFBaUIsOEJBQThCO0FBQy9DO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7O0FBRUEsNERBQW9EO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0EsYUFBSztBQUNMLFlBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQW1CLDJCQUEyQjtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwwQkFBa0IsY0FBYztBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxxQkFBYSw0QkFBNEI7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU07QUFDTjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFJOztBQUVKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0Esc0JBQWMsNEJBQTRCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHNCQUFjLDRCQUE0QjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBZ0IsdUNBQXVDO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQWUsdUNBQXVDO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1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LEVBSStCLFNBSi9COztBQUZQLEdBUlcsRUFrQlg7QUFDQ3E1QyxXQUFRLElBRFQ7QUFFQ3I1QyxTQUFNLENBQ0wsVUFESyxFQUNPLFNBRFAsRUFDa0IsYUFEbEIsRUFDaUMsVUFEakMsRUFFTCxXQUZLLEVBRVEsTUFGUixFQUVnQixPQUZoQixFQUV5QixTQUZ6QixFQUVvQyxPQUZwQyxFQUU2QyxVQUY3QyxFQUV5RCxPQUZ6RCxFQUVrRSxVQUZsRSxFQUU4RSxRQUY5RSxFQUdMLFFBSEssRUFHSyxPQUhMO0FBRlAsR0FsQlc7QUFqQlA7QUFGQyxDQUFSLEUiLCJmaWxlIjoianMvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHRmdW5jdGlvbiBob3REaXNwb3NlQ2h1bmsoY2h1bmtJZCkge1xuIFx0XHRkZWxldGUgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdO1xuIFx0fVxuIFx0dmFyIHBhcmVudEhvdFVwZGF0ZUNhbGxiYWNrID0gdGhpc1tcIndlYnBhY2tIb3RVcGRhdGVcIl07XG4gXHR0aGlzW1wid2VicGFja0hvdFVwZGF0ZVwiXSA9IFxyXG4gXHRmdW5jdGlvbiB3ZWJwYWNrSG90VXBkYXRlQ2FsbGJhY2soY2h1bmtJZCwgbW9yZU1vZHVsZXMpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdGhvdEFkZFVwZGF0ZUNodW5rKGNodW5rSWQsIG1vcmVNb2R1bGVzKTtcclxuIFx0XHRpZihwYXJlbnRIb3RVcGRhdGVDYWxsYmFjaykgcGFyZW50SG90VXBkYXRlQ2FsbGJhY2soY2h1bmtJZCwgbW9yZU1vZHVsZXMpO1xyXG4gXHR9IDtcclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdERvd25sb2FkVXBkYXRlQ2h1bmsoY2h1bmtJZCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0dmFyIGhlYWQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF07XHJcbiBcdFx0dmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XHJcbiBcdFx0c2NyaXB0LnR5cGUgPSBcInRleHQvamF2YXNjcmlwdFwiO1xyXG4gXHRcdHNjcmlwdC5jaGFyc2V0ID0gXCJ1dGYtOFwiO1xyXG4gXHRcdHNjcmlwdC5zcmMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLnAgKyBcIlwiICsgY2h1bmtJZCArIFwiLlwiICsgaG90Q3VycmVudEhhc2ggKyBcIi5ob3QtdXBkYXRlLmpzXCI7XHJcbiBcdFx0aGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpO1xyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3REb3dubG9hZE1hbmlmZXN0KCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xyXG4gXHRcdFx0aWYodHlwZW9mIFhNTEh0dHBSZXF1ZXN0ID09PSBcInVuZGVmaW5lZFwiKVxyXG4gXHRcdFx0XHRyZXR1cm4gcmVqZWN0KG5ldyBFcnJvcihcIk5vIGJyb3dzZXIgc3VwcG9ydFwiKSk7XHJcbiBcdFx0XHR0cnkge1xyXG4gXHRcdFx0XHR2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gXHRcdFx0XHR2YXIgcmVxdWVzdFBhdGggPSBfX3dlYnBhY2tfcmVxdWlyZV9fLnAgKyBcIlwiICsgaG90Q3VycmVudEhhc2ggKyBcIi5ob3QtdXBkYXRlLmpzb25cIjtcclxuIFx0XHRcdFx0cmVxdWVzdC5vcGVuKFwiR0VUXCIsIHJlcXVlc3RQYXRoLCB0cnVlKTtcclxuIFx0XHRcdFx0cmVxdWVzdC50aW1lb3V0ID0gMTAwMDA7XHJcbiBcdFx0XHRcdHJlcXVlc3Quc2VuZChudWxsKTtcclxuIFx0XHRcdH0gY2F0Y2goZXJyKSB7XHJcbiBcdFx0XHRcdHJldHVybiByZWplY3QoZXJyKTtcclxuIFx0XHRcdH1cclxuIFx0XHRcdHJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XHJcbiBcdFx0XHRcdGlmKHJlcXVlc3QucmVhZHlTdGF0ZSAhPT0gNCkgcmV0dXJuO1xyXG4gXHRcdFx0XHRpZihyZXF1ZXN0LnN0YXR1cyA9PT0gMCkge1xyXG4gXHRcdFx0XHRcdC8vIHRpbWVvdXRcclxuIFx0XHRcdFx0XHRyZWplY3QobmV3IEVycm9yKFwiTWFuaWZlc3QgcmVxdWVzdCB0byBcIiArIHJlcXVlc3RQYXRoICsgXCIgdGltZWQgb3V0LlwiKSk7XHJcbiBcdFx0XHRcdH0gZWxzZSBpZihyZXF1ZXN0LnN0YXR1cyA9PT0gNDA0KSB7XHJcbiBcdFx0XHRcdFx0Ly8gbm8gdXBkYXRlIGF2YWlsYWJsZVxyXG4gXHRcdFx0XHRcdHJlc29sdmUoKTtcclxuIFx0XHRcdFx0fSBlbHNlIGlmKHJlcXVlc3Quc3RhdHVzICE9PSAyMDAgJiYgcmVxdWVzdC5zdGF0dXMgIT09IDMwNCkge1xyXG4gXHRcdFx0XHRcdC8vIG90aGVyIGZhaWx1cmVcclxuIFx0XHRcdFx0XHRyZWplY3QobmV3IEVycm9yKFwiTWFuaWZlc3QgcmVxdWVzdCB0byBcIiArIHJlcXVlc3RQYXRoICsgXCIgZmFpbGVkLlwiKSk7XHJcbiBcdFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdFx0Ly8gc3VjY2Vzc1xyXG4gXHRcdFx0XHRcdHRyeSB7XHJcbiBcdFx0XHRcdFx0XHR2YXIgdXBkYXRlID0gSlNPTi5wYXJzZShyZXF1ZXN0LnJlc3BvbnNlVGV4dCk7XHJcbiBcdFx0XHRcdFx0fSBjYXRjaChlKSB7XHJcbiBcdFx0XHRcdFx0XHRyZWplY3QoZSk7XHJcbiBcdFx0XHRcdFx0XHRyZXR1cm47XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdHJlc29sdmUodXBkYXRlKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fTtcclxuIFx0XHR9KTtcclxuIFx0fVxyXG5cbiBcdFxyXG4gXHRcclxuIFx0dmFyIGhvdEFwcGx5T25VcGRhdGUgPSB0cnVlO1xyXG4gXHR2YXIgaG90Q3VycmVudEhhc2ggPSBcImQ1NjY2MmU2ZjczMDUxNDQyZGY1XCI7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0dmFyIGhvdEN1cnJlbnRNb2R1bGVEYXRhID0ge307XHJcbiBcdHZhciBob3RNYWluTW9kdWxlID0gdHJ1ZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHR2YXIgaG90Q3VycmVudFBhcmVudHMgPSBbXTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHR2YXIgaG90Q3VycmVudFBhcmVudHNUZW1wID0gW107IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdENyZWF0ZVJlcXVpcmUobW9kdWxlSWQpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdHZhciBtZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdGlmKCFtZSkgcmV0dXJuIF9fd2VicGFja19yZXF1aXJlX187XHJcbiBcdFx0dmFyIGZuID0gZnVuY3Rpb24ocmVxdWVzdCkge1xyXG4gXHRcdFx0aWYobWUuaG90LmFjdGl2ZSkge1xyXG4gXHRcdFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdKSB7XHJcbiBcdFx0XHRcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XS5wYXJlbnRzLmluZGV4T2YobW9kdWxlSWQpIDwgMClcclxuIFx0XHRcdFx0XHRcdGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0ucGFyZW50cy5wdXNoKG1vZHVsZUlkKTtcclxuIFx0XHRcdFx0fSBlbHNlIGhvdEN1cnJlbnRQYXJlbnRzID0gW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0aWYobWUuY2hpbGRyZW4uaW5kZXhPZihyZXF1ZXN0KSA8IDApXHJcbiBcdFx0XHRcdFx0bWUuY2hpbGRyZW4ucHVzaChyZXF1ZXN0KTtcclxuIFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdGNvbnNvbGUud2FybihcIltITVJdIHVuZXhwZWN0ZWQgcmVxdWlyZShcIiArIHJlcXVlc3QgKyBcIikgZnJvbSBkaXNwb3NlZCBtb2R1bGUgXCIgKyBtb2R1bGVJZCk7XHJcbiBcdFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW107XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRob3RNYWluTW9kdWxlID0gZmFsc2U7XHJcbiBcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhyZXF1ZXN0KTtcclxuIFx0XHR9O1xyXG4gXHRcdHZhciBPYmplY3RGYWN0b3J5ID0gZnVuY3Rpb24gT2JqZWN0RmFjdG9yeShuYW1lKSB7XHJcbiBcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRjb25maWd1cmFibGU6IHRydWUsXHJcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXHJcbiBcdFx0XHRcdGdldDogZnVuY3Rpb24oKSB7XHJcbiBcdFx0XHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX19bbmFtZV07XHJcbiBcdFx0XHRcdH0sXHJcbiBcdFx0XHRcdHNldDogZnVuY3Rpb24odmFsdWUpIHtcclxuIFx0XHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fW25hbWVdID0gdmFsdWU7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH07XHJcbiBcdFx0fTtcclxuIFx0XHRmb3IodmFyIG5hbWUgaW4gX193ZWJwYWNrX3JlcXVpcmVfXykge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKF9fd2VicGFja19yZXF1aXJlX18sIG5hbWUpKSB7XHJcbiBcdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmbiwgbmFtZSwgT2JqZWN0RmFjdG9yeShuYW1lKSk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmbiwgXCJlXCIsIHtcclxuIFx0XHRcdGVudW1lcmFibGU6IHRydWUsXHJcbiBcdFx0XHR2YWx1ZTogZnVuY3Rpb24oY2h1bmtJZCkge1xyXG4gXHRcdFx0XHRpZihob3RTdGF0dXMgPT09IFwicmVhZHlcIilcclxuIFx0XHRcdFx0XHRob3RTZXRTdGF0dXMoXCJwcmVwYXJlXCIpO1xyXG4gXHRcdFx0XHRob3RDaHVua3NMb2FkaW5nKys7XHJcbiBcdFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLmUoY2h1bmtJZCkudGhlbihmaW5pc2hDaHVua0xvYWRpbmcsIGZ1bmN0aW9uKGVycikge1xyXG4gXHRcdFx0XHRcdGZpbmlzaENodW5rTG9hZGluZygpO1xyXG4gXHRcdFx0XHRcdHRocm93IGVycjtcclxuIFx0XHRcdFx0fSk7XHJcbiBcdFxyXG4gXHRcdFx0XHRmdW5jdGlvbiBmaW5pc2hDaHVua0xvYWRpbmcoKSB7XHJcbiBcdFx0XHRcdFx0aG90Q2h1bmtzTG9hZGluZy0tO1xyXG4gXHRcdFx0XHRcdGlmKGhvdFN0YXR1cyA9PT0gXCJwcmVwYXJlXCIpIHtcclxuIFx0XHRcdFx0XHRcdGlmKCFob3RXYWl0aW5nRmlsZXNNYXBbY2h1bmtJZF0pIHtcclxuIFx0XHRcdFx0XHRcdFx0aG90RW5zdXJlVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0XHRpZihob3RDaHVua3NMb2FkaW5nID09PSAwICYmIGhvdFdhaXRpbmdGaWxlcyA9PT0gMCkge1xyXG4gXHRcdFx0XHRcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fSk7XHJcbiBcdFx0cmV0dXJuIGZuO1xyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RDcmVhdGVNb2R1bGUobW9kdWxlSWQpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdHZhciBob3QgPSB7XHJcbiBcdFx0XHQvLyBwcml2YXRlIHN0dWZmXHJcbiBcdFx0XHRfYWNjZXB0ZWREZXBlbmRlbmNpZXM6IHt9LFxyXG4gXHRcdFx0X2RlY2xpbmVkRGVwZW5kZW5jaWVzOiB7fSxcclxuIFx0XHRcdF9zZWxmQWNjZXB0ZWQ6IGZhbHNlLFxyXG4gXHRcdFx0X3NlbGZEZWNsaW5lZDogZmFsc2UsXHJcbiBcdFx0XHRfZGlzcG9zZUhhbmRsZXJzOiBbXSxcclxuIFx0XHRcdF9tYWluOiBob3RNYWluTW9kdWxlLFxyXG4gXHRcclxuIFx0XHRcdC8vIE1vZHVsZSBBUElcclxuIFx0XHRcdGFjdGl2ZTogdHJ1ZSxcclxuIFx0XHRcdGFjY2VwdDogZnVuY3Rpb24oZGVwLCBjYWxsYmFjaykge1xyXG4gXHRcdFx0XHRpZih0eXBlb2YgZGVwID09PSBcInVuZGVmaW5lZFwiKVxyXG4gXHRcdFx0XHRcdGhvdC5fc2VsZkFjY2VwdGVkID0gdHJ1ZTtcclxuIFx0XHRcdFx0ZWxzZSBpZih0eXBlb2YgZGVwID09PSBcImZ1bmN0aW9uXCIpXHJcbiBcdFx0XHRcdFx0aG90Ll9zZWxmQWNjZXB0ZWQgPSBkZXA7XHJcbiBcdFx0XHRcdGVsc2UgaWYodHlwZW9mIGRlcCA9PT0gXCJvYmplY3RcIilcclxuIFx0XHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgZGVwLmxlbmd0aDsgaSsrKVxyXG4gXHRcdFx0XHRcdFx0aG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBbaV1dID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7fTtcclxuIFx0XHRcdFx0ZWxzZVxyXG4gXHRcdFx0XHRcdGhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwXSA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkge307XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0ZGVjbGluZTogZnVuY3Rpb24oZGVwKSB7XHJcbiBcdFx0XHRcdGlmKHR5cGVvZiBkZXAgPT09IFwidW5kZWZpbmVkXCIpXHJcbiBcdFx0XHRcdFx0aG90Ll9zZWxmRGVjbGluZWQgPSB0cnVlO1xyXG4gXHRcdFx0XHRlbHNlIGlmKHR5cGVvZiBkZXAgPT09IFwib2JqZWN0XCIpXHJcbiBcdFx0XHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGRlcC5sZW5ndGg7IGkrKylcclxuIFx0XHRcdFx0XHRcdGhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbZGVwW2ldXSA9IHRydWU7XHJcbiBcdFx0XHRcdGVsc2VcclxuIFx0XHRcdFx0XHRob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW2RlcF0gPSB0cnVlO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdGRpc3Bvc2U6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiBcdFx0XHRcdGhvdC5fZGlzcG9zZUhhbmRsZXJzLnB1c2goY2FsbGJhY2spO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdGFkZERpc3Bvc2VIYW5kbGVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gXHRcdFx0XHRob3QuX2Rpc3Bvc2VIYW5kbGVycy5wdXNoKGNhbGxiYWNrKTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRyZW1vdmVEaXNwb3NlSGFuZGxlcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuIFx0XHRcdFx0dmFyIGlkeCA9IGhvdC5fZGlzcG9zZUhhbmRsZXJzLmluZGV4T2YoY2FsbGJhY2spO1xyXG4gXHRcdFx0XHRpZihpZHggPj0gMCkgaG90Ll9kaXNwb3NlSGFuZGxlcnMuc3BsaWNlKGlkeCwgMSk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcclxuIFx0XHRcdC8vIE1hbmFnZW1lbnQgQVBJXHJcbiBcdFx0XHRjaGVjazogaG90Q2hlY2ssXHJcbiBcdFx0XHRhcHBseTogaG90QXBwbHksXHJcbiBcdFx0XHRzdGF0dXM6IGZ1bmN0aW9uKGwpIHtcclxuIFx0XHRcdFx0aWYoIWwpIHJldHVybiBob3RTdGF0dXM7XHJcbiBcdFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzLnB1c2gobCk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0YWRkU3RhdHVzSGFuZGxlcjogZnVuY3Rpb24obCkge1xyXG4gXHRcdFx0XHRob3RTdGF0dXNIYW5kbGVycy5wdXNoKGwpO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdHJlbW92ZVN0YXR1c0hhbmRsZXI6IGZ1bmN0aW9uKGwpIHtcclxuIFx0XHRcdFx0dmFyIGlkeCA9IGhvdFN0YXR1c0hhbmRsZXJzLmluZGV4T2YobCk7XHJcbiBcdFx0XHRcdGlmKGlkeCA+PSAwKSBob3RTdGF0dXNIYW5kbGVycy5zcGxpY2UoaWR4LCAxKTtcclxuIFx0XHRcdH0sXHJcbiBcdFxyXG4gXHRcdFx0Ly9pbmhlcml0IGZyb20gcHJldmlvdXMgZGlzcG9zZSBjYWxsXHJcbiBcdFx0XHRkYXRhOiBob3RDdXJyZW50TW9kdWxlRGF0YVttb2R1bGVJZF1cclxuIFx0XHR9O1xyXG4gXHRcdGhvdE1haW5Nb2R1bGUgPSB0cnVlO1xyXG4gXHRcdHJldHVybiBob3Q7XHJcbiBcdH1cclxuIFx0XHJcbiBcdHZhciBob3RTdGF0dXNIYW5kbGVycyA9IFtdO1xyXG4gXHR2YXIgaG90U3RhdHVzID0gXCJpZGxlXCI7XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RTZXRTdGF0dXMobmV3U3RhdHVzKSB7XHJcbiBcdFx0aG90U3RhdHVzID0gbmV3U3RhdHVzO1xyXG4gXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBob3RTdGF0dXNIYW5kbGVycy5sZW5ndGg7IGkrKylcclxuIFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzW2ldLmNhbGwobnVsbCwgbmV3U3RhdHVzKTtcclxuIFx0fVxyXG4gXHRcclxuIFx0Ly8gd2hpbGUgZG93bmxvYWRpbmdcclxuIFx0dmFyIGhvdFdhaXRpbmdGaWxlcyA9IDA7XHJcbiBcdHZhciBob3RDaHVua3NMb2FkaW5nID0gMDtcclxuIFx0dmFyIGhvdFdhaXRpbmdGaWxlc01hcCA9IHt9O1xyXG4gXHR2YXIgaG90UmVxdWVzdGVkRmlsZXNNYXAgPSB7fTtcclxuIFx0dmFyIGhvdEF2YWlsYWJsZUZpbGVzTWFwID0ge307XHJcbiBcdHZhciBob3REZWZlcnJlZDtcclxuIFx0XHJcbiBcdC8vIFRoZSB1cGRhdGUgaW5mb1xyXG4gXHR2YXIgaG90VXBkYXRlLCBob3RVcGRhdGVOZXdIYXNoO1xyXG4gXHRcclxuIFx0ZnVuY3Rpb24gdG9Nb2R1bGVJZChpZCkge1xyXG4gXHRcdHZhciBpc051bWJlciA9ICgraWQpICsgXCJcIiA9PT0gaWQ7XHJcbiBcdFx0cmV0dXJuIGlzTnVtYmVyID8gK2lkIDogaWQ7XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdENoZWNrKGFwcGx5KSB7XHJcbiBcdFx0aWYoaG90U3RhdHVzICE9PSBcImlkbGVcIikgdGhyb3cgbmV3IEVycm9yKFwiY2hlY2soKSBpcyBvbmx5IGFsbG93ZWQgaW4gaWRsZSBzdGF0dXNcIik7XHJcbiBcdFx0aG90QXBwbHlPblVwZGF0ZSA9IGFwcGx5O1xyXG4gXHRcdGhvdFNldFN0YXR1cyhcImNoZWNrXCIpO1xyXG4gXHRcdHJldHVybiBob3REb3dubG9hZE1hbmlmZXN0KCkudGhlbihmdW5jdGlvbih1cGRhdGUpIHtcclxuIFx0XHRcdGlmKCF1cGRhdGUpIHtcclxuIFx0XHRcdFx0aG90U2V0U3RhdHVzKFwiaWRsZVwiKTtcclxuIFx0XHRcdFx0cmV0dXJuIG51bGw7XHJcbiBcdFx0XHR9XHJcbiBcdFxyXG4gXHRcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXAgPSB7fTtcclxuIFx0XHRcdGhvdFdhaXRpbmdGaWxlc01hcCA9IHt9O1xyXG4gXHRcdFx0aG90QXZhaWxhYmxlRmlsZXNNYXAgPSB1cGRhdGUuYztcclxuIFx0XHRcdGhvdFVwZGF0ZU5ld0hhc2ggPSB1cGRhdGUuaDtcclxuIFx0XHJcbiBcdFx0XHRob3RTZXRTdGF0dXMoXCJwcmVwYXJlXCIpO1xyXG4gXHRcdFx0dmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuIFx0XHRcdFx0aG90RGVmZXJyZWQgPSB7XHJcbiBcdFx0XHRcdFx0cmVzb2x2ZTogcmVzb2x2ZSxcclxuIFx0XHRcdFx0XHRyZWplY3Q6IHJlamVjdFxyXG4gXHRcdFx0XHR9O1xyXG4gXHRcdFx0fSk7XHJcbiBcdFx0XHRob3RVcGRhdGUgPSB7fTtcclxuIFx0XHRcdHZhciBjaHVua0lkID0gMDtcclxuIFx0XHRcdHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1sb25lLWJsb2Nrc1xyXG4gXHRcdFx0XHQvKmdsb2JhbHMgY2h1bmtJZCAqL1xyXG4gXHRcdFx0XHRob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKTtcclxuIFx0XHRcdH1cclxuIFx0XHRcdGlmKGhvdFN0YXR1cyA9PT0gXCJwcmVwYXJlXCIgJiYgaG90Q2h1bmtzTG9hZGluZyA9PT0gMCAmJiBob3RXYWl0aW5nRmlsZXMgPT09IDApIHtcclxuIFx0XHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0cmV0dXJuIHByb21pc2U7XHJcbiBcdFx0fSk7XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdEFkZFVwZGF0ZUNodW5rKGNodW5rSWQsIG1vcmVNb2R1bGVzKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHRpZighaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0gfHwgIWhvdFJlcXVlc3RlZEZpbGVzTWFwW2NodW5rSWRdKVxyXG4gXHRcdFx0cmV0dXJuO1xyXG4gXHRcdGhvdFJlcXVlc3RlZEZpbGVzTWFwW2NodW5rSWRdID0gZmFsc2U7XHJcbiBcdFx0Zm9yKHZhciBtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0aG90VXBkYXRlW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFx0aWYoLS1ob3RXYWl0aW5nRmlsZXMgPT09IDAgJiYgaG90Q2h1bmtzTG9hZGluZyA9PT0gMCkge1xyXG4gXHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xyXG4gXHRcdH1cclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90RW5zdXJlVXBkYXRlQ2h1bmsoY2h1bmtJZCkge1xyXG4gXHRcdGlmKCFob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSkge1xyXG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzTWFwW2NodW5rSWRdID0gdHJ1ZTtcclxuIFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0gPSB0cnVlO1xyXG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzKys7XHJcbiBcdFx0XHRob3REb3dubG9hZFVwZGF0ZUNodW5rKGNodW5rSWQpO1xyXG4gXHRcdH1cclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90VXBkYXRlRG93bmxvYWRlZCgpIHtcclxuIFx0XHRob3RTZXRTdGF0dXMoXCJyZWFkeVwiKTtcclxuIFx0XHR2YXIgZGVmZXJyZWQgPSBob3REZWZlcnJlZDtcclxuIFx0XHRob3REZWZlcnJlZCA9IG51bGw7XHJcbiBcdFx0aWYoIWRlZmVycmVkKSByZXR1cm47XHJcbiBcdFx0aWYoaG90QXBwbHlPblVwZGF0ZSkge1xyXG4gXHRcdFx0aG90QXBwbHkoaG90QXBwbHlPblVwZGF0ZSkudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcclxuIFx0XHRcdFx0ZGVmZXJyZWQucmVzb2x2ZShyZXN1bHQpO1xyXG4gXHRcdFx0fSwgZnVuY3Rpb24oZXJyKSB7XHJcbiBcdFx0XHRcdGRlZmVycmVkLnJlamVjdChlcnIpO1xyXG4gXHRcdFx0fSk7XHJcbiBcdFx0fSBlbHNlIHtcclxuIFx0XHRcdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbXTtcclxuIFx0XHRcdGZvcih2YXIgaWQgaW4gaG90VXBkYXRlKSB7XHJcbiBcdFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChob3RVcGRhdGUsIGlkKSkge1xyXG4gXHRcdFx0XHRcdG91dGRhdGVkTW9kdWxlcy5wdXNoKHRvTW9kdWxlSWQoaWQpKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdFx0ZGVmZXJyZWQucmVzb2x2ZShvdXRkYXRlZE1vZHVsZXMpO1xyXG4gXHRcdH1cclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90QXBwbHkob3B0aW9ucykge1xyXG4gXHRcdGlmKGhvdFN0YXR1cyAhPT0gXCJyZWFkeVwiKSB0aHJvdyBuZXcgRXJyb3IoXCJhcHBseSgpIGlzIG9ubHkgYWxsb3dlZCBpbiByZWFkeSBzdGF0dXNcIik7XHJcbiBcdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcbiBcdFxyXG4gXHRcdHZhciBjYjtcclxuIFx0XHR2YXIgaTtcclxuIFx0XHR2YXIgajtcclxuIFx0XHR2YXIgbW9kdWxlO1xyXG4gXHRcdHZhciBtb2R1bGVJZDtcclxuIFx0XHJcbiBcdFx0ZnVuY3Rpb24gZ2V0QWZmZWN0ZWRTdHVmZih1cGRhdGVNb2R1bGVJZCkge1xyXG4gXHRcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFt1cGRhdGVNb2R1bGVJZF07XHJcbiBcdFx0XHR2YXIgb3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSB7fTtcclxuIFx0XHJcbiBcdFx0XHR2YXIgcXVldWUgPSBvdXRkYXRlZE1vZHVsZXMuc2xpY2UoKS5tYXAoZnVuY3Rpb24oaWQpIHtcclxuIFx0XHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0XHRjaGFpbjogW2lkXSxcclxuIFx0XHRcdFx0XHRpZDogaWRcclxuIFx0XHRcdFx0fTtcclxuIFx0XHRcdH0pO1xyXG4gXHRcdFx0d2hpbGUocXVldWUubGVuZ3RoID4gMCkge1xyXG4gXHRcdFx0XHR2YXIgcXVldWVJdGVtID0gcXVldWUucG9wKCk7XHJcbiBcdFx0XHRcdHZhciBtb2R1bGVJZCA9IHF1ZXVlSXRlbS5pZDtcclxuIFx0XHRcdFx0dmFyIGNoYWluID0gcXVldWVJdGVtLmNoYWluO1xyXG4gXHRcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0aWYoIW1vZHVsZSB8fCBtb2R1bGUuaG90Ll9zZWxmQWNjZXB0ZWQpXHJcbiBcdFx0XHRcdFx0Y29udGludWU7XHJcbiBcdFx0XHRcdGlmKG1vZHVsZS5ob3QuX3NlbGZEZWNsaW5lZCkge1xyXG4gXHRcdFx0XHRcdHJldHVybiB7XHJcbiBcdFx0XHRcdFx0XHR0eXBlOiBcInNlbGYtZGVjbGluZWRcIixcclxuIFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbixcclxuIFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZFxyXG4gXHRcdFx0XHRcdH07XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0aWYobW9kdWxlLmhvdC5fbWFpbikge1xyXG4gXHRcdFx0XHRcdHJldHVybiB7XHJcbiBcdFx0XHRcdFx0XHR0eXBlOiBcInVuYWNjZXB0ZWRcIixcclxuIFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbixcclxuIFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZFxyXG4gXHRcdFx0XHRcdH07XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IG1vZHVsZS5wYXJlbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRcdFx0dmFyIHBhcmVudElkID0gbW9kdWxlLnBhcmVudHNbaV07XHJcbiBcdFx0XHRcdFx0dmFyIHBhcmVudCA9IGluc3RhbGxlZE1vZHVsZXNbcGFyZW50SWRdO1xyXG4gXHRcdFx0XHRcdGlmKCFwYXJlbnQpIGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRcdGlmKHBhcmVudC5ob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSkge1xyXG4gXHRcdFx0XHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0XHRcdFx0dHlwZTogXCJkZWNsaW5lZFwiLFxyXG4gXHRcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4uY29uY2F0KFtwYXJlbnRJZF0pLFxyXG4gXHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXHJcbiBcdFx0XHRcdFx0XHRcdHBhcmVudElkOiBwYXJlbnRJZFxyXG4gXHRcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0aWYob3V0ZGF0ZWRNb2R1bGVzLmluZGV4T2YocGFyZW50SWQpID49IDApIGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRcdGlmKHBhcmVudC5ob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSkge1xyXG4gXHRcdFx0XHRcdFx0aWYoIW91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSlcclxuIFx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdID0gW107XHJcbiBcdFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0sIFttb2R1bGVJZF0pO1xyXG4gXHRcdFx0XHRcdFx0Y29udGludWU7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdGRlbGV0ZSBvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF07XHJcbiBcdFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzLnB1c2gocGFyZW50SWQpO1xyXG4gXHRcdFx0XHRcdHF1ZXVlLnB1c2goe1xyXG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLmNvbmNhdChbcGFyZW50SWRdKSxcclxuIFx0XHRcdFx0XHRcdGlkOiBwYXJlbnRJZFxyXG4gXHRcdFx0XHRcdH0pO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFxyXG4gXHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0dHlwZTogXCJhY2NlcHRlZFwiLFxyXG4gXHRcdFx0XHRtb2R1bGVJZDogdXBkYXRlTW9kdWxlSWQsXHJcbiBcdFx0XHRcdG91dGRhdGVkTW9kdWxlczogb3V0ZGF0ZWRNb2R1bGVzLFxyXG4gXHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llczogb3V0ZGF0ZWREZXBlbmRlbmNpZXNcclxuIFx0XHRcdH07XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHRmdW5jdGlvbiBhZGRBbGxUb1NldChhLCBiKSB7XHJcbiBcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgYi5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0XHR2YXIgaXRlbSA9IGJbaV07XHJcbiBcdFx0XHRcdGlmKGEuaW5kZXhPZihpdGVtKSA8IDApXHJcbiBcdFx0XHRcdFx0YS5wdXNoKGl0ZW0pO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gYXQgYmVnaW4gYWxsIHVwZGF0ZXMgbW9kdWxlcyBhcmUgb3V0ZGF0ZWRcclxuIFx0XHQvLyB0aGUgXCJvdXRkYXRlZFwiIHN0YXR1cyBjYW4gcHJvcGFnYXRlIHRvIHBhcmVudHMgaWYgdGhleSBkb24ndCBhY2NlcHQgdGhlIGNoaWxkcmVuXHJcbiBcdFx0dmFyIG91dGRhdGVkRGVwZW5kZW5jaWVzID0ge307XHJcbiBcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFtdO1xyXG4gXHRcdHZhciBhcHBsaWVkVXBkYXRlID0ge307XHJcbiBcdFxyXG4gXHRcdHZhciB3YXJuVW5leHBlY3RlZFJlcXVpcmUgPSBmdW5jdGlvbiB3YXJuVW5leHBlY3RlZFJlcXVpcmUoKSB7XHJcbiBcdFx0XHRjb25zb2xlLndhcm4oXCJbSE1SXSB1bmV4cGVjdGVkIHJlcXVpcmUoXCIgKyByZXN1bHQubW9kdWxlSWQgKyBcIikgdG8gZGlzcG9zZWQgbW9kdWxlXCIpO1xyXG4gXHRcdH07XHJcbiBcdFxyXG4gXHRcdGZvcih2YXIgaWQgaW4gaG90VXBkYXRlKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoaG90VXBkYXRlLCBpZCkpIHtcclxuIFx0XHRcdFx0bW9kdWxlSWQgPSB0b01vZHVsZUlkKGlkKTtcclxuIFx0XHRcdFx0dmFyIHJlc3VsdDtcclxuIFx0XHRcdFx0aWYoaG90VXBkYXRlW2lkXSkge1xyXG4gXHRcdFx0XHRcdHJlc3VsdCA9IGdldEFmZmVjdGVkU3R1ZmYobW9kdWxlSWQpO1xyXG4gXHRcdFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0XHRcdHJlc3VsdCA9IHtcclxuIFx0XHRcdFx0XHRcdHR5cGU6IFwiZGlzcG9zZWRcIixcclxuIFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBpZFxyXG4gXHRcdFx0XHRcdH07XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0dmFyIGFib3J0RXJyb3IgPSBmYWxzZTtcclxuIFx0XHRcdFx0dmFyIGRvQXBwbHkgPSBmYWxzZTtcclxuIFx0XHRcdFx0dmFyIGRvRGlzcG9zZSA9IGZhbHNlO1xyXG4gXHRcdFx0XHR2YXIgY2hhaW5JbmZvID0gXCJcIjtcclxuIFx0XHRcdFx0aWYocmVzdWx0LmNoYWluKSB7XHJcbiBcdFx0XHRcdFx0Y2hhaW5JbmZvID0gXCJcXG5VcGRhdGUgcHJvcGFnYXRpb246IFwiICsgcmVzdWx0LmNoYWluLmpvaW4oXCIgLT4gXCIpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdHN3aXRjaChyZXN1bHQudHlwZSkge1xyXG4gXHRcdFx0XHRcdGNhc2UgXCJzZWxmLWRlY2xpbmVkXCI6XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uRGVjbGluZWQpXHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25EZWNsaW5lZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRGVjbGluZWQpXHJcbiBcdFx0XHRcdFx0XHRcdGFib3J0RXJyb3IgPSBuZXcgRXJyb3IoXCJBYm9ydGVkIGJlY2F1c2Ugb2Ygc2VsZiBkZWNsaW5lOiBcIiArIHJlc3VsdC5tb2R1bGVJZCArIGNoYWluSW5mbyk7XHJcbiBcdFx0XHRcdFx0XHRicmVhaztcclxuIFx0XHRcdFx0XHRjYXNlIFwiZGVjbGluZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25EZWNsaW5lZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkRlY2xpbmVkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRpZighb3B0aW9ucy5pZ25vcmVEZWNsaW5lZClcclxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcIkFib3J0ZWQgYmVjYXVzZSBvZiBkZWNsaW5lZCBkZXBlbmRlbmN5OiBcIiArIHJlc3VsdC5tb2R1bGVJZCArIFwiIGluIFwiICsgcmVzdWx0LnBhcmVudElkICsgY2hhaW5JbmZvKTtcclxuIFx0XHRcdFx0XHRcdGJyZWFrO1xyXG4gXHRcdFx0XHRcdGNhc2UgXCJ1bmFjY2VwdGVkXCI6XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uVW5hY2NlcHRlZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vblVuYWNjZXB0ZWQocmVzdWx0KTtcclxuIFx0XHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZVVuYWNjZXB0ZWQpXHJcbiBcdFx0XHRcdFx0XHRcdGFib3J0RXJyb3IgPSBuZXcgRXJyb3IoXCJBYm9ydGVkIGJlY2F1c2UgXCIgKyBtb2R1bGVJZCArIFwiIGlzIG5vdCBhY2NlcHRlZFwiICsgY2hhaW5JbmZvKTtcclxuIFx0XHRcdFx0XHRcdGJyZWFrO1xyXG4gXHRcdFx0XHRcdGNhc2UgXCJhY2NlcHRlZFwiOlxyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkFjY2VwdGVkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uQWNjZXB0ZWQocmVzdWx0KTtcclxuIFx0XHRcdFx0XHRcdGRvQXBwbHkgPSB0cnVlO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcImRpc3Bvc2VkXCI6XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uRGlzcG9zZWQpXHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25EaXNwb3NlZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0ZG9EaXNwb3NlID0gdHJ1ZTtcclxuIFx0XHRcdFx0XHRcdGJyZWFrO1xyXG4gXHRcdFx0XHRcdGRlZmF1bHQ6XHJcbiBcdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJVbmV4Y2VwdGlvbiB0eXBlIFwiICsgcmVzdWx0LnR5cGUpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGlmKGFib3J0RXJyb3IpIHtcclxuIFx0XHRcdFx0XHRob3RTZXRTdGF0dXMoXCJhYm9ydFwiKTtcclxuIFx0XHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoYWJvcnRFcnJvcik7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0aWYoZG9BcHBseSkge1xyXG4gXHRcdFx0XHRcdGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdID0gaG90VXBkYXRlW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZE1vZHVsZXMsIHJlc3VsdC5vdXRkYXRlZE1vZHVsZXMpO1xyXG4gXHRcdFx0XHRcdGZvcihtb2R1bGVJZCBpbiByZXN1bHQub3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcclxuIFx0XHRcdFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChyZXN1bHQub3V0ZGF0ZWREZXBlbmRlbmNpZXMsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRcdFx0XHRpZighb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKVxyXG4gXHRcdFx0XHRcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSA9IFtdO1xyXG4gXHRcdFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0sIHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihkb0Rpc3Bvc2UpIHtcclxuIFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZE1vZHVsZXMsIFtyZXN1bHQubW9kdWxlSWRdKTtcclxuIFx0XHRcdFx0XHRhcHBsaWVkVXBkYXRlW21vZHVsZUlkXSA9IHdhcm5VbmV4cGVjdGVkUmVxdWlyZTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gU3RvcmUgc2VsZiBhY2NlcHRlZCBvdXRkYXRlZCBtb2R1bGVzIHRvIHJlcXVpcmUgdGhlbSBsYXRlciBieSB0aGUgbW9kdWxlIHN5c3RlbVxyXG4gXHRcdHZhciBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMgPSBbXTtcclxuIFx0XHRmb3IoaSA9IDA7IGkgPCBvdXRkYXRlZE1vZHVsZXMubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdG1vZHVsZUlkID0gb3V0ZGF0ZWRNb2R1bGVzW2ldO1xyXG4gXHRcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gJiYgaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uaG90Ll9zZWxmQWNjZXB0ZWQpXHJcbiBcdFx0XHRcdG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcy5wdXNoKHtcclxuIFx0XHRcdFx0XHRtb2R1bGU6IG1vZHVsZUlkLFxyXG4gXHRcdFx0XHRcdGVycm9ySGFuZGxlcjogaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uaG90Ll9zZWxmQWNjZXB0ZWRcclxuIFx0XHRcdFx0fSk7XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBOb3cgaW4gXCJkaXNwb3NlXCIgcGhhc2VcclxuIFx0XHRob3RTZXRTdGF0dXMoXCJkaXNwb3NlXCIpO1xyXG4gXHRcdE9iamVjdC5rZXlzKGhvdEF2YWlsYWJsZUZpbGVzTWFwKS5mb3JFYWNoKGZ1bmN0aW9uKGNodW5rSWQpIHtcclxuIFx0XHRcdGlmKGhvdEF2YWlsYWJsZUZpbGVzTWFwW2NodW5rSWRdID09PSBmYWxzZSkge1xyXG4gXHRcdFx0XHRob3REaXNwb3NlQ2h1bmsoY2h1bmtJZCk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0fSk7XHJcbiBcdFxyXG4gXHRcdHZhciBpZHg7XHJcbiBcdFx0dmFyIHF1ZXVlID0gb3V0ZGF0ZWRNb2R1bGVzLnNsaWNlKCk7XHJcbiBcdFx0d2hpbGUocXVldWUubGVuZ3RoID4gMCkge1xyXG4gXHRcdFx0bW9kdWxlSWQgPSBxdWV1ZS5wb3AoKTtcclxuIFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0aWYoIW1vZHVsZSkgY29udGludWU7XHJcbiBcdFxyXG4gXHRcdFx0dmFyIGRhdGEgPSB7fTtcclxuIFx0XHJcbiBcdFx0XHQvLyBDYWxsIGRpc3Bvc2UgaGFuZGxlcnNcclxuIFx0XHRcdHZhciBkaXNwb3NlSGFuZGxlcnMgPSBtb2R1bGUuaG90Ll9kaXNwb3NlSGFuZGxlcnM7XHJcbiBcdFx0XHRmb3IoaiA9IDA7IGogPCBkaXNwb3NlSGFuZGxlcnMubGVuZ3RoOyBqKyspIHtcclxuIFx0XHRcdFx0Y2IgPSBkaXNwb3NlSGFuZGxlcnNbal07XHJcbiBcdFx0XHRcdGNiKGRhdGEpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0aG90Q3VycmVudE1vZHVsZURhdGFbbW9kdWxlSWRdID0gZGF0YTtcclxuIFx0XHJcbiBcdFx0XHQvLyBkaXNhYmxlIG1vZHVsZSAodGhpcyBkaXNhYmxlcyByZXF1aXJlcyBmcm9tIHRoaXMgbW9kdWxlKVxyXG4gXHRcdFx0bW9kdWxlLmhvdC5hY3RpdmUgPSBmYWxzZTtcclxuIFx0XHJcbiBcdFx0XHQvLyByZW1vdmUgbW9kdWxlIGZyb20gY2FjaGVcclxuIFx0XHRcdGRlbGV0ZSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHJcbiBcdFx0XHQvLyByZW1vdmUgXCJwYXJlbnRzXCIgcmVmZXJlbmNlcyBmcm9tIGFsbCBjaGlsZHJlblxyXG4gXHRcdFx0Zm9yKGogPSAwOyBqIDwgbW9kdWxlLmNoaWxkcmVuLmxlbmd0aDsgaisrKSB7XHJcbiBcdFx0XHRcdHZhciBjaGlsZCA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlLmNoaWxkcmVuW2pdXTtcclxuIFx0XHRcdFx0aWYoIWNoaWxkKSBjb250aW51ZTtcclxuIFx0XHRcdFx0aWR4ID0gY2hpbGQucGFyZW50cy5pbmRleE9mKG1vZHVsZUlkKTtcclxuIFx0XHRcdFx0aWYoaWR4ID49IDApIHtcclxuIFx0XHRcdFx0XHRjaGlsZC5wYXJlbnRzLnNwbGljZShpZHgsIDEpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyByZW1vdmUgb3V0ZGF0ZWQgZGVwZW5kZW5jeSBmcm9tIG1vZHVsZSBjaGlsZHJlblxyXG4gXHRcdHZhciBkZXBlbmRlbmN5O1xyXG4gXHRcdHZhciBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcztcclxuIFx0XHRmb3IobW9kdWxlSWQgaW4gb3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRpZihtb2R1bGUpIHtcclxuIFx0XHRcdFx0XHRtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyA9IG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0XHRmb3IoaiA9IDA7IGogPCBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcy5sZW5ndGg7IGorKykge1xyXG4gXHRcdFx0XHRcdFx0ZGVwZW5kZW5jeSA9IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2pdO1xyXG4gXHRcdFx0XHRcdFx0aWR4ID0gbW9kdWxlLmNoaWxkcmVuLmluZGV4T2YoZGVwZW5kZW5jeSk7XHJcbiBcdFx0XHRcdFx0XHRpZihpZHggPj0gMCkgbW9kdWxlLmNoaWxkcmVuLnNwbGljZShpZHgsIDEpO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gTm90IGluIFwiYXBwbHlcIiBwaGFzZVxyXG4gXHRcdGhvdFNldFN0YXR1cyhcImFwcGx5XCIpO1xyXG4gXHRcclxuIFx0XHRob3RDdXJyZW50SGFzaCA9IGhvdFVwZGF0ZU5ld0hhc2g7XHJcbiBcdFxyXG4gXHRcdC8vIGluc2VydCBuZXcgY29kZVxyXG4gXHRcdGZvcihtb2R1bGVJZCBpbiBhcHBsaWVkVXBkYXRlKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYXBwbGllZFVwZGF0ZSwgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdG1vZHVsZXNbbW9kdWxlSWRdID0gYXBwbGllZFVwZGF0ZVttb2R1bGVJZF07XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBjYWxsIGFjY2VwdCBoYW5kbGVyc1xyXG4gXHRcdHZhciBlcnJvciA9IG51bGw7XHJcbiBcdFx0Zm9yKG1vZHVsZUlkIGluIG91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob3V0ZGF0ZWREZXBlbmRlbmNpZXMsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0bW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdHZhciBjYWxsYmFja3MgPSBbXTtcclxuIFx0XHRcdFx0Zm9yKGkgPSAwOyBpIDwgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdFx0XHRkZXBlbmRlbmN5ID0gbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbaV07XHJcbiBcdFx0XHRcdFx0Y2IgPSBtb2R1bGUuaG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBlbmRlbmN5XTtcclxuIFx0XHRcdFx0XHRpZihjYWxsYmFja3MuaW5kZXhPZihjYikgPj0gMCkgY29udGludWU7XHJcbiBcdFx0XHRcdFx0Y2FsbGJhY2tzLnB1c2goY2IpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGZvcihpID0gMDsgaSA8IGNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0XHRcdGNiID0gY2FsbGJhY2tzW2ldO1xyXG4gXHRcdFx0XHRcdHRyeSB7XHJcbiBcdFx0XHRcdFx0XHRjYihtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyk7XHJcbiBcdFx0XHRcdFx0fSBjYXRjaChlcnIpIHtcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25FcnJvcmVkKSB7XHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcclxuIFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcImFjY2VwdC1lcnJvcmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxyXG4gXHRcdFx0XHRcdFx0XHRcdGRlcGVuZGVuY3lJZDogbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbaV0sXHJcbiBcdFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVyclxyXG4gXHRcdFx0XHRcdFx0XHR9KTtcclxuIFx0XHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdFx0aWYoIWVycm9yKVxyXG4gXHRcdFx0XHRcdFx0XHRcdGVycm9yID0gZXJyO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gTG9hZCBzZWxmIGFjY2VwdGVkIG1vZHVsZXNcclxuIFx0XHRmb3IoaSA9IDA7IGkgPCBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdHZhciBpdGVtID0gb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzW2ldO1xyXG4gXHRcdFx0bW9kdWxlSWQgPSBpdGVtLm1vZHVsZTtcclxuIFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW21vZHVsZUlkXTtcclxuIFx0XHRcdHRyeSB7XHJcbiBcdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpO1xyXG4gXHRcdFx0fSBjYXRjaChlcnIpIHtcclxuIFx0XHRcdFx0aWYodHlwZW9mIGl0ZW0uZXJyb3JIYW5kbGVyID09PSBcImZ1bmN0aW9uXCIpIHtcclxuIFx0XHRcdFx0XHR0cnkge1xyXG4gXHRcdFx0XHRcdFx0aXRlbS5lcnJvckhhbmRsZXIoZXJyKTtcclxuIFx0XHRcdFx0XHR9IGNhdGNoKGVycjIpIHtcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25FcnJvcmVkKSB7XHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcclxuIFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcInNlbGYtYWNjZXB0LWVycm9yLWhhbmRsZXItZXJyb3JlZFwiLFxyXG4gXHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyMixcclxuIFx0XHRcdFx0XHRcdFx0XHRvcmdpbmFsRXJyb3I6IGVyclxyXG4gXHRcdFx0XHRcdFx0XHR9KTtcclxuIFx0XHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdFx0aWYoIWVycm9yKVxyXG4gXHRcdFx0XHRcdFx0XHRcdGVycm9yID0gZXJyMjtcclxuIFx0XHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRcdGlmKCFlcnJvcilcclxuIFx0XHRcdFx0XHRcdFx0ZXJyb3IgPSBlcnI7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0XHRcdGlmKG9wdGlvbnMub25FcnJvcmVkKSB7XHJcbiBcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XHJcbiBcdFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1hY2NlcHQtZXJyb3JlZFwiLFxyXG4gXHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXHJcbiBcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnJcclxuIFx0XHRcdFx0XHRcdH0pO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRpZighb3B0aW9ucy5pZ25vcmVFcnJvcmVkKSB7XHJcbiBcdFx0XHRcdFx0XHRpZighZXJyb3IpXHJcbiBcdFx0XHRcdFx0XHRcdGVycm9yID0gZXJyO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gaGFuZGxlIGVycm9ycyBpbiBhY2NlcHQgaGFuZGxlcnMgYW5kIHNlbGYgYWNjZXB0ZWQgbW9kdWxlIGxvYWRcclxuIFx0XHRpZihlcnJvcikge1xyXG4gXHRcdFx0aG90U2V0U3RhdHVzKFwiZmFpbFwiKTtcclxuIFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvcik7XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHRob3RTZXRTdGF0dXMoXCJpZGxlXCIpO1xyXG4gXHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUob3V0ZGF0ZWRNb2R1bGVzKTtcclxuIFx0fVxyXG5cbiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRob3Q6IGhvdENyZWF0ZU1vZHVsZShtb2R1bGVJZCksXG4gXHRcdFx0cGFyZW50czogKGhvdEN1cnJlbnRQYXJlbnRzVGVtcCA9IGhvdEN1cnJlbnRQYXJlbnRzLCBob3RDdXJyZW50UGFyZW50cyA9IFtdLCBob3RDdXJyZW50UGFyZW50c1RlbXApLFxuIFx0XHRcdGNoaWxkcmVuOiBbXVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBob3RDcmVhdGVSZXF1aXJlKG1vZHVsZUlkKSk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gX193ZWJwYWNrX2hhc2hfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5oID0gZnVuY3Rpb24oKSB7IHJldHVybiBob3RDdXJyZW50SGFzaDsgfTtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gaG90Q3JlYXRlUmVxdWlyZSg4KShfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA4KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBkNTY2NjJlNmY3MzA1MTQ0MmRmNSIsIi8qIVxuICogVnVlLmpzIHYyLjIuMlxuICogKGMpIDIwMTQtMjAxNyBFdmFuIFlvdVxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICovXG4oZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuXHR0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKSA6XG5cdHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShmYWN0b3J5KSA6XG5cdChnbG9iYWwuVnVlID0gZmFjdG9yeSgpKTtcbn0odGhpcywgKGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO1xuXG4vKiAgKi9cblxuLyoqXG4gKiBDb252ZXJ0IGEgdmFsdWUgdG8gYSBzdHJpbmcgdGhhdCBpcyBhY3R1YWxseSByZW5kZXJlZC5cbiAqL1xuZnVuY3Rpb24gX3RvU3RyaW5nICh2YWwpIHtcbiAgcmV0dXJuIHZhbCA9PSBudWxsXG4gICAgPyAnJ1xuICAgIDogdHlwZW9mIHZhbCA9PT0gJ29iamVjdCdcbiAgICAgID8gSlNPTi5zdHJpbmdpZnkodmFsLCBudWxsLCAyKVxuICAgICAgOiBTdHJpbmcodmFsKVxufVxuXG4vKipcbiAqIENvbnZlcnQgYSBpbnB1dCB2YWx1ZSB0byBhIG51bWJlciBmb3IgcGVyc2lzdGVuY2UuXG4gKiBJZiB0aGUgY29udmVyc2lvbiBmYWlscywgcmV0dXJuIG9yaWdpbmFsIHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gdG9OdW1iZXIgKHZhbCkge1xuICB2YXIgbiA9IHBhcnNlRmxvYXQodmFsKTtcbiAgcmV0dXJuIGlzTmFOKG4pID8gdmFsIDogblxufVxuXG4vKipcbiAqIE1ha2UgYSBtYXAgYW5kIHJldHVybiBhIGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhIGtleVxuICogaXMgaW4gdGhhdCBtYXAuXG4gKi9cbmZ1bmN0aW9uIG1ha2VNYXAgKFxuICBzdHIsXG4gIGV4cGVjdHNMb3dlckNhc2Vcbikge1xuICB2YXIgbWFwID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgdmFyIGxpc3QgPSBzdHIuc3BsaXQoJywnKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgbWFwW2xpc3RbaV1dID0gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZXhwZWN0c0xvd2VyQ2FzZVxuICAgID8gZnVuY3Rpb24gKHZhbCkgeyByZXR1cm4gbWFwW3ZhbC50b0xvd2VyQ2FzZSgpXTsgfVxuICAgIDogZnVuY3Rpb24gKHZhbCkgeyByZXR1cm4gbWFwW3ZhbF07IH1cbn1cblxuLyoqXG4gKiBDaGVjayBpZiBhIHRhZyBpcyBhIGJ1aWx0LWluIHRhZy5cbiAqL1xudmFyIGlzQnVpbHRJblRhZyA9IG1ha2VNYXAoJ3Nsb3QsY29tcG9uZW50JywgdHJ1ZSk7XG5cbi8qKlxuICogUmVtb3ZlIGFuIGl0ZW0gZnJvbSBhbiBhcnJheVxuICovXG5mdW5jdGlvbiByZW1vdmUgKGFyciwgaXRlbSkge1xuICBpZiAoYXJyLmxlbmd0aCkge1xuICAgIHZhciBpbmRleCA9IGFyci5pbmRleE9mKGl0ZW0pO1xuICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICByZXR1cm4gYXJyLnNwbGljZShpbmRleCwgMSlcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBDaGVjayB3aGV0aGVyIHRoZSBvYmplY3QgaGFzIHRoZSBwcm9wZXJ0eS5cbiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbmZ1bmN0aW9uIGhhc093biAob2JqLCBrZXkpIHtcbiAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpXG59XG5cbi8qKlxuICogQ2hlY2sgaWYgdmFsdWUgaXMgcHJpbWl0aXZlXG4gKi9cbmZ1bmN0aW9uIGlzUHJpbWl0aXZlICh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyB8fCB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInXG59XG5cbi8qKlxuICogQ3JlYXRlIGEgY2FjaGVkIHZlcnNpb24gb2YgYSBwdXJlIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjYWNoZWQgKGZuKSB7XG4gIHZhciBjYWNoZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIHJldHVybiAoZnVuY3Rpb24gY2FjaGVkRm4gKHN0cikge1xuICAgIHZhciBoaXQgPSBjYWNoZVtzdHJdO1xuICAgIHJldHVybiBoaXQgfHwgKGNhY2hlW3N0cl0gPSBmbihzdHIpKVxuICB9KVxufVxuXG4vKipcbiAqIENhbWVsaXplIGEgaHlwaGVuLWRlbGltaXRlZCBzdHJpbmcuXG4gKi9cbnZhciBjYW1lbGl6ZVJFID0gLy0oXFx3KS9nO1xudmFyIGNhbWVsaXplID0gY2FjaGVkKGZ1bmN0aW9uIChzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKGNhbWVsaXplUkUsIGZ1bmN0aW9uIChfLCBjKSB7IHJldHVybiBjID8gYy50b1VwcGVyQ2FzZSgpIDogJyc7IH0pXG59KTtcblxuLyoqXG4gKiBDYXBpdGFsaXplIGEgc3RyaW5nLlxuICovXG52YXIgY2FwaXRhbGl6ZSA9IGNhY2hlZChmdW5jdGlvbiAoc3RyKSB7XG4gIHJldHVybiBzdHIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc2xpY2UoMSlcbn0pO1xuXG4vKipcbiAqIEh5cGhlbmF0ZSBhIGNhbWVsQ2FzZSBzdHJpbmcuXG4gKi9cbnZhciBoeXBoZW5hdGVSRSA9IC8oW14tXSkoW0EtWl0pL2c7XG52YXIgaHlwaGVuYXRlID0gY2FjaGVkKGZ1bmN0aW9uIChzdHIpIHtcbiAgcmV0dXJuIHN0clxuICAgIC5yZXBsYWNlKGh5cGhlbmF0ZVJFLCAnJDEtJDInKVxuICAgIC5yZXBsYWNlKGh5cGhlbmF0ZVJFLCAnJDEtJDInKVxuICAgIC50b0xvd2VyQ2FzZSgpXG59KTtcblxuLyoqXG4gKiBTaW1wbGUgYmluZCwgZmFzdGVyIHRoYW4gbmF0aXZlXG4gKi9cbmZ1bmN0aW9uIGJpbmQgKGZuLCBjdHgpIHtcbiAgZnVuY3Rpb24gYm91bmRGbiAoYSkge1xuICAgIHZhciBsID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICByZXR1cm4gbFxuICAgICAgPyBsID4gMVxuICAgICAgICA/IGZuLmFwcGx5KGN0eCwgYXJndW1lbnRzKVxuICAgICAgICA6IGZuLmNhbGwoY3R4LCBhKVxuICAgICAgOiBmbi5jYWxsKGN0eClcbiAgfVxuICAvLyByZWNvcmQgb3JpZ2luYWwgZm4gbGVuZ3RoXG4gIGJvdW5kRm4uX2xlbmd0aCA9IGZuLmxlbmd0aDtcbiAgcmV0dXJuIGJvdW5kRm5cbn1cblxuLyoqXG4gKiBDb252ZXJ0IGFuIEFycmF5LWxpa2Ugb2JqZWN0IHRvIGEgcmVhbCBBcnJheS5cbiAqL1xuZnVuY3Rpb24gdG9BcnJheSAobGlzdCwgc3RhcnQpIHtcbiAgc3RhcnQgPSBzdGFydCB8fCAwO1xuICB2YXIgaSA9IGxpc3QubGVuZ3RoIC0gc3RhcnQ7XG4gIHZhciByZXQgPSBuZXcgQXJyYXkoaSk7XG4gIHdoaWxlIChpLS0pIHtcbiAgICByZXRbaV0gPSBsaXN0W2kgKyBzdGFydF07XG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG4vKipcbiAqIE1peCBwcm9wZXJ0aWVzIGludG8gdGFyZ2V0IG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gZXh0ZW5kICh0bywgX2Zyb20pIHtcbiAgZm9yICh2YXIga2V5IGluIF9mcm9tKSB7XG4gICAgdG9ba2V5XSA9IF9mcm9tW2tleV07XG4gIH1cbiAgcmV0dXJuIHRvXG59XG5cbi8qKlxuICogUXVpY2sgb2JqZWN0IGNoZWNrIC0gdGhpcyBpcyBwcmltYXJpbHkgdXNlZCB0byB0ZWxsXG4gKiBPYmplY3RzIGZyb20gcHJpbWl0aXZlIHZhbHVlcyB3aGVuIHdlIGtub3cgdGhlIHZhbHVlXG4gKiBpcyBhIEpTT04tY29tcGxpYW50IHR5cGUuXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0IChvYmopIHtcbiAgcmV0dXJuIG9iaiAhPT0gbnVsbCAmJiB0eXBlb2Ygb2JqID09PSAnb2JqZWN0J1xufVxuXG4vKipcbiAqIFN0cmljdCBvYmplY3QgdHlwZSBjaGVjay4gT25seSByZXR1cm5zIHRydWVcbiAqIGZvciBwbGFpbiBKYXZhU2NyaXB0IG9iamVjdHMuXG4gKi9cbnZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG52YXIgT0JKRUNUX1NUUklORyA9ICdbb2JqZWN0IE9iamVjdF0nO1xuZnVuY3Rpb24gaXNQbGFpbk9iamVjdCAob2JqKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikgPT09IE9CSkVDVF9TVFJJTkdcbn1cblxuLyoqXG4gKiBNZXJnZSBhbiBBcnJheSBvZiBPYmplY3RzIGludG8gYSBzaW5nbGUgT2JqZWN0LlxuICovXG5mdW5jdGlvbiB0b09iamVjdCAoYXJyKSB7XG4gIHZhciByZXMgPSB7fTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoYXJyW2ldKSB7XG4gICAgICBleHRlbmQocmVzLCBhcnJbaV0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbi8qKlxuICogUGVyZm9ybSBubyBvcGVyYXRpb24uXG4gKi9cbmZ1bmN0aW9uIG5vb3AgKCkge31cblxuLyoqXG4gKiBBbHdheXMgcmV0dXJuIGZhbHNlLlxuICovXG52YXIgbm8gPSBmdW5jdGlvbiAoKSB7IHJldHVybiBmYWxzZTsgfTtcblxuLyoqXG4gKiBSZXR1cm4gc2FtZSB2YWx1ZVxuICovXG52YXIgaWRlbnRpdHkgPSBmdW5jdGlvbiAoXykgeyByZXR1cm4gXzsgfTtcblxuLyoqXG4gKiBHZW5lcmF0ZSBhIHN0YXRpYyBrZXlzIHN0cmluZyBmcm9tIGNvbXBpbGVyIG1vZHVsZXMuXG4gKi9cbmZ1bmN0aW9uIGdlblN0YXRpY0tleXMgKG1vZHVsZXMpIHtcbiAgcmV0dXJuIG1vZHVsZXMucmVkdWNlKGZ1bmN0aW9uIChrZXlzLCBtKSB7XG4gICAgcmV0dXJuIGtleXMuY29uY2F0KG0uc3RhdGljS2V5cyB8fCBbXSlcbiAgfSwgW10pLmpvaW4oJywnKVxufVxuXG4vKipcbiAqIENoZWNrIGlmIHR3byB2YWx1ZXMgYXJlIGxvb3NlbHkgZXF1YWwgLSB0aGF0IGlzLFxuICogaWYgdGhleSBhcmUgcGxhaW4gb2JqZWN0cywgZG8gdGhleSBoYXZlIHRoZSBzYW1lIHNoYXBlP1xuICovXG5mdW5jdGlvbiBsb29zZUVxdWFsIChhLCBiKSB7XG4gIHZhciBpc09iamVjdEEgPSBpc09iamVjdChhKTtcbiAgdmFyIGlzT2JqZWN0QiA9IGlzT2JqZWN0KGIpO1xuICBpZiAoaXNPYmplY3RBICYmIGlzT2JqZWN0Qikge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoYSkgPT09IEpTT04uc3RyaW5naWZ5KGIpXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy8gcG9zc2libGUgY2lyY3VsYXIgcmVmZXJlbmNlXG4gICAgICByZXR1cm4gYSA9PT0gYlxuICAgIH1cbiAgfSBlbHNlIGlmICghaXNPYmplY3RBICYmICFpc09iamVjdEIpIHtcbiAgICByZXR1cm4gU3RyaW5nKGEpID09PSBTdHJpbmcoYilcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5mdW5jdGlvbiBsb29zZUluZGV4T2YgKGFyciwgdmFsKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGxvb3NlRXF1YWwoYXJyW2ldLCB2YWwpKSB7IHJldHVybiBpIH1cbiAgfVxuICByZXR1cm4gLTFcbn1cblxuLyoqXG4gKiBFbnN1cmUgYSBmdW5jdGlvbiBpcyBjYWxsZWQgb25seSBvbmNlLlxuICovXG5mdW5jdGlvbiBvbmNlIChmbikge1xuICB2YXIgY2FsbGVkID0gZmFsc2U7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCFjYWxsZWQpIHtcbiAgICAgIGNhbGxlZCA9IHRydWU7XG4gICAgICBmbigpO1xuICAgIH1cbiAgfVxufVxuXG4vKiAgKi9cblxudmFyIGNvbmZpZyA9IHtcbiAgLyoqXG4gICAqIE9wdGlvbiBtZXJnZSBzdHJhdGVnaWVzICh1c2VkIGluIGNvcmUvdXRpbC9vcHRpb25zKVxuICAgKi9cbiAgb3B0aW9uTWVyZ2VTdHJhdGVnaWVzOiBPYmplY3QuY3JlYXRlKG51bGwpLFxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIHN1cHByZXNzIHdhcm5pbmdzLlxuICAgKi9cbiAgc2lsZW50OiBmYWxzZSxcblxuICAvKipcbiAgICogU2hvdyBwcm9kdWN0aW9uIG1vZGUgdGlwIG1lc3NhZ2Ugb24gYm9vdD9cbiAgICovXG4gIHByb2R1Y3Rpb25UaXA6IFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nLFxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIGVuYWJsZSBkZXZ0b29sc1xuICAgKi9cbiAgZGV2dG9vbHM6IFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nLFxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIHJlY29yZCBwZXJmXG4gICAqL1xuICBwZXJmb3JtYW5jZTogXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicsXG5cbiAgLyoqXG4gICAqIEVycm9yIGhhbmRsZXIgZm9yIHdhdGNoZXIgZXJyb3JzXG4gICAqL1xuICBlcnJvckhhbmRsZXI6IG51bGwsXG5cbiAgLyoqXG4gICAqIElnbm9yZSBjZXJ0YWluIGN1c3RvbSBlbGVtZW50c1xuICAgKi9cbiAgaWdub3JlZEVsZW1lbnRzOiBbXSxcblxuICAvKipcbiAgICogQ3VzdG9tIHVzZXIga2V5IGFsaWFzZXMgZm9yIHYtb25cbiAgICovXG4gIGtleUNvZGVzOiBPYmplY3QuY3JlYXRlKG51bGwpLFxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBhIHRhZyBpcyByZXNlcnZlZCBzbyB0aGF0IGl0IGNhbm5vdCBiZSByZWdpc3RlcmVkIGFzIGFcbiAgICogY29tcG9uZW50LiBUaGlzIGlzIHBsYXRmb3JtLWRlcGVuZGVudCBhbmQgbWF5IGJlIG92ZXJ3cml0dGVuLlxuICAgKi9cbiAgaXNSZXNlcnZlZFRhZzogbm8sXG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGEgdGFnIGlzIGFuIHVua25vd24gZWxlbWVudC5cbiAgICogUGxhdGZvcm0tZGVwZW5kZW50LlxuICAgKi9cbiAgaXNVbmtub3duRWxlbWVudDogbm8sXG5cbiAgLyoqXG4gICAqIEdldCB0aGUgbmFtZXNwYWNlIG9mIGFuIGVsZW1lbnRcbiAgICovXG4gIGdldFRhZ05hbWVzcGFjZTogbm9vcCxcblxuICAvKipcbiAgICogUGFyc2UgdGhlIHJlYWwgdGFnIG5hbWUgZm9yIHRoZSBzcGVjaWZpYyBwbGF0Zm9ybS5cbiAgICovXG4gIHBhcnNlUGxhdGZvcm1UYWdOYW1lOiBpZGVudGl0eSxcblxuICAvKipcbiAgICogQ2hlY2sgaWYgYW4gYXR0cmlidXRlIG11c3QgYmUgYm91bmQgdXNpbmcgcHJvcGVydHksIGUuZy4gdmFsdWVcbiAgICogUGxhdGZvcm0tZGVwZW5kZW50LlxuICAgKi9cbiAgbXVzdFVzZVByb3A6IG5vLFxuXG4gIC8qKlxuICAgKiBMaXN0IG9mIGFzc2V0IHR5cGVzIHRoYXQgYSBjb21wb25lbnQgY2FuIG93bi5cbiAgICovXG4gIF9hc3NldFR5cGVzOiBbXG4gICAgJ2NvbXBvbmVudCcsXG4gICAgJ2RpcmVjdGl2ZScsXG4gICAgJ2ZpbHRlcidcbiAgXSxcblxuICAvKipcbiAgICogTGlzdCBvZiBsaWZlY3ljbGUgaG9va3MuXG4gICAqL1xuICBfbGlmZWN5Y2xlSG9va3M6IFtcbiAgICAnYmVmb3JlQ3JlYXRlJyxcbiAgICAnY3JlYXRlZCcsXG4gICAgJ2JlZm9yZU1vdW50JyxcbiAgICAnbW91bnRlZCcsXG4gICAgJ2JlZm9yZVVwZGF0ZScsXG4gICAgJ3VwZGF0ZWQnLFxuICAgICdiZWZvcmVEZXN0cm95JyxcbiAgICAnZGVzdHJveWVkJyxcbiAgICAnYWN0aXZhdGVkJyxcbiAgICAnZGVhY3RpdmF0ZWQnXG4gIF0sXG5cbiAgLyoqXG4gICAqIE1heCBjaXJjdWxhciB1cGRhdGVzIGFsbG93ZWQgaW4gYSBzY2hlZHVsZXIgZmx1c2ggY3ljbGUuXG4gICAqL1xuICBfbWF4VXBkYXRlQ291bnQ6IDEwMFxufTtcblxuLyogICovXG4vKiBnbG9iYWxzIE11dGF0aW9uT2JzZXJ2ZXIgKi9cblxuLy8gY2FuIHdlIHVzZSBfX3Byb3RvX18/XG52YXIgaGFzUHJvdG8gPSAnX19wcm90b19fJyBpbiB7fTtcblxuLy8gQnJvd3NlciBlbnZpcm9ubWVudCBzbmlmZmluZ1xudmFyIGluQnJvd3NlciA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnO1xudmFyIFVBID0gaW5Ccm93c2VyICYmIHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCk7XG52YXIgaXNJRSA9IFVBICYmIC9tc2llfHRyaWRlbnQvLnRlc3QoVUEpO1xudmFyIGlzSUU5ID0gVUEgJiYgVUEuaW5kZXhPZignbXNpZSA5LjAnKSA+IDA7XG52YXIgaXNFZGdlID0gVUEgJiYgVUEuaW5kZXhPZignZWRnZS8nKSA+IDA7XG52YXIgaXNBbmRyb2lkID0gVUEgJiYgVUEuaW5kZXhPZignYW5kcm9pZCcpID4gMDtcbnZhciBpc0lPUyA9IFVBICYmIC9pcGhvbmV8aXBhZHxpcG9kfGlvcy8udGVzdChVQSk7XG52YXIgaXNDaHJvbWUgPSBVQSAmJiAvY2hyb21lXFwvXFxkKy8udGVzdChVQSkgJiYgIWlzRWRnZTtcblxuLy8gdGhpcyBuZWVkcyB0byBiZSBsYXp5LWV2YWxlZCBiZWNhdXNlIHZ1ZSBtYXkgYmUgcmVxdWlyZWQgYmVmb3JlXG4vLyB2dWUtc2VydmVyLXJlbmRlcmVyIGNhbiBzZXQgVlVFX0VOVlxudmFyIF9pc1NlcnZlcjtcbnZhciBpc1NlcnZlclJlbmRlcmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKF9pc1NlcnZlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgaWYgKCFpbkJyb3dzZXIgJiYgdHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIC8vIGRldGVjdCBwcmVzZW5jZSBvZiB2dWUtc2VydmVyLXJlbmRlcmVyIGFuZCBhdm9pZFxuICAgICAgLy8gV2VicGFjayBzaGltbWluZyB0aGUgcHJvY2Vzc1xuICAgICAgX2lzU2VydmVyID0gZ2xvYmFsWydwcm9jZXNzJ10uZW52LlZVRV9FTlYgPT09ICdzZXJ2ZXInO1xuICAgIH0gZWxzZSB7XG4gICAgICBfaXNTZXJ2ZXIgPSBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIF9pc1NlcnZlclxufTtcblxuLy8gZGV0ZWN0IGRldnRvb2xzXG52YXIgZGV2dG9vbHMgPSBpbkJyb3dzZXIgJiYgd2luZG93Ll9fVlVFX0RFVlRPT0xTX0dMT0JBTF9IT09LX187XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5mdW5jdGlvbiBpc05hdGl2ZSAoQ3Rvcikge1xuICByZXR1cm4gL25hdGl2ZSBjb2RlLy50ZXN0KEN0b3IudG9TdHJpbmcoKSlcbn1cblxudmFyIGhhc1N5bWJvbCA9XG4gIHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIGlzTmF0aXZlKFN5bWJvbCkgJiZcbiAgdHlwZW9mIFJlZmxlY3QgIT09ICd1bmRlZmluZWQnICYmIGlzTmF0aXZlKFJlZmxlY3Qub3duS2V5cyk7XG5cbi8qKlxuICogRGVmZXIgYSB0YXNrIHRvIGV4ZWN1dGUgaXQgYXN5bmNocm9ub3VzbHkuXG4gKi9cbnZhciBuZXh0VGljayA9IChmdW5jdGlvbiAoKSB7XG4gIHZhciBjYWxsYmFja3MgPSBbXTtcbiAgdmFyIHBlbmRpbmcgPSBmYWxzZTtcbiAgdmFyIHRpbWVyRnVuYztcblxuICBmdW5jdGlvbiBuZXh0VGlja0hhbmRsZXIgKCkge1xuICAgIHBlbmRpbmcgPSBmYWxzZTtcbiAgICB2YXIgY29waWVzID0gY2FsbGJhY2tzLnNsaWNlKDApO1xuICAgIGNhbGxiYWNrcy5sZW5ndGggPSAwO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29waWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb3BpZXNbaV0oKTtcbiAgICB9XG4gIH1cblxuICAvLyB0aGUgbmV4dFRpY2sgYmVoYXZpb3IgbGV2ZXJhZ2VzIHRoZSBtaWNyb3Rhc2sgcXVldWUsIHdoaWNoIGNhbiBiZSBhY2Nlc3NlZFxuICAvLyB2aWEgZWl0aGVyIG5hdGl2ZSBQcm9taXNlLnRoZW4gb3IgTXV0YXRpb25PYnNlcnZlci5cbiAgLy8gTXV0YXRpb25PYnNlcnZlciBoYXMgd2lkZXIgc3VwcG9ydCwgaG93ZXZlciBpdCBpcyBzZXJpb3VzbHkgYnVnZ2VkIGluXG4gIC8vIFVJV2ViVmlldyBpbiBpT1MgPj0gOS4zLjMgd2hlbiB0cmlnZ2VyZWQgaW4gdG91Y2ggZXZlbnQgaGFuZGxlcnMuIEl0XG4gIC8vIGNvbXBsZXRlbHkgc3RvcHMgd29ya2luZyBhZnRlciB0cmlnZ2VyaW5nIGEgZmV3IHRpbWVzLi4uIHNvLCBpZiBuYXRpdmVcbiAgLy8gUHJvbWlzZSBpcyBhdmFpbGFibGUsIHdlIHdpbGwgdXNlIGl0OlxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgaWYgKHR5cGVvZiBQcm9taXNlICE9PSAndW5kZWZpbmVkJyAmJiBpc05hdGl2ZShQcm9taXNlKSkge1xuICAgIHZhciBwID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgdmFyIGxvZ0Vycm9yID0gZnVuY3Rpb24gKGVycikgeyBjb25zb2xlLmVycm9yKGVycik7IH07XG4gICAgdGltZXJGdW5jID0gZnVuY3Rpb24gKCkge1xuICAgICAgcC50aGVuKG5leHRUaWNrSGFuZGxlcikuY2F0Y2gobG9nRXJyb3IpO1xuICAgICAgLy8gaW4gcHJvYmxlbWF0aWMgVUlXZWJWaWV3cywgUHJvbWlzZS50aGVuIGRvZXNuJ3QgY29tcGxldGVseSBicmVhaywgYnV0XG4gICAgICAvLyBpdCBjYW4gZ2V0IHN0dWNrIGluIGEgd2VpcmQgc3RhdGUgd2hlcmUgY2FsbGJhY2tzIGFyZSBwdXNoZWQgaW50byB0aGVcbiAgICAgIC8vIG1pY3JvdGFzayBxdWV1ZSBidXQgdGhlIHF1ZXVlIGlzbid0IGJlaW5nIGZsdXNoZWQsIHVudGlsIHRoZSBicm93c2VyXG4gICAgICAvLyBuZWVkcyB0byBkbyBzb21lIG90aGVyIHdvcmssIGUuZy4gaGFuZGxlIGEgdGltZXIuIFRoZXJlZm9yZSB3ZSBjYW5cbiAgICAgIC8vIFwiZm9yY2VcIiB0aGUgbWljcm90YXNrIHF1ZXVlIHRvIGJlIGZsdXNoZWQgYnkgYWRkaW5nIGFuIGVtcHR5IHRpbWVyLlxuICAgICAgaWYgKGlzSU9TKSB7IHNldFRpbWVvdXQobm9vcCk7IH1cbiAgICB9O1xuICB9IGVsc2UgaWYgKHR5cGVvZiBNdXRhdGlvbk9ic2VydmVyICE9PSAndW5kZWZpbmVkJyAmJiAoXG4gICAgaXNOYXRpdmUoTXV0YXRpb25PYnNlcnZlcikgfHxcbiAgICAvLyBQaGFudG9tSlMgYW5kIGlPUyA3LnhcbiAgICBNdXRhdGlvbk9ic2VydmVyLnRvU3RyaW5nKCkgPT09ICdbb2JqZWN0IE11dGF0aW9uT2JzZXJ2ZXJDb25zdHJ1Y3Rvcl0nXG4gICkpIHtcbiAgICAvLyB1c2UgTXV0YXRpb25PYnNlcnZlciB3aGVyZSBuYXRpdmUgUHJvbWlzZSBpcyBub3QgYXZhaWxhYmxlLFxuICAgIC8vIGUuZy4gUGhhbnRvbUpTIElFMTEsIGlPUzcsIEFuZHJvaWQgNC40XG4gICAgdmFyIGNvdW50ZXIgPSAxO1xuICAgIHZhciBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKG5leHRUaWNrSGFuZGxlcik7XG4gICAgdmFyIHRleHROb2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoU3RyaW5nKGNvdW50ZXIpKTtcbiAgICBvYnNlcnZlci5vYnNlcnZlKHRleHROb2RlLCB7XG4gICAgICBjaGFyYWN0ZXJEYXRhOiB0cnVlXG4gICAgfSk7XG4gICAgdGltZXJGdW5jID0gZnVuY3Rpb24gKCkge1xuICAgICAgY291bnRlciA9IChjb3VudGVyICsgMSkgJSAyO1xuICAgICAgdGV4dE5vZGUuZGF0YSA9IFN0cmluZyhjb3VudGVyKTtcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIC8vIGZhbGxiYWNrIHRvIHNldFRpbWVvdXRcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgIHRpbWVyRnVuYyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHNldFRpbWVvdXQobmV4dFRpY2tIYW5kbGVyLCAwKTtcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIHF1ZXVlTmV4dFRpY2sgKGNiLCBjdHgpIHtcbiAgICB2YXIgX3Jlc29sdmU7XG4gICAgY2FsbGJhY2tzLnB1c2goZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKGNiKSB7IGNiLmNhbGwoY3R4KTsgfVxuICAgICAgaWYgKF9yZXNvbHZlKSB7IF9yZXNvbHZlKGN0eCk7IH1cbiAgICB9KTtcbiAgICBpZiAoIXBlbmRpbmcpIHtcbiAgICAgIHBlbmRpbmcgPSB0cnVlO1xuICAgICAgdGltZXJGdW5jKCk7XG4gICAgfVxuICAgIGlmICghY2IgJiYgdHlwZW9mIFByb21pc2UgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcbiAgICAgICAgX3Jlc29sdmUgPSByZXNvbHZlO1xuICAgICAgfSlcbiAgICB9XG4gIH1cbn0pKCk7XG5cbnZhciBfU2V0O1xuLyogaXN0YW5idWwgaWdub3JlIGlmICovXG5pZiAodHlwZW9mIFNldCAhPT0gJ3VuZGVmaW5lZCcgJiYgaXNOYXRpdmUoU2V0KSkge1xuICAvLyB1c2UgbmF0aXZlIFNldCB3aGVuIGF2YWlsYWJsZS5cbiAgX1NldCA9IFNldDtcbn0gZWxzZSB7XG4gIC8vIGEgbm9uLXN0YW5kYXJkIFNldCBwb2x5ZmlsbCB0aGF0IG9ubHkgd29ya3Mgd2l0aCBwcmltaXRpdmUga2V5cy5cbiAgX1NldCA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gU2V0ICgpIHtcbiAgICAgIHRoaXMuc2V0ID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICB9XG4gICAgU2V0LnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbiBoYXMgKGtleSkge1xuICAgICAgcmV0dXJuIHRoaXMuc2V0W2tleV0gPT09IHRydWVcbiAgICB9O1xuICAgIFNldC5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gYWRkIChrZXkpIHtcbiAgICAgIHRoaXMuc2V0W2tleV0gPSB0cnVlO1xuICAgIH07XG4gICAgU2V0LnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uIGNsZWFyICgpIHtcbiAgICAgIHRoaXMuc2V0ID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIFNldDtcbiAgfSgpKTtcbn1cblxudmFyIHBlcmY7XG5cbntcbiAgcGVyZiA9IGluQnJvd3NlciAmJiB3aW5kb3cucGVyZm9ybWFuY2U7XG4gIGlmIChwZXJmICYmICghcGVyZi5tYXJrIHx8ICFwZXJmLm1lYXN1cmUpKSB7XG4gICAgcGVyZiA9IHVuZGVmaW5lZDtcbiAgfVxufVxuXG4vKiAgKi9cblxudmFyIGVtcHR5T2JqZWN0ID0gT2JqZWN0LmZyZWV6ZSh7fSk7XG5cbi8qKlxuICogQ2hlY2sgaWYgYSBzdHJpbmcgc3RhcnRzIHdpdGggJCBvciBfXG4gKi9cbmZ1bmN0aW9uIGlzUmVzZXJ2ZWQgKHN0cikge1xuICB2YXIgYyA9IChzdHIgKyAnJykuY2hhckNvZGVBdCgwKTtcbiAgcmV0dXJuIGMgPT09IDB4MjQgfHwgYyA9PT0gMHg1RlxufVxuXG4vKipcbiAqIERlZmluZSBhIHByb3BlcnR5LlxuICovXG5mdW5jdGlvbiBkZWYgKG9iaiwga2V5LCB2YWwsIGVudW1lcmFibGUpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XG4gICAgdmFsdWU6IHZhbCxcbiAgICBlbnVtZXJhYmxlOiAhIWVudW1lcmFibGUsXG4gICAgd3JpdGFibGU6IHRydWUsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xufVxuXG4vKipcbiAqIFBhcnNlIHNpbXBsZSBwYXRoLlxuICovXG52YXIgYmFpbFJFID0gL1teXFx3LiRdLztcbmZ1bmN0aW9uIHBhcnNlUGF0aCAocGF0aCkge1xuICBpZiAoYmFpbFJFLnRlc3QocGF0aCkpIHtcbiAgICByZXR1cm5cbiAgfVxuICB2YXIgc2VnbWVudHMgPSBwYXRoLnNwbGl0KCcuJyk7XG4gIHJldHVybiBmdW5jdGlvbiAob2JqKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWdtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKCFvYmopIHsgcmV0dXJuIH1cbiAgICAgIG9iaiA9IG9ialtzZWdtZW50c1tpXV07XG4gICAgfVxuICAgIHJldHVybiBvYmpcbiAgfVxufVxuXG52YXIgd2FybiA9IG5vb3A7XG52YXIgdGlwID0gbm9vcDtcbnZhciBmb3JtYXRDb21wb25lbnROYW1lO1xuXG57XG4gIHZhciBoYXNDb25zb2xlID0gdHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnO1xuICB2YXIgY2xhc3NpZnlSRSA9IC8oPzpefFstX10pKFxcdykvZztcbiAgdmFyIGNsYXNzaWZ5ID0gZnVuY3Rpb24gKHN0cikgeyByZXR1cm4gc3RyXG4gICAgLnJlcGxhY2UoY2xhc3NpZnlSRSwgZnVuY3Rpb24gKGMpIHsgcmV0dXJuIGMudG9VcHBlckNhc2UoKTsgfSlcbiAgICAucmVwbGFjZSgvWy1fXS9nLCAnJyk7IH07XG5cbiAgd2FybiA9IGZ1bmN0aW9uIChtc2csIHZtKSB7XG4gICAgaWYgKGhhc0NvbnNvbGUgJiYgKCFjb25maWcuc2lsZW50KSkge1xuICAgICAgY29uc29sZS5lcnJvcihcIltWdWUgd2Fybl06IFwiICsgbXNnICsgXCIgXCIgKyAoXG4gICAgICAgIHZtID8gZm9ybWF0TG9jYXRpb24oZm9ybWF0Q29tcG9uZW50TmFtZSh2bSkpIDogJydcbiAgICAgICkpO1xuICAgIH1cbiAgfTtcblxuICB0aXAgPSBmdW5jdGlvbiAobXNnLCB2bSkge1xuICAgIGlmIChoYXNDb25zb2xlICYmICghY29uZmlnLnNpbGVudCkpIHtcbiAgICAgIGNvbnNvbGUud2FybihcIltWdWUgdGlwXTogXCIgKyBtc2cgKyBcIiBcIiArIChcbiAgICAgICAgdm0gPyBmb3JtYXRMb2NhdGlvbihmb3JtYXRDb21wb25lbnROYW1lKHZtKSkgOiAnJ1xuICAgICAgKSk7XG4gICAgfVxuICB9O1xuXG4gIGZvcm1hdENvbXBvbmVudE5hbWUgPSBmdW5jdGlvbiAodm0sIGluY2x1ZGVGaWxlKSB7XG4gICAgaWYgKHZtLiRyb290ID09PSB2bSkge1xuICAgICAgcmV0dXJuICc8Um9vdD4nXG4gICAgfVxuICAgIHZhciBuYW1lID0gdm0uX2lzVnVlXG4gICAgICA/IHZtLiRvcHRpb25zLm5hbWUgfHwgdm0uJG9wdGlvbnMuX2NvbXBvbmVudFRhZ1xuICAgICAgOiB2bS5uYW1lO1xuXG4gICAgdmFyIGZpbGUgPSB2bS5faXNWdWUgJiYgdm0uJG9wdGlvbnMuX19maWxlO1xuICAgIGlmICghbmFtZSAmJiBmaWxlKSB7XG4gICAgICB2YXIgbWF0Y2ggPSBmaWxlLm1hdGNoKC8oW14vXFxcXF0rKVxcLnZ1ZSQvKTtcbiAgICAgIG5hbWUgPSBtYXRjaCAmJiBtYXRjaFsxXTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgKG5hbWUgPyAoXCI8XCIgKyAoY2xhc3NpZnkobmFtZSkpICsgXCI+XCIpIDogXCI8QW5vbnltb3VzPlwiKSArXG4gICAgICAoZmlsZSAmJiBpbmNsdWRlRmlsZSAhPT0gZmFsc2UgPyAoXCIgYXQgXCIgKyBmaWxlKSA6ICcnKVxuICAgIClcbiAgfTtcblxuICB2YXIgZm9ybWF0TG9jYXRpb24gPSBmdW5jdGlvbiAoc3RyKSB7XG4gICAgaWYgKHN0ciA9PT0gXCI8QW5vbnltb3VzPlwiKSB7XG4gICAgICBzdHIgKz0gXCIgLSB1c2UgdGhlIFxcXCJuYW1lXFxcIiBvcHRpb24gZm9yIGJldHRlciBkZWJ1Z2dpbmcgbWVzc2FnZXMuXCI7XG4gICAgfVxuICAgIHJldHVybiAoXCJcXG4oZm91bmQgaW4gXCIgKyBzdHIgKyBcIilcIilcbiAgfTtcbn1cblxuLyogICovXG5cblxudmFyIHVpZCQxID0gMDtcblxuLyoqXG4gKiBBIGRlcCBpcyBhbiBvYnNlcnZhYmxlIHRoYXQgY2FuIGhhdmUgbXVsdGlwbGVcbiAqIGRpcmVjdGl2ZXMgc3Vic2NyaWJpbmcgdG8gaXQuXG4gKi9cbnZhciBEZXAgPSBmdW5jdGlvbiBEZXAgKCkge1xuICB0aGlzLmlkID0gdWlkJDErKztcbiAgdGhpcy5zdWJzID0gW107XG59O1xuXG5EZXAucHJvdG90eXBlLmFkZFN1YiA9IGZ1bmN0aW9uIGFkZFN1YiAoc3ViKSB7XG4gIHRoaXMuc3Vicy5wdXNoKHN1Yik7XG59O1xuXG5EZXAucHJvdG90eXBlLnJlbW92ZVN1YiA9IGZ1bmN0aW9uIHJlbW92ZVN1YiAoc3ViKSB7XG4gIHJlbW92ZSh0aGlzLnN1YnMsIHN1Yik7XG59O1xuXG5EZXAucHJvdG90eXBlLmRlcGVuZCA9IGZ1bmN0aW9uIGRlcGVuZCAoKSB7XG4gIGlmIChEZXAudGFyZ2V0KSB7XG4gICAgRGVwLnRhcmdldC5hZGREZXAodGhpcyk7XG4gIH1cbn07XG5cbkRlcC5wcm90b3R5cGUubm90aWZ5ID0gZnVuY3Rpb24gbm90aWZ5ICgpIHtcbiAgLy8gc3RhYmlsaXplIHRoZSBzdWJzY3JpYmVyIGxpc3QgZmlyc3RcbiAgdmFyIHN1YnMgPSB0aGlzLnN1YnMuc2xpY2UoKTtcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBzdWJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIHN1YnNbaV0udXBkYXRlKCk7XG4gIH1cbn07XG5cbi8vIHRoZSBjdXJyZW50IHRhcmdldCB3YXRjaGVyIGJlaW5nIGV2YWx1YXRlZC5cbi8vIHRoaXMgaXMgZ2xvYmFsbHkgdW5pcXVlIGJlY2F1c2UgdGhlcmUgY291bGQgYmUgb25seSBvbmVcbi8vIHdhdGNoZXIgYmVpbmcgZXZhbHVhdGVkIGF0IGFueSB0aW1lLlxuRGVwLnRhcmdldCA9IG51bGw7XG52YXIgdGFyZ2V0U3RhY2sgPSBbXTtcblxuZnVuY3Rpb24gcHVzaFRhcmdldCAoX3RhcmdldCkge1xuICBpZiAoRGVwLnRhcmdldCkgeyB0YXJnZXRTdGFjay5wdXNoKERlcC50YXJnZXQpOyB9XG4gIERlcC50YXJnZXQgPSBfdGFyZ2V0O1xufVxuXG5mdW5jdGlvbiBwb3BUYXJnZXQgKCkge1xuICBEZXAudGFyZ2V0ID0gdGFyZ2V0U3RhY2sucG9wKCk7XG59XG5cbi8qXG4gKiBub3QgdHlwZSBjaGVja2luZyB0aGlzIGZpbGUgYmVjYXVzZSBmbG93IGRvZXNuJ3QgcGxheSB3ZWxsIHdpdGhcbiAqIGR5bmFtaWNhbGx5IGFjY2Vzc2luZyBtZXRob2RzIG9uIEFycmF5IHByb3RvdHlwZVxuICovXG5cbnZhciBhcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xudmFyIGFycmF5TWV0aG9kcyA9IE9iamVjdC5jcmVhdGUoYXJyYXlQcm90byk7W1xuICAncHVzaCcsXG4gICdwb3AnLFxuICAnc2hpZnQnLFxuICAndW5zaGlmdCcsXG4gICdzcGxpY2UnLFxuICAnc29ydCcsXG4gICdyZXZlcnNlJ1xuXVxuLmZvckVhY2goZnVuY3Rpb24gKG1ldGhvZCkge1xuICAvLyBjYWNoZSBvcmlnaW5hbCBtZXRob2RcbiAgdmFyIG9yaWdpbmFsID0gYXJyYXlQcm90b1ttZXRob2RdO1xuICBkZWYoYXJyYXlNZXRob2RzLCBtZXRob2QsIGZ1bmN0aW9uIG11dGF0b3IgKCkge1xuICAgIHZhciBhcmd1bWVudHMkMSA9IGFyZ3VtZW50cztcblxuICAgIC8vIGF2b2lkIGxlYWtpbmcgYXJndW1lbnRzOlxuICAgIC8vIGh0dHA6Ly9qc3BlcmYuY29tL2Nsb3N1cmUtd2l0aC1hcmd1bWVudHNcbiAgICB2YXIgaSA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoaSk7XG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgYXJnc1tpXSA9IGFyZ3VtZW50cyQxW2ldO1xuICAgIH1cbiAgICB2YXIgcmVzdWx0ID0gb3JpZ2luYWwuYXBwbHkodGhpcywgYXJncyk7XG4gICAgdmFyIG9iID0gdGhpcy5fX29iX187XG4gICAgdmFyIGluc2VydGVkO1xuICAgIHN3aXRjaCAobWV0aG9kKSB7XG4gICAgICBjYXNlICdwdXNoJzpcbiAgICAgICAgaW5zZXJ0ZWQgPSBhcmdzO1xuICAgICAgICBicmVha1xuICAgICAgY2FzZSAndW5zaGlmdCc6XG4gICAgICAgIGluc2VydGVkID0gYXJncztcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgJ3NwbGljZSc6XG4gICAgICAgIGluc2VydGVkID0gYXJncy5zbGljZSgyKTtcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gICAgaWYgKGluc2VydGVkKSB7IG9iLm9ic2VydmVBcnJheShpbnNlcnRlZCk7IH1cbiAgICAvLyBub3RpZnkgY2hhbmdlXG4gICAgb2IuZGVwLm5vdGlmeSgpO1xuICAgIHJldHVybiByZXN1bHRcbiAgfSk7XG59KTtcblxuLyogICovXG5cbnZhciBhcnJheUtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhhcnJheU1ldGhvZHMpO1xuXG4vKipcbiAqIEJ5IGRlZmF1bHQsIHdoZW4gYSByZWFjdGl2ZSBwcm9wZXJ0eSBpcyBzZXQsIHRoZSBuZXcgdmFsdWUgaXNcbiAqIGFsc28gY29udmVydGVkIHRvIGJlY29tZSByZWFjdGl2ZS4gSG93ZXZlciB3aGVuIHBhc3NpbmcgZG93biBwcm9wcyxcbiAqIHdlIGRvbid0IHdhbnQgdG8gZm9yY2UgY29udmVyc2lvbiBiZWNhdXNlIHRoZSB2YWx1ZSBtYXkgYmUgYSBuZXN0ZWQgdmFsdWVcbiAqIHVuZGVyIGEgZnJvemVuIGRhdGEgc3RydWN0dXJlLiBDb252ZXJ0aW5nIGl0IHdvdWxkIGRlZmVhdCB0aGUgb3B0aW1pemF0aW9uLlxuICovXG52YXIgb2JzZXJ2ZXJTdGF0ZSA9IHtcbiAgc2hvdWxkQ29udmVydDogdHJ1ZSxcbiAgaXNTZXR0aW5nUHJvcHM6IGZhbHNlXG59O1xuXG4vKipcbiAqIE9ic2VydmVyIGNsYXNzIHRoYXQgYXJlIGF0dGFjaGVkIHRvIGVhY2ggb2JzZXJ2ZWRcbiAqIG9iamVjdC4gT25jZSBhdHRhY2hlZCwgdGhlIG9ic2VydmVyIGNvbnZlcnRzIHRhcmdldFxuICogb2JqZWN0J3MgcHJvcGVydHkga2V5cyBpbnRvIGdldHRlci9zZXR0ZXJzIHRoYXRcbiAqIGNvbGxlY3QgZGVwZW5kZW5jaWVzIGFuZCBkaXNwYXRjaGVzIHVwZGF0ZXMuXG4gKi9cbnZhciBPYnNlcnZlciA9IGZ1bmN0aW9uIE9ic2VydmVyICh2YWx1ZSkge1xuICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gIHRoaXMuZGVwID0gbmV3IERlcCgpO1xuICB0aGlzLnZtQ291bnQgPSAwO1xuICBkZWYodmFsdWUsICdfX29iX18nLCB0aGlzKTtcbiAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgdmFyIGF1Z21lbnQgPSBoYXNQcm90b1xuICAgICAgPyBwcm90b0F1Z21lbnRcbiAgICAgIDogY29weUF1Z21lbnQ7XG4gICAgYXVnbWVudCh2YWx1ZSwgYXJyYXlNZXRob2RzLCBhcnJheUtleXMpO1xuICAgIHRoaXMub2JzZXJ2ZUFycmF5KHZhbHVlKTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLndhbGsodmFsdWUpO1xuICB9XG59O1xuXG4vKipcbiAqIFdhbGsgdGhyb3VnaCBlYWNoIHByb3BlcnR5IGFuZCBjb252ZXJ0IHRoZW0gaW50b1xuICogZ2V0dGVyL3NldHRlcnMuIFRoaXMgbWV0aG9kIHNob3VsZCBvbmx5IGJlIGNhbGxlZCB3aGVuXG4gKiB2YWx1ZSB0eXBlIGlzIE9iamVjdC5cbiAqL1xuT2JzZXJ2ZXIucHJvdG90eXBlLndhbGsgPSBmdW5jdGlvbiB3YWxrIChvYmopIHtcbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvYmopO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICBkZWZpbmVSZWFjdGl2ZSQkMShvYmosIGtleXNbaV0sIG9ialtrZXlzW2ldXSk7XG4gIH1cbn07XG5cbi8qKlxuICogT2JzZXJ2ZSBhIGxpc3Qgb2YgQXJyYXkgaXRlbXMuXG4gKi9cbk9ic2VydmVyLnByb3RvdHlwZS5vYnNlcnZlQXJyYXkgPSBmdW5jdGlvbiBvYnNlcnZlQXJyYXkgKGl0ZW1zKSB7XG4gIGZvciAodmFyIGkgPSAwLCBsID0gaXRlbXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgb2JzZXJ2ZShpdGVtc1tpXSk7XG4gIH1cbn07XG5cbi8vIGhlbHBlcnNcblxuLyoqXG4gKiBBdWdtZW50IGFuIHRhcmdldCBPYmplY3Qgb3IgQXJyYXkgYnkgaW50ZXJjZXB0aW5nXG4gKiB0aGUgcHJvdG90eXBlIGNoYWluIHVzaW5nIF9fcHJvdG9fX1xuICovXG5mdW5jdGlvbiBwcm90b0F1Z21lbnQgKHRhcmdldCwgc3JjKSB7XG4gIC8qIGVzbGludC1kaXNhYmxlIG5vLXByb3RvICovXG4gIHRhcmdldC5fX3Byb3RvX18gPSBzcmM7XG4gIC8qIGVzbGludC1lbmFibGUgbm8tcHJvdG8gKi9cbn1cblxuLyoqXG4gKiBBdWdtZW50IGFuIHRhcmdldCBPYmplY3Qgb3IgQXJyYXkgYnkgZGVmaW5pbmdcbiAqIGhpZGRlbiBwcm9wZXJ0aWVzLlxuICovXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuZnVuY3Rpb24gY29weUF1Z21lbnQgKHRhcmdldCwgc3JjLCBrZXlzKSB7XG4gIGZvciAodmFyIGkgPSAwLCBsID0ga2V5cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICB2YXIga2V5ID0ga2V5c1tpXTtcbiAgICBkZWYodGFyZ2V0LCBrZXksIHNyY1trZXldKTtcbiAgfVxufVxuXG4vKipcbiAqIEF0dGVtcHQgdG8gY3JlYXRlIGFuIG9ic2VydmVyIGluc3RhbmNlIGZvciBhIHZhbHVlLFxuICogcmV0dXJucyB0aGUgbmV3IG9ic2VydmVyIGlmIHN1Y2Nlc3NmdWxseSBvYnNlcnZlZCxcbiAqIG9yIHRoZSBleGlzdGluZyBvYnNlcnZlciBpZiB0aGUgdmFsdWUgYWxyZWFkeSBoYXMgb25lLlxuICovXG5mdW5jdGlvbiBvYnNlcnZlICh2YWx1ZSwgYXNSb290RGF0YSkge1xuICBpZiAoIWlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHJldHVyblxuICB9XG4gIHZhciBvYjtcbiAgaWYgKGhhc093bih2YWx1ZSwgJ19fb2JfXycpICYmIHZhbHVlLl9fb2JfXyBpbnN0YW5jZW9mIE9ic2VydmVyKSB7XG4gICAgb2IgPSB2YWx1ZS5fX29iX187XG4gIH0gZWxzZSBpZiAoXG4gICAgb2JzZXJ2ZXJTdGF0ZS5zaG91bGRDb252ZXJ0ICYmXG4gICAgIWlzU2VydmVyUmVuZGVyaW5nKCkgJiZcbiAgICAoQXJyYXkuaXNBcnJheSh2YWx1ZSkgfHwgaXNQbGFpbk9iamVjdCh2YWx1ZSkpICYmXG4gICAgT2JqZWN0LmlzRXh0ZW5zaWJsZSh2YWx1ZSkgJiZcbiAgICAhdmFsdWUuX2lzVnVlXG4gICkge1xuICAgIG9iID0gbmV3IE9ic2VydmVyKHZhbHVlKTtcbiAgfVxuICBpZiAoYXNSb290RGF0YSAmJiBvYikge1xuICAgIG9iLnZtQ291bnQrKztcbiAgfVxuICByZXR1cm4gb2Jcbn1cblxuLyoqXG4gKiBEZWZpbmUgYSByZWFjdGl2ZSBwcm9wZXJ0eSBvbiBhbiBPYmplY3QuXG4gKi9cbmZ1bmN0aW9uIGRlZmluZVJlYWN0aXZlJCQxIChcbiAgb2JqLFxuICBrZXksXG4gIHZhbCxcbiAgY3VzdG9tU2V0dGVyXG4pIHtcbiAgdmFyIGRlcCA9IG5ldyBEZXAoKTtcblxuICB2YXIgcHJvcGVydHkgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwga2V5KTtcbiAgaWYgKHByb3BlcnR5ICYmIHByb3BlcnR5LmNvbmZpZ3VyYWJsZSA9PT0gZmFsc2UpIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIC8vIGNhdGVyIGZvciBwcmUtZGVmaW5lZCBnZXR0ZXIvc2V0dGVyc1xuICB2YXIgZ2V0dGVyID0gcHJvcGVydHkgJiYgcHJvcGVydHkuZ2V0O1xuICB2YXIgc2V0dGVyID0gcHJvcGVydHkgJiYgcHJvcGVydHkuc2V0O1xuXG4gIHZhciBjaGlsZE9iID0gb2JzZXJ2ZSh2YWwpO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHtcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBnZXQ6IGZ1bmN0aW9uIHJlYWN0aXZlR2V0dGVyICgpIHtcbiAgICAgIHZhciB2YWx1ZSA9IGdldHRlciA/IGdldHRlci5jYWxsKG9iaikgOiB2YWw7XG4gICAgICBpZiAoRGVwLnRhcmdldCkge1xuICAgICAgICBkZXAuZGVwZW5kKCk7XG4gICAgICAgIGlmIChjaGlsZE9iKSB7XG4gICAgICAgICAgY2hpbGRPYi5kZXAuZGVwZW5kKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgZGVwZW5kQXJyYXkodmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsdWVcbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24gcmVhY3RpdmVTZXR0ZXIgKG5ld1ZhbCkge1xuICAgICAgdmFyIHZhbHVlID0gZ2V0dGVyID8gZ2V0dGVyLmNhbGwob2JqKSA6IHZhbDtcbiAgICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLXNlbGYtY29tcGFyZSAqL1xuICAgICAgaWYgKG5ld1ZhbCA9PT0gdmFsdWUgfHwgKG5ld1ZhbCAhPT0gbmV3VmFsICYmIHZhbHVlICE9PSB2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLXNlbGYtY29tcGFyZSAqL1xuICAgICAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmIGN1c3RvbVNldHRlcikge1xuICAgICAgICBjdXN0b21TZXR0ZXIoKTtcbiAgICAgIH1cbiAgICAgIGlmIChzZXR0ZXIpIHtcbiAgICAgICAgc2V0dGVyLmNhbGwob2JqLCBuZXdWYWwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsID0gbmV3VmFsO1xuICAgICAgfVxuICAgICAgY2hpbGRPYiA9IG9ic2VydmUobmV3VmFsKTtcbiAgICAgIGRlcC5ub3RpZnkoKTtcbiAgICB9XG4gIH0pO1xufVxuXG4vKipcbiAqIFNldCBhIHByb3BlcnR5IG9uIGFuIG9iamVjdC4gQWRkcyB0aGUgbmV3IHByb3BlcnR5IGFuZFxuICogdHJpZ2dlcnMgY2hhbmdlIG5vdGlmaWNhdGlvbiBpZiB0aGUgcHJvcGVydHkgZG9lc24ndFxuICogYWxyZWFkeSBleGlzdC5cbiAqL1xuZnVuY3Rpb24gc2V0ICh0YXJnZXQsIGtleSwgdmFsKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KHRhcmdldCkpIHtcbiAgICB0YXJnZXQubGVuZ3RoID0gTWF0aC5tYXgodGFyZ2V0Lmxlbmd0aCwga2V5KTtcbiAgICB0YXJnZXQuc3BsaWNlKGtleSwgMSwgdmFsKTtcbiAgICByZXR1cm4gdmFsXG4gIH1cbiAgaWYgKGhhc093bih0YXJnZXQsIGtleSkpIHtcbiAgICB0YXJnZXRba2V5XSA9IHZhbDtcbiAgICByZXR1cm4gdmFsXG4gIH1cbiAgdmFyIG9iID0gdGFyZ2V0Ll9fb2JfXztcbiAgaWYgKHRhcmdldC5faXNWdWUgfHwgKG9iICYmIG9iLnZtQ291bnQpKSB7XG4gICAgXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiYgd2FybihcbiAgICAgICdBdm9pZCBhZGRpbmcgcmVhY3RpdmUgcHJvcGVydGllcyB0byBhIFZ1ZSBpbnN0YW5jZSBvciBpdHMgcm9vdCAkZGF0YSAnICtcbiAgICAgICdhdCBydW50aW1lIC0gZGVjbGFyZSBpdCB1cGZyb250IGluIHRoZSBkYXRhIG9wdGlvbi4nXG4gICAgKTtcbiAgICByZXR1cm4gdmFsXG4gIH1cbiAgaWYgKCFvYikge1xuICAgIHRhcmdldFtrZXldID0gdmFsO1xuICAgIHJldHVybiB2YWxcbiAgfVxuICBkZWZpbmVSZWFjdGl2ZSQkMShvYi52YWx1ZSwga2V5LCB2YWwpO1xuICBvYi5kZXAubm90aWZ5KCk7XG4gIHJldHVybiB2YWxcbn1cblxuLyoqXG4gKiBEZWxldGUgYSBwcm9wZXJ0eSBhbmQgdHJpZ2dlciBjaGFuZ2UgaWYgbmVjZXNzYXJ5LlxuICovXG5mdW5jdGlvbiBkZWwgKHRhcmdldCwga2V5KSB7XG4gIGlmIChBcnJheS5pc0FycmF5KHRhcmdldCkpIHtcbiAgICB0YXJnZXQuc3BsaWNlKGtleSwgMSk7XG4gICAgcmV0dXJuXG4gIH1cbiAgdmFyIG9iID0gdGFyZ2V0Ll9fb2JfXztcbiAgaWYgKHRhcmdldC5faXNWdWUgfHwgKG9iICYmIG9iLnZtQ291bnQpKSB7XG4gICAgXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiYgd2FybihcbiAgICAgICdBdm9pZCBkZWxldGluZyBwcm9wZXJ0aWVzIG9uIGEgVnVlIGluc3RhbmNlIG9yIGl0cyByb290ICRkYXRhICcgK1xuICAgICAgJy0ganVzdCBzZXQgaXQgdG8gbnVsbC4nXG4gICAgKTtcbiAgICByZXR1cm5cbiAgfVxuICBpZiAoIWhhc093bih0YXJnZXQsIGtleSkpIHtcbiAgICByZXR1cm5cbiAgfVxuICBkZWxldGUgdGFyZ2V0W2tleV07XG4gIGlmICghb2IpIHtcbiAgICByZXR1cm5cbiAgfVxuICBvYi5kZXAubm90aWZ5KCk7XG59XG5cbi8qKlxuICogQ29sbGVjdCBkZXBlbmRlbmNpZXMgb24gYXJyYXkgZWxlbWVudHMgd2hlbiB0aGUgYXJyYXkgaXMgdG91Y2hlZCwgc2luY2VcbiAqIHdlIGNhbm5vdCBpbnRlcmNlcHQgYXJyYXkgZWxlbWVudCBhY2Nlc3MgbGlrZSBwcm9wZXJ0eSBnZXR0ZXJzLlxuICovXG5mdW5jdGlvbiBkZXBlbmRBcnJheSAodmFsdWUpIHtcbiAgZm9yICh2YXIgZSA9ICh2b2lkIDApLCBpID0gMCwgbCA9IHZhbHVlLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGUgPSB2YWx1ZVtpXTtcbiAgICBlICYmIGUuX19vYl9fICYmIGUuX19vYl9fLmRlcC5kZXBlbmQoKTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShlKSkge1xuICAgICAgZGVwZW5kQXJyYXkoZSk7XG4gICAgfVxuICB9XG59XG5cbi8qICAqL1xuXG4vKipcbiAqIE9wdGlvbiBvdmVyd3JpdGluZyBzdHJhdGVnaWVzIGFyZSBmdW5jdGlvbnMgdGhhdCBoYW5kbGVcbiAqIGhvdyB0byBtZXJnZSBhIHBhcmVudCBvcHRpb24gdmFsdWUgYW5kIGEgY2hpbGQgb3B0aW9uXG4gKiB2YWx1ZSBpbnRvIHRoZSBmaW5hbCB2YWx1ZS5cbiAqL1xudmFyIHN0cmF0cyA9IGNvbmZpZy5vcHRpb25NZXJnZVN0cmF0ZWdpZXM7XG5cbi8qKlxuICogT3B0aW9ucyB3aXRoIHJlc3RyaWN0aW9uc1xuICovXG57XG4gIHN0cmF0cy5lbCA9IHN0cmF0cy5wcm9wc0RhdGEgPSBmdW5jdGlvbiAocGFyZW50LCBjaGlsZCwgdm0sIGtleSkge1xuICAgIGlmICghdm0pIHtcbiAgICAgIHdhcm4oXG4gICAgICAgIFwib3B0aW9uIFxcXCJcIiArIGtleSArIFwiXFxcIiBjYW4gb25seSBiZSB1c2VkIGR1cmluZyBpbnN0YW5jZSBcIiArXG4gICAgICAgICdjcmVhdGlvbiB3aXRoIHRoZSBgbmV3YCBrZXl3b3JkLidcbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiBkZWZhdWx0U3RyYXQocGFyZW50LCBjaGlsZClcbiAgfTtcbn1cblxuLyoqXG4gKiBIZWxwZXIgdGhhdCByZWN1cnNpdmVseSBtZXJnZXMgdHdvIGRhdGEgb2JqZWN0cyB0b2dldGhlci5cbiAqL1xuZnVuY3Rpb24gbWVyZ2VEYXRhICh0bywgZnJvbSkge1xuICBpZiAoIWZyb20pIHsgcmV0dXJuIHRvIH1cbiAgdmFyIGtleSwgdG9WYWwsIGZyb21WYWw7XG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMoZnJvbSk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgIGtleSA9IGtleXNbaV07XG4gICAgdG9WYWwgPSB0b1trZXldO1xuICAgIGZyb21WYWwgPSBmcm9tW2tleV07XG4gICAgaWYgKCFoYXNPd24odG8sIGtleSkpIHtcbiAgICAgIHNldCh0bywga2V5LCBmcm9tVmFsKTtcbiAgICB9IGVsc2UgaWYgKGlzUGxhaW5PYmplY3QodG9WYWwpICYmIGlzUGxhaW5PYmplY3QoZnJvbVZhbCkpIHtcbiAgICAgIG1lcmdlRGF0YSh0b1ZhbCwgZnJvbVZhbCk7XG4gICAgfVxuICB9XG4gIHJldHVybiB0b1xufVxuXG4vKipcbiAqIERhdGFcbiAqL1xuc3RyYXRzLmRhdGEgPSBmdW5jdGlvbiAoXG4gIHBhcmVudFZhbCxcbiAgY2hpbGRWYWwsXG4gIHZtXG4pIHtcbiAgaWYgKCF2bSkge1xuICAgIC8vIGluIGEgVnVlLmV4dGVuZCBtZXJnZSwgYm90aCBzaG91bGQgYmUgZnVuY3Rpb25zXG4gICAgaWYgKCFjaGlsZFZhbCkge1xuICAgICAgcmV0dXJuIHBhcmVudFZhbFxuICAgIH1cbiAgICBpZiAodHlwZW9mIGNoaWxkVmFsICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICBcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiB3YXJuKFxuICAgICAgICAnVGhlIFwiZGF0YVwiIG9wdGlvbiBzaG91bGQgYmUgYSBmdW5jdGlvbiAnICtcbiAgICAgICAgJ3RoYXQgcmV0dXJucyBhIHBlci1pbnN0YW5jZSB2YWx1ZSBpbiBjb21wb25lbnQgJyArXG4gICAgICAgICdkZWZpbml0aW9ucy4nLFxuICAgICAgICB2bVxuICAgICAgKTtcbiAgICAgIHJldHVybiBwYXJlbnRWYWxcbiAgICB9XG4gICAgaWYgKCFwYXJlbnRWYWwpIHtcbiAgICAgIHJldHVybiBjaGlsZFZhbFxuICAgIH1cbiAgICAvLyB3aGVuIHBhcmVudFZhbCAmIGNoaWxkVmFsIGFyZSBib3RoIHByZXNlbnQsXG4gICAgLy8gd2UgbmVlZCB0byByZXR1cm4gYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlXG4gICAgLy8gbWVyZ2VkIHJlc3VsdCBvZiBib3RoIGZ1bmN0aW9ucy4uLiBubyBuZWVkIHRvXG4gICAgLy8gY2hlY2sgaWYgcGFyZW50VmFsIGlzIGEgZnVuY3Rpb24gaGVyZSBiZWNhdXNlXG4gICAgLy8gaXQgaGFzIHRvIGJlIGEgZnVuY3Rpb24gdG8gcGFzcyBwcmV2aW91cyBtZXJnZXMuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG1lcmdlZERhdGFGbiAoKSB7XG4gICAgICByZXR1cm4gbWVyZ2VEYXRhKFxuICAgICAgICBjaGlsZFZhbC5jYWxsKHRoaXMpLFxuICAgICAgICBwYXJlbnRWYWwuY2FsbCh0aGlzKVxuICAgICAgKVxuICAgIH1cbiAgfSBlbHNlIGlmIChwYXJlbnRWYWwgfHwgY2hpbGRWYWwpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gbWVyZ2VkSW5zdGFuY2VEYXRhRm4gKCkge1xuICAgICAgLy8gaW5zdGFuY2UgbWVyZ2VcbiAgICAgIHZhciBpbnN0YW5jZURhdGEgPSB0eXBlb2YgY2hpbGRWYWwgPT09ICdmdW5jdGlvbidcbiAgICAgICAgPyBjaGlsZFZhbC5jYWxsKHZtKVxuICAgICAgICA6IGNoaWxkVmFsO1xuICAgICAgdmFyIGRlZmF1bHREYXRhID0gdHlwZW9mIHBhcmVudFZhbCA9PT0gJ2Z1bmN0aW9uJ1xuICAgICAgICA/IHBhcmVudFZhbC5jYWxsKHZtKVxuICAgICAgICA6IHVuZGVmaW5lZDtcbiAgICAgIGlmIChpbnN0YW5jZURhdGEpIHtcbiAgICAgICAgcmV0dXJuIG1lcmdlRGF0YShpbnN0YW5jZURhdGEsIGRlZmF1bHREYXRhKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGRlZmF1bHREYXRhXG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG4vKipcbiAqIEhvb2tzIGFuZCBwcm9wcyBhcmUgbWVyZ2VkIGFzIGFycmF5cy5cbiAqL1xuZnVuY3Rpb24gbWVyZ2VIb29rIChcbiAgcGFyZW50VmFsLFxuICBjaGlsZFZhbFxuKSB7XG4gIHJldHVybiBjaGlsZFZhbFxuICAgID8gcGFyZW50VmFsXG4gICAgICA/IHBhcmVudFZhbC5jb25jYXQoY2hpbGRWYWwpXG4gICAgICA6IEFycmF5LmlzQXJyYXkoY2hpbGRWYWwpXG4gICAgICAgID8gY2hpbGRWYWxcbiAgICAgICAgOiBbY2hpbGRWYWxdXG4gICAgOiBwYXJlbnRWYWxcbn1cblxuY29uZmlnLl9saWZlY3ljbGVIb29rcy5mb3JFYWNoKGZ1bmN0aW9uIChob29rKSB7XG4gIHN0cmF0c1tob29rXSA9IG1lcmdlSG9vaztcbn0pO1xuXG4vKipcbiAqIEFzc2V0c1xuICpcbiAqIFdoZW4gYSB2bSBpcyBwcmVzZW50IChpbnN0YW5jZSBjcmVhdGlvbiksIHdlIG5lZWQgdG8gZG9cbiAqIGEgdGhyZWUtd2F5IG1lcmdlIGJldHdlZW4gY29uc3RydWN0b3Igb3B0aW9ucywgaW5zdGFuY2VcbiAqIG9wdGlvbnMgYW5kIHBhcmVudCBvcHRpb25zLlxuICovXG5mdW5jdGlvbiBtZXJnZUFzc2V0cyAocGFyZW50VmFsLCBjaGlsZFZhbCkge1xuICB2YXIgcmVzID0gT2JqZWN0LmNyZWF0ZShwYXJlbnRWYWwgfHwgbnVsbCk7XG4gIHJldHVybiBjaGlsZFZhbFxuICAgID8gZXh0ZW5kKHJlcywgY2hpbGRWYWwpXG4gICAgOiByZXNcbn1cblxuY29uZmlnLl9hc3NldFR5cGVzLmZvckVhY2goZnVuY3Rpb24gKHR5cGUpIHtcbiAgc3RyYXRzW3R5cGUgKyAncyddID0gbWVyZ2VBc3NldHM7XG59KTtcblxuLyoqXG4gKiBXYXRjaGVycy5cbiAqXG4gKiBXYXRjaGVycyBoYXNoZXMgc2hvdWxkIG5vdCBvdmVyd3JpdGUgb25lXG4gKiBhbm90aGVyLCBzbyB3ZSBtZXJnZSB0aGVtIGFzIGFycmF5cy5cbiAqL1xuc3RyYXRzLndhdGNoID0gZnVuY3Rpb24gKHBhcmVudFZhbCwgY2hpbGRWYWwpIHtcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gIGlmICghY2hpbGRWYWwpIHsgcmV0dXJuIE9iamVjdC5jcmVhdGUocGFyZW50VmFsIHx8IG51bGwpIH1cbiAgaWYgKCFwYXJlbnRWYWwpIHsgcmV0dXJuIGNoaWxkVmFsIH1cbiAgdmFyIHJldCA9IHt9O1xuICBleHRlbmQocmV0LCBwYXJlbnRWYWwpO1xuICBmb3IgKHZhciBrZXkgaW4gY2hpbGRWYWwpIHtcbiAgICB2YXIgcGFyZW50ID0gcmV0W2tleV07XG4gICAgdmFyIGNoaWxkID0gY2hpbGRWYWxba2V5XTtcbiAgICBpZiAocGFyZW50ICYmICFBcnJheS5pc0FycmF5KHBhcmVudCkpIHtcbiAgICAgIHBhcmVudCA9IFtwYXJlbnRdO1xuICAgIH1cbiAgICByZXRba2V5XSA9IHBhcmVudFxuICAgICAgPyBwYXJlbnQuY29uY2F0KGNoaWxkKVxuICAgICAgOiBbY2hpbGRdO1xuICB9XG4gIHJldHVybiByZXRcbn07XG5cbi8qKlxuICogT3RoZXIgb2JqZWN0IGhhc2hlcy5cbiAqL1xuc3RyYXRzLnByb3BzID1cbnN0cmF0cy5tZXRob2RzID1cbnN0cmF0cy5jb21wdXRlZCA9IGZ1bmN0aW9uIChwYXJlbnRWYWwsIGNoaWxkVmFsKSB7XG4gIGlmICghY2hpbGRWYWwpIHsgcmV0dXJuIE9iamVjdC5jcmVhdGUocGFyZW50VmFsIHx8IG51bGwpIH1cbiAgaWYgKCFwYXJlbnRWYWwpIHsgcmV0dXJuIGNoaWxkVmFsIH1cbiAgdmFyIHJldCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIGV4dGVuZChyZXQsIHBhcmVudFZhbCk7XG4gIGV4dGVuZChyZXQsIGNoaWxkVmFsKTtcbiAgcmV0dXJuIHJldFxufTtcblxuLyoqXG4gKiBEZWZhdWx0IHN0cmF0ZWd5LlxuICovXG52YXIgZGVmYXVsdFN0cmF0ID0gZnVuY3Rpb24gKHBhcmVudFZhbCwgY2hpbGRWYWwpIHtcbiAgcmV0dXJuIGNoaWxkVmFsID09PSB1bmRlZmluZWRcbiAgICA/IHBhcmVudFZhbFxuICAgIDogY2hpbGRWYWxcbn07XG5cbi8qKlxuICogVmFsaWRhdGUgY29tcG9uZW50IG5hbWVzXG4gKi9cbmZ1bmN0aW9uIGNoZWNrQ29tcG9uZW50cyAob3B0aW9ucykge1xuICBmb3IgKHZhciBrZXkgaW4gb3B0aW9ucy5jb21wb25lbnRzKSB7XG4gICAgdmFyIGxvd2VyID0ga2V5LnRvTG93ZXJDYXNlKCk7XG4gICAgaWYgKGlzQnVpbHRJblRhZyhsb3dlcikgfHwgY29uZmlnLmlzUmVzZXJ2ZWRUYWcobG93ZXIpKSB7XG4gICAgICB3YXJuKFxuICAgICAgICAnRG8gbm90IHVzZSBidWlsdC1pbiBvciByZXNlcnZlZCBIVE1MIGVsZW1lbnRzIGFzIGNvbXBvbmVudCAnICtcbiAgICAgICAgJ2lkOiAnICsga2V5XG4gICAgICApO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEVuc3VyZSBhbGwgcHJvcHMgb3B0aW9uIHN5bnRheCBhcmUgbm9ybWFsaXplZCBpbnRvIHRoZVxuICogT2JqZWN0LWJhc2VkIGZvcm1hdC5cbiAqL1xuZnVuY3Rpb24gbm9ybWFsaXplUHJvcHMgKG9wdGlvbnMpIHtcbiAgdmFyIHByb3BzID0gb3B0aW9ucy5wcm9wcztcbiAgaWYgKCFwcm9wcykgeyByZXR1cm4gfVxuICB2YXIgcmVzID0ge307XG4gIHZhciBpLCB2YWwsIG5hbWU7XG4gIGlmIChBcnJheS5pc0FycmF5KHByb3BzKSkge1xuICAgIGkgPSBwcm9wcy5sZW5ndGg7XG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgdmFsID0gcHJvcHNbaV07XG4gICAgICBpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgbmFtZSA9IGNhbWVsaXplKHZhbCk7XG4gICAgICAgIHJlc1tuYW1lXSA9IHsgdHlwZTogbnVsbCB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2FybigncHJvcHMgbXVzdCBiZSBzdHJpbmdzIHdoZW4gdXNpbmcgYXJyYXkgc3ludGF4LicpO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmIChpc1BsYWluT2JqZWN0KHByb3BzKSkge1xuICAgIGZvciAodmFyIGtleSBpbiBwcm9wcykge1xuICAgICAgdmFsID0gcHJvcHNba2V5XTtcbiAgICAgIG5hbWUgPSBjYW1lbGl6ZShrZXkpO1xuICAgICAgcmVzW25hbWVdID0gaXNQbGFpbk9iamVjdCh2YWwpXG4gICAgICAgID8gdmFsXG4gICAgICAgIDogeyB0eXBlOiB2YWwgfTtcbiAgICB9XG4gIH1cbiAgb3B0aW9ucy5wcm9wcyA9IHJlcztcbn1cblxuLyoqXG4gKiBOb3JtYWxpemUgcmF3IGZ1bmN0aW9uIGRpcmVjdGl2ZXMgaW50byBvYmplY3QgZm9ybWF0LlxuICovXG5mdW5jdGlvbiBub3JtYWxpemVEaXJlY3RpdmVzIChvcHRpb25zKSB7XG4gIHZhciBkaXJzID0gb3B0aW9ucy5kaXJlY3RpdmVzO1xuICBpZiAoZGlycykge1xuICAgIGZvciAodmFyIGtleSBpbiBkaXJzKSB7XG4gICAgICB2YXIgZGVmID0gZGlyc1trZXldO1xuICAgICAgaWYgKHR5cGVvZiBkZWYgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgZGlyc1trZXldID0geyBiaW5kOiBkZWYsIHVwZGF0ZTogZGVmIH07XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogTWVyZ2UgdHdvIG9wdGlvbiBvYmplY3RzIGludG8gYSBuZXcgb25lLlxuICogQ29yZSB1dGlsaXR5IHVzZWQgaW4gYm90aCBpbnN0YW50aWF0aW9uIGFuZCBpbmhlcml0YW5jZS5cbiAqL1xuZnVuY3Rpb24gbWVyZ2VPcHRpb25zIChcbiAgcGFyZW50LFxuICBjaGlsZCxcbiAgdm1cbikge1xuICB7XG4gICAgY2hlY2tDb21wb25lbnRzKGNoaWxkKTtcbiAgfVxuICBub3JtYWxpemVQcm9wcyhjaGlsZCk7XG4gIG5vcm1hbGl6ZURpcmVjdGl2ZXMoY2hpbGQpO1xuICB2YXIgZXh0ZW5kc0Zyb20gPSBjaGlsZC5leHRlbmRzO1xuICBpZiAoZXh0ZW5kc0Zyb20pIHtcbiAgICBwYXJlbnQgPSB0eXBlb2YgZXh0ZW5kc0Zyb20gPT09ICdmdW5jdGlvbidcbiAgICAgID8gbWVyZ2VPcHRpb25zKHBhcmVudCwgZXh0ZW5kc0Zyb20ub3B0aW9ucywgdm0pXG4gICAgICA6IG1lcmdlT3B0aW9ucyhwYXJlbnQsIGV4dGVuZHNGcm9tLCB2bSk7XG4gIH1cbiAgaWYgKGNoaWxkLm1peGlucykge1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gY2hpbGQubWl4aW5zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgdmFyIG1peGluID0gY2hpbGQubWl4aW5zW2ldO1xuICAgICAgaWYgKG1peGluLnByb3RvdHlwZSBpbnN0YW5jZW9mIFZ1ZSQzKSB7XG4gICAgICAgIG1peGluID0gbWl4aW4ub3B0aW9ucztcbiAgICAgIH1cbiAgICAgIHBhcmVudCA9IG1lcmdlT3B0aW9ucyhwYXJlbnQsIG1peGluLCB2bSk7XG4gICAgfVxuICB9XG4gIHZhciBvcHRpb25zID0ge307XG4gIHZhciBrZXk7XG4gIGZvciAoa2V5IGluIHBhcmVudCkge1xuICAgIG1lcmdlRmllbGQoa2V5KTtcbiAgfVxuICBmb3IgKGtleSBpbiBjaGlsZCkge1xuICAgIGlmICghaGFzT3duKHBhcmVudCwga2V5KSkge1xuICAgICAgbWVyZ2VGaWVsZChrZXkpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBtZXJnZUZpZWxkIChrZXkpIHtcbiAgICB2YXIgc3RyYXQgPSBzdHJhdHNba2V5XSB8fCBkZWZhdWx0U3RyYXQ7XG4gICAgb3B0aW9uc1trZXldID0gc3RyYXQocGFyZW50W2tleV0sIGNoaWxkW2tleV0sIHZtLCBrZXkpO1xuICB9XG4gIHJldHVybiBvcHRpb25zXG59XG5cbi8qKlxuICogUmVzb2x2ZSBhbiBhc3NldC5cbiAqIFRoaXMgZnVuY3Rpb24gaXMgdXNlZCBiZWNhdXNlIGNoaWxkIGluc3RhbmNlcyBuZWVkIGFjY2Vzc1xuICogdG8gYXNzZXRzIGRlZmluZWQgaW4gaXRzIGFuY2VzdG9yIGNoYWluLlxuICovXG5mdW5jdGlvbiByZXNvbHZlQXNzZXQgKFxuICBvcHRpb25zLFxuICB0eXBlLFxuICBpZCxcbiAgd2Fybk1pc3Npbmdcbikge1xuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgaWYgKHR5cGVvZiBpZCAhPT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm5cbiAgfVxuICB2YXIgYXNzZXRzID0gb3B0aW9uc1t0eXBlXTtcbiAgLy8gY2hlY2sgbG9jYWwgcmVnaXN0cmF0aW9uIHZhcmlhdGlvbnMgZmlyc3RcbiAgaWYgKGhhc093bihhc3NldHMsIGlkKSkgeyByZXR1cm4gYXNzZXRzW2lkXSB9XG4gIHZhciBjYW1lbGl6ZWRJZCA9IGNhbWVsaXplKGlkKTtcbiAgaWYgKGhhc093bihhc3NldHMsIGNhbWVsaXplZElkKSkgeyByZXR1cm4gYXNzZXRzW2NhbWVsaXplZElkXSB9XG4gIHZhciBQYXNjYWxDYXNlSWQgPSBjYXBpdGFsaXplKGNhbWVsaXplZElkKTtcbiAgaWYgKGhhc093bihhc3NldHMsIFBhc2NhbENhc2VJZCkpIHsgcmV0dXJuIGFzc2V0c1tQYXNjYWxDYXNlSWRdIH1cbiAgLy8gZmFsbGJhY2sgdG8gcHJvdG90eXBlIGNoYWluXG4gIHZhciByZXMgPSBhc3NldHNbaWRdIHx8IGFzc2V0c1tjYW1lbGl6ZWRJZF0gfHwgYXNzZXRzW1Bhc2NhbENhc2VJZF07XG4gIGlmIChcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiB3YXJuTWlzc2luZyAmJiAhcmVzKSB7XG4gICAgd2FybihcbiAgICAgICdGYWlsZWQgdG8gcmVzb2x2ZSAnICsgdHlwZS5zbGljZSgwLCAtMSkgKyAnOiAnICsgaWQsXG4gICAgICBvcHRpb25zXG4gICAgKTtcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbi8qICAqL1xuXG5mdW5jdGlvbiB2YWxpZGF0ZVByb3AgKFxuICBrZXksXG4gIHByb3BPcHRpb25zLFxuICBwcm9wc0RhdGEsXG4gIHZtXG4pIHtcbiAgdmFyIHByb3AgPSBwcm9wT3B0aW9uc1trZXldO1xuICB2YXIgYWJzZW50ID0gIWhhc093bihwcm9wc0RhdGEsIGtleSk7XG4gIHZhciB2YWx1ZSA9IHByb3BzRGF0YVtrZXldO1xuICAvLyBoYW5kbGUgYm9vbGVhbiBwcm9wc1xuICBpZiAoaXNUeXBlKEJvb2xlYW4sIHByb3AudHlwZSkpIHtcbiAgICBpZiAoYWJzZW50ICYmICFoYXNPd24ocHJvcCwgJ2RlZmF1bHQnKSkge1xuICAgICAgdmFsdWUgPSBmYWxzZTtcbiAgICB9IGVsc2UgaWYgKCFpc1R5cGUoU3RyaW5nLCBwcm9wLnR5cGUpICYmICh2YWx1ZSA9PT0gJycgfHwgdmFsdWUgPT09IGh5cGhlbmF0ZShrZXkpKSkge1xuICAgICAgdmFsdWUgPSB0cnVlO1xuICAgIH1cbiAgfVxuICAvLyBjaGVjayBkZWZhdWx0IHZhbHVlXG4gIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdmFsdWUgPSBnZXRQcm9wRGVmYXVsdFZhbHVlKHZtLCBwcm9wLCBrZXkpO1xuICAgIC8vIHNpbmNlIHRoZSBkZWZhdWx0IHZhbHVlIGlzIGEgZnJlc2ggY29weSxcbiAgICAvLyBtYWtlIHN1cmUgdG8gb2JzZXJ2ZSBpdC5cbiAgICB2YXIgcHJldlNob3VsZENvbnZlcnQgPSBvYnNlcnZlclN0YXRlLnNob3VsZENvbnZlcnQ7XG4gICAgb2JzZXJ2ZXJTdGF0ZS5zaG91bGRDb252ZXJ0ID0gdHJ1ZTtcbiAgICBvYnNlcnZlKHZhbHVlKTtcbiAgICBvYnNlcnZlclN0YXRlLnNob3VsZENvbnZlcnQgPSBwcmV2U2hvdWxkQ29udmVydDtcbiAgfVxuICB7XG4gICAgYXNzZXJ0UHJvcChwcm9wLCBrZXksIHZhbHVlLCB2bSwgYWJzZW50KTtcbiAgfVxuICByZXR1cm4gdmFsdWVcbn1cblxuLyoqXG4gKiBHZXQgdGhlIGRlZmF1bHQgdmFsdWUgb2YgYSBwcm9wLlxuICovXG5mdW5jdGlvbiBnZXRQcm9wRGVmYXVsdFZhbHVlICh2bSwgcHJvcCwga2V5KSB7XG4gIC8vIG5vIGRlZmF1bHQsIHJldHVybiB1bmRlZmluZWRcbiAgaWYgKCFoYXNPd24ocHJvcCwgJ2RlZmF1bHQnKSkge1xuICAgIHJldHVybiB1bmRlZmluZWRcbiAgfVxuICB2YXIgZGVmID0gcHJvcC5kZWZhdWx0O1xuICAvLyB3YXJuIGFnYWluc3Qgbm9uLWZhY3RvcnkgZGVmYXVsdHMgZm9yIE9iamVjdCAmIEFycmF5XG4gIGlmIChcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiBpc09iamVjdChkZWYpKSB7XG4gICAgd2FybihcbiAgICAgICdJbnZhbGlkIGRlZmF1bHQgdmFsdWUgZm9yIHByb3AgXCInICsga2V5ICsgJ1wiOiAnICtcbiAgICAgICdQcm9wcyB3aXRoIHR5cGUgT2JqZWN0L0FycmF5IG11c3QgdXNlIGEgZmFjdG9yeSBmdW5jdGlvbiAnICtcbiAgICAgICd0byByZXR1cm4gdGhlIGRlZmF1bHQgdmFsdWUuJyxcbiAgICAgIHZtXG4gICAgKTtcbiAgfVxuICAvLyB0aGUgcmF3IHByb3AgdmFsdWUgd2FzIGFsc28gdW5kZWZpbmVkIGZyb20gcHJldmlvdXMgcmVuZGVyLFxuICAvLyByZXR1cm4gcHJldmlvdXMgZGVmYXVsdCB2YWx1ZSB0byBhdm9pZCB1bm5lY2Vzc2FyeSB3YXRjaGVyIHRyaWdnZXJcbiAgaWYgKHZtICYmIHZtLiRvcHRpb25zLnByb3BzRGF0YSAmJlxuICAgIHZtLiRvcHRpb25zLnByb3BzRGF0YVtrZXldID09PSB1bmRlZmluZWQgJiZcbiAgICB2bS5fcHJvcHNba2V5XSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIHZtLl9wcm9wc1trZXldXG4gIH1cbiAgLy8gY2FsbCBmYWN0b3J5IGZ1bmN0aW9uIGZvciBub24tRnVuY3Rpb24gdHlwZXNcbiAgLy8gYSB2YWx1ZSBpcyBGdW5jdGlvbiBpZiBpdHMgcHJvdG90eXBlIGlzIGZ1bmN0aW9uIGV2ZW4gYWNyb3NzIGRpZmZlcmVudCBleGVjdXRpb24gY29udGV4dFxuICByZXR1cm4gdHlwZW9mIGRlZiA9PT0gJ2Z1bmN0aW9uJyAmJiBnZXRUeXBlKHByb3AudHlwZSkgIT09ICdGdW5jdGlvbidcbiAgICA/IGRlZi5jYWxsKHZtKVxuICAgIDogZGVmXG59XG5cbi8qKlxuICogQXNzZXJ0IHdoZXRoZXIgYSBwcm9wIGlzIHZhbGlkLlxuICovXG5mdW5jdGlvbiBhc3NlcnRQcm9wIChcbiAgcHJvcCxcbiAgbmFtZSxcbiAgdmFsdWUsXG4gIHZtLFxuICBhYnNlbnRcbikge1xuICBpZiAocHJvcC5yZXF1aXJlZCAmJiBhYnNlbnQpIHtcbiAgICB3YXJuKFxuICAgICAgJ01pc3NpbmcgcmVxdWlyZWQgcHJvcDogXCInICsgbmFtZSArICdcIicsXG4gICAgICB2bVxuICAgICk7XG4gICAgcmV0dXJuXG4gIH1cbiAgaWYgKHZhbHVlID09IG51bGwgJiYgIXByb3AucmVxdWlyZWQpIHtcbiAgICByZXR1cm5cbiAgfVxuICB2YXIgdHlwZSA9IHByb3AudHlwZTtcbiAgdmFyIHZhbGlkID0gIXR5cGUgfHwgdHlwZSA9PT0gdHJ1ZTtcbiAgdmFyIGV4cGVjdGVkVHlwZXMgPSBbXTtcbiAgaWYgKHR5cGUpIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkodHlwZSkpIHtcbiAgICAgIHR5cGUgPSBbdHlwZV07XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdHlwZS5sZW5ndGggJiYgIXZhbGlkOyBpKyspIHtcbiAgICAgIHZhciBhc3NlcnRlZFR5cGUgPSBhc3NlcnRUeXBlKHZhbHVlLCB0eXBlW2ldKTtcbiAgICAgIGV4cGVjdGVkVHlwZXMucHVzaChhc3NlcnRlZFR5cGUuZXhwZWN0ZWRUeXBlIHx8ICcnKTtcbiAgICAgIHZhbGlkID0gYXNzZXJ0ZWRUeXBlLnZhbGlkO1xuICAgIH1cbiAgfVxuICBpZiAoIXZhbGlkKSB7XG4gICAgd2FybihcbiAgICAgICdJbnZhbGlkIHByb3A6IHR5cGUgY2hlY2sgZmFpbGVkIGZvciBwcm9wIFwiJyArIG5hbWUgKyAnXCIuJyArXG4gICAgICAnIEV4cGVjdGVkICcgKyBleHBlY3RlZFR5cGVzLm1hcChjYXBpdGFsaXplKS5qb2luKCcsICcpICtcbiAgICAgICcsIGdvdCAnICsgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKS5zbGljZSg4LCAtMSkgKyAnLicsXG4gICAgICB2bVxuICAgICk7XG4gICAgcmV0dXJuXG4gIH1cbiAgdmFyIHZhbGlkYXRvciA9IHByb3AudmFsaWRhdG9yO1xuICBpZiAodmFsaWRhdG9yKSB7XG4gICAgaWYgKCF2YWxpZGF0b3IodmFsdWUpKSB7XG4gICAgICB3YXJuKFxuICAgICAgICAnSW52YWxpZCBwcm9wOiBjdXN0b20gdmFsaWRhdG9yIGNoZWNrIGZhaWxlZCBmb3IgcHJvcCBcIicgKyBuYW1lICsgJ1wiLicsXG4gICAgICAgIHZtXG4gICAgICApO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEFzc2VydCB0aGUgdHlwZSBvZiBhIHZhbHVlXG4gKi9cbmZ1bmN0aW9uIGFzc2VydFR5cGUgKHZhbHVlLCB0eXBlKSB7XG4gIHZhciB2YWxpZDtcbiAgdmFyIGV4cGVjdGVkVHlwZSA9IGdldFR5cGUodHlwZSk7XG4gIGlmIChleHBlY3RlZFR5cGUgPT09ICdTdHJpbmcnKSB7XG4gICAgdmFsaWQgPSB0eXBlb2YgdmFsdWUgPT09IChleHBlY3RlZFR5cGUgPSAnc3RyaW5nJyk7XG4gIH0gZWxzZSBpZiAoZXhwZWN0ZWRUeXBlID09PSAnTnVtYmVyJykge1xuICAgIHZhbGlkID0gdHlwZW9mIHZhbHVlID09PSAoZXhwZWN0ZWRUeXBlID0gJ251bWJlcicpO1xuICB9IGVsc2UgaWYgKGV4cGVjdGVkVHlwZSA9PT0gJ0Jvb2xlYW4nKSB7XG4gICAgdmFsaWQgPSB0eXBlb2YgdmFsdWUgPT09IChleHBlY3RlZFR5cGUgPSAnYm9vbGVhbicpO1xuICB9IGVsc2UgaWYgKGV4cGVjdGVkVHlwZSA9PT0gJ0Z1bmN0aW9uJykge1xuICAgIHZhbGlkID0gdHlwZW9mIHZhbHVlID09PSAoZXhwZWN0ZWRUeXBlID0gJ2Z1bmN0aW9uJyk7XG4gIH0gZWxzZSBpZiAoZXhwZWN0ZWRUeXBlID09PSAnT2JqZWN0Jykge1xuICAgIHZhbGlkID0gaXNQbGFpbk9iamVjdCh2YWx1ZSk7XG4gIH0gZWxzZSBpZiAoZXhwZWN0ZWRUeXBlID09PSAnQXJyYXknKSB7XG4gICAgdmFsaWQgPSBBcnJheS5pc0FycmF5KHZhbHVlKTtcbiAgfSBlbHNlIHtcbiAgICB2YWxpZCA9IHZhbHVlIGluc3RhbmNlb2YgdHlwZTtcbiAgfVxuICByZXR1cm4ge1xuICAgIHZhbGlkOiB2YWxpZCxcbiAgICBleHBlY3RlZFR5cGU6IGV4cGVjdGVkVHlwZVxuICB9XG59XG5cbi8qKlxuICogVXNlIGZ1bmN0aW9uIHN0cmluZyBuYW1lIHRvIGNoZWNrIGJ1aWx0LWluIHR5cGVzLFxuICogYmVjYXVzZSBhIHNpbXBsZSBlcXVhbGl0eSBjaGVjayB3aWxsIGZhaWwgd2hlbiBydW5uaW5nXG4gKiBhY3Jvc3MgZGlmZmVyZW50IHZtcyAvIGlmcmFtZXMuXG4gKi9cbmZ1bmN0aW9uIGdldFR5cGUgKGZuKSB7XG4gIHZhciBtYXRjaCA9IGZuICYmIGZuLnRvU3RyaW5nKCkubWF0Y2goL15cXHMqZnVuY3Rpb24gKFxcdyspLyk7XG4gIHJldHVybiBtYXRjaCAmJiBtYXRjaFsxXVxufVxuXG5mdW5jdGlvbiBpc1R5cGUgKHR5cGUsIGZuKSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShmbikpIHtcbiAgICByZXR1cm4gZ2V0VHlwZShmbikgPT09IGdldFR5cGUodHlwZSlcbiAgfVxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gZm4ubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBpZiAoZ2V0VHlwZShmbltpXSkgPT09IGdldFR5cGUodHlwZSkpIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIHJldHVybiBmYWxzZVxufVxuXG5mdW5jdGlvbiBoYW5kbGVFcnJvciAoZXJyLCB2bSwgaW5mbykge1xuICBpZiAoY29uZmlnLmVycm9ySGFuZGxlcikge1xuICAgIGNvbmZpZy5lcnJvckhhbmRsZXIuY2FsbChudWxsLCBlcnIsIHZtLCBpbmZvKTtcbiAgfSBlbHNlIHtcbiAgICB7XG4gICAgICB3YXJuKChcIkVycm9yIGluIFwiICsgaW5mbyArIFwiOlwiKSwgdm0pO1xuICAgIH1cbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgIGlmIChpbkJyb3dzZXIgJiYgdHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IGVyclxuICAgIH1cbiAgfVxufVxuXG4vKiBub3QgdHlwZSBjaGVja2luZyB0aGlzIGZpbGUgYmVjYXVzZSBmbG93IGRvZXNuJ3QgcGxheSB3ZWxsIHdpdGggUHJveHkgKi9cblxudmFyIGluaXRQcm94eTtcblxue1xuICB2YXIgYWxsb3dlZEdsb2JhbHMgPSBtYWtlTWFwKFxuICAgICdJbmZpbml0eSx1bmRlZmluZWQsTmFOLGlzRmluaXRlLGlzTmFOLCcgK1xuICAgICdwYXJzZUZsb2F0LHBhcnNlSW50LGRlY29kZVVSSSxkZWNvZGVVUklDb21wb25lbnQsZW5jb2RlVVJJLGVuY29kZVVSSUNvbXBvbmVudCwnICtcbiAgICAnTWF0aCxOdW1iZXIsRGF0ZSxBcnJheSxPYmplY3QsQm9vbGVhbixTdHJpbmcsUmVnRXhwLE1hcCxTZXQsSlNPTixJbnRsLCcgK1xuICAgICdyZXF1aXJlJyAvLyBmb3IgV2VicGFjay9Ccm93c2VyaWZ5XG4gICk7XG5cbiAgdmFyIHdhcm5Ob25QcmVzZW50ID0gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7XG4gICAgd2FybihcbiAgICAgIFwiUHJvcGVydHkgb3IgbWV0aG9kIFxcXCJcIiArIGtleSArIFwiXFxcIiBpcyBub3QgZGVmaW5lZCBvbiB0aGUgaW5zdGFuY2UgYnV0IFwiICtcbiAgICAgIFwicmVmZXJlbmNlZCBkdXJpbmcgcmVuZGVyLiBNYWtlIHN1cmUgdG8gZGVjbGFyZSByZWFjdGl2ZSBkYXRhIFwiICtcbiAgICAgIFwicHJvcGVydGllcyBpbiB0aGUgZGF0YSBvcHRpb24uXCIsXG4gICAgICB0YXJnZXRcbiAgICApO1xuICB9O1xuXG4gIHZhciBoYXNQcm94eSA9XG4gICAgdHlwZW9mIFByb3h5ICE9PSAndW5kZWZpbmVkJyAmJlxuICAgIFByb3h5LnRvU3RyaW5nKCkubWF0Y2goL25hdGl2ZSBjb2RlLyk7XG5cbiAgaWYgKGhhc1Byb3h5KSB7XG4gICAgdmFyIGlzQnVpbHRJbk1vZGlmaWVyID0gbWFrZU1hcCgnc3RvcCxwcmV2ZW50LHNlbGYsY3RybCxzaGlmdCxhbHQsbWV0YScpO1xuICAgIGNvbmZpZy5rZXlDb2RlcyA9IG5ldyBQcm94eShjb25maWcua2V5Q29kZXMsIHtcbiAgICAgIHNldDogZnVuY3Rpb24gc2V0ICh0YXJnZXQsIGtleSwgdmFsdWUpIHtcbiAgICAgICAgaWYgKGlzQnVpbHRJbk1vZGlmaWVyKGtleSkpIHtcbiAgICAgICAgICB3YXJuKChcIkF2b2lkIG92ZXJ3cml0aW5nIGJ1aWx0LWluIG1vZGlmaWVyIGluIGNvbmZpZy5rZXlDb2RlczogLlwiICsga2V5KSk7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGFyZ2V0W2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICB2YXIgaGFzSGFuZGxlciA9IHtcbiAgICBoYXM6IGZ1bmN0aW9uIGhhcyAodGFyZ2V0LCBrZXkpIHtcbiAgICAgIHZhciBoYXMgPSBrZXkgaW4gdGFyZ2V0O1xuICAgICAgdmFyIGlzQWxsb3dlZCA9IGFsbG93ZWRHbG9iYWxzKGtleSkgfHwga2V5LmNoYXJBdCgwKSA9PT0gJ18nO1xuICAgICAgaWYgKCFoYXMgJiYgIWlzQWxsb3dlZCkge1xuICAgICAgICB3YXJuTm9uUHJlc2VudCh0YXJnZXQsIGtleSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gaGFzIHx8ICFpc0FsbG93ZWRcbiAgICB9XG4gIH07XG5cbiAgdmFyIGdldEhhbmRsZXIgPSB7XG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQgKHRhcmdldCwga2V5KSB7XG4gICAgICBpZiAodHlwZW9mIGtleSA9PT0gJ3N0cmluZycgJiYgIShrZXkgaW4gdGFyZ2V0KSkge1xuICAgICAgICB3YXJuTm9uUHJlc2VudCh0YXJnZXQsIGtleSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGFyZ2V0W2tleV1cbiAgICB9XG4gIH07XG5cbiAgaW5pdFByb3h5ID0gZnVuY3Rpb24gaW5pdFByb3h5ICh2bSkge1xuICAgIGlmIChoYXNQcm94eSkge1xuICAgICAgLy8gZGV0ZXJtaW5lIHdoaWNoIHByb3h5IGhhbmRsZXIgdG8gdXNlXG4gICAgICB2YXIgb3B0aW9ucyA9IHZtLiRvcHRpb25zO1xuICAgICAgdmFyIGhhbmRsZXJzID0gb3B0aW9ucy5yZW5kZXIgJiYgb3B0aW9ucy5yZW5kZXIuX3dpdGhTdHJpcHBlZFxuICAgICAgICA/IGdldEhhbmRsZXJcbiAgICAgICAgOiBoYXNIYW5kbGVyO1xuICAgICAgdm0uX3JlbmRlclByb3h5ID0gbmV3IFByb3h5KHZtLCBoYW5kbGVycyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZtLl9yZW5kZXJQcm94eSA9IHZtO1xuICAgIH1cbiAgfTtcbn1cblxuLyogICovXG5cbnZhciBWTm9kZSA9IGZ1bmN0aW9uIFZOb2RlIChcbiAgdGFnLFxuICBkYXRhLFxuICBjaGlsZHJlbixcbiAgdGV4dCxcbiAgZWxtLFxuICBjb250ZXh0LFxuICBjb21wb25lbnRPcHRpb25zXG4pIHtcbiAgdGhpcy50YWcgPSB0YWc7XG4gIHRoaXMuZGF0YSA9IGRhdGE7XG4gIHRoaXMuY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgdGhpcy50ZXh0ID0gdGV4dDtcbiAgdGhpcy5lbG0gPSBlbG07XG4gIHRoaXMubnMgPSB1bmRlZmluZWQ7XG4gIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gIHRoaXMuZnVuY3Rpb25hbENvbnRleHQgPSB1bmRlZmluZWQ7XG4gIHRoaXMua2V5ID0gZGF0YSAmJiBkYXRhLmtleTtcbiAgdGhpcy5jb21wb25lbnRPcHRpb25zID0gY29tcG9uZW50T3B0aW9ucztcbiAgdGhpcy5jb21wb25lbnRJbnN0YW5jZSA9IHVuZGVmaW5lZDtcbiAgdGhpcy5wYXJlbnQgPSB1bmRlZmluZWQ7XG4gIHRoaXMucmF3ID0gZmFsc2U7XG4gIHRoaXMuaXNTdGF0aWMgPSBmYWxzZTtcbiAgdGhpcy5pc1Jvb3RJbnNlcnQgPSB0cnVlO1xuICB0aGlzLmlzQ29tbWVudCA9IGZhbHNlO1xuICB0aGlzLmlzQ2xvbmVkID0gZmFsc2U7XG4gIHRoaXMuaXNPbmNlID0gZmFsc2U7XG59O1xuXG52YXIgcHJvdG90eXBlQWNjZXNzb3JzID0geyBjaGlsZDoge30gfTtcblxuLy8gREVQUkVDQVRFRDogYWxpYXMgZm9yIGNvbXBvbmVudEluc3RhbmNlIGZvciBiYWNrd2FyZHMgY29tcGF0LlxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbnByb3RvdHlwZUFjY2Vzc29ycy5jaGlsZC5nZXQgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLmNvbXBvbmVudEluc3RhbmNlXG59O1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyggVk5vZGUucHJvdG90eXBlLCBwcm90b3R5cGVBY2Nlc3NvcnMgKTtcblxudmFyIGNyZWF0ZUVtcHR5Vk5vZGUgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBub2RlID0gbmV3IFZOb2RlKCk7XG4gIG5vZGUudGV4dCA9ICcnO1xuICBub2RlLmlzQ29tbWVudCA9IHRydWU7XG4gIHJldHVybiBub2RlXG59O1xuXG5mdW5jdGlvbiBjcmVhdGVUZXh0Vk5vZGUgKHZhbCkge1xuICByZXR1cm4gbmV3IFZOb2RlKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIFN0cmluZyh2YWwpKVxufVxuXG4vLyBvcHRpbWl6ZWQgc2hhbGxvdyBjbG9uZVxuLy8gdXNlZCBmb3Igc3RhdGljIG5vZGVzIGFuZCBzbG90IG5vZGVzIGJlY2F1c2UgdGhleSBtYXkgYmUgcmV1c2VkIGFjcm9zc1xuLy8gbXVsdGlwbGUgcmVuZGVycywgY2xvbmluZyB0aGVtIGF2b2lkcyBlcnJvcnMgd2hlbiBET00gbWFuaXB1bGF0aW9ucyByZWx5XG4vLyBvbiB0aGVpciBlbG0gcmVmZXJlbmNlLlxuZnVuY3Rpb24gY2xvbmVWTm9kZSAodm5vZGUpIHtcbiAgdmFyIGNsb25lZCA9IG5ldyBWTm9kZShcbiAgICB2bm9kZS50YWcsXG4gICAgdm5vZGUuZGF0YSxcbiAgICB2bm9kZS5jaGlsZHJlbixcbiAgICB2bm9kZS50ZXh0LFxuICAgIHZub2RlLmVsbSxcbiAgICB2bm9kZS5jb250ZXh0LFxuICAgIHZub2RlLmNvbXBvbmVudE9wdGlvbnNcbiAgKTtcbiAgY2xvbmVkLm5zID0gdm5vZGUubnM7XG4gIGNsb25lZC5pc1N0YXRpYyA9IHZub2RlLmlzU3RhdGljO1xuICBjbG9uZWQua2V5ID0gdm5vZGUua2V5O1xuICBjbG9uZWQuaXNDbG9uZWQgPSB0cnVlO1xuICByZXR1cm4gY2xvbmVkXG59XG5cbmZ1bmN0aW9uIGNsb25lVk5vZGVzICh2bm9kZXMpIHtcbiAgdmFyIGxlbiA9IHZub2Rlcy5sZW5ndGg7XG4gIHZhciByZXMgPSBuZXcgQXJyYXkobGVuKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgIHJlc1tpXSA9IGNsb25lVk5vZGUodm5vZGVzW2ldKTtcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbi8qICAqL1xuXG52YXIgbm9ybWFsaXplRXZlbnQgPSBjYWNoZWQoZnVuY3Rpb24gKG5hbWUpIHtcbiAgdmFyIG9uY2UkJDEgPSBuYW1lLmNoYXJBdCgwKSA9PT0gJ34nOyAvLyBQcmVmaXhlZCBsYXN0LCBjaGVja2VkIGZpcnN0XG4gIG5hbWUgPSBvbmNlJCQxID8gbmFtZS5zbGljZSgxKSA6IG5hbWU7XG4gIHZhciBjYXB0dXJlID0gbmFtZS5jaGFyQXQoMCkgPT09ICchJztcbiAgbmFtZSA9IGNhcHR1cmUgPyBuYW1lLnNsaWNlKDEpIDogbmFtZTtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiBuYW1lLFxuICAgIG9uY2U6IG9uY2UkJDEsXG4gICAgY2FwdHVyZTogY2FwdHVyZVxuICB9XG59KTtcblxuZnVuY3Rpb24gY3JlYXRlRm5JbnZva2VyIChmbnMpIHtcbiAgZnVuY3Rpb24gaW52b2tlciAoKSB7XG4gICAgdmFyIGFyZ3VtZW50cyQxID0gYXJndW1lbnRzO1xuXG4gICAgdmFyIGZucyA9IGludm9rZXIuZm5zO1xuICAgIGlmIChBcnJheS5pc0FycmF5KGZucykpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZm5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGZuc1tpXS5hcHBseShudWxsLCBhcmd1bWVudHMkMSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHJldHVybiBoYW5kbGVyIHJldHVybiB2YWx1ZSBmb3Igc2luZ2xlIGhhbmRsZXJzXG4gICAgICByZXR1cm4gZm5zLmFwcGx5KG51bGwsIGFyZ3VtZW50cylcbiAgICB9XG4gIH1cbiAgaW52b2tlci5mbnMgPSBmbnM7XG4gIHJldHVybiBpbnZva2VyXG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUxpc3RlbmVycyAoXG4gIG9uLFxuICBvbGRPbixcbiAgYWRkLFxuICByZW1vdmUkJDEsXG4gIHZtXG4pIHtcbiAgdmFyIG5hbWUsIGN1ciwgb2xkLCBldmVudDtcbiAgZm9yIChuYW1lIGluIG9uKSB7XG4gICAgY3VyID0gb25bbmFtZV07XG4gICAgb2xkID0gb2xkT25bbmFtZV07XG4gICAgZXZlbnQgPSBub3JtYWxpemVFdmVudChuYW1lKTtcbiAgICBpZiAoIWN1cikge1xuICAgICAgXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiYgd2FybihcbiAgICAgICAgXCJJbnZhbGlkIGhhbmRsZXIgZm9yIGV2ZW50IFxcXCJcIiArIChldmVudC5uYW1lKSArIFwiXFxcIjogZ290IFwiICsgU3RyaW5nKGN1ciksXG4gICAgICAgIHZtXG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAoIW9sZCkge1xuICAgICAgaWYgKCFjdXIuZm5zKSB7XG4gICAgICAgIGN1ciA9IG9uW25hbWVdID0gY3JlYXRlRm5JbnZva2VyKGN1cik7XG4gICAgICB9XG4gICAgICBhZGQoZXZlbnQubmFtZSwgY3VyLCBldmVudC5vbmNlLCBldmVudC5jYXB0dXJlKTtcbiAgICB9IGVsc2UgaWYgKGN1ciAhPT0gb2xkKSB7XG4gICAgICBvbGQuZm5zID0gY3VyO1xuICAgICAgb25bbmFtZV0gPSBvbGQ7XG4gICAgfVxuICB9XG4gIGZvciAobmFtZSBpbiBvbGRPbikge1xuICAgIGlmICghb25bbmFtZV0pIHtcbiAgICAgIGV2ZW50ID0gbm9ybWFsaXplRXZlbnQobmFtZSk7XG4gICAgICByZW1vdmUkJDEoZXZlbnQubmFtZSwgb2xkT25bbmFtZV0sIGV2ZW50LmNhcHR1cmUpO1xuICAgIH1cbiAgfVxufVxuXG4vKiAgKi9cblxuZnVuY3Rpb24gbWVyZ2VWTm9kZUhvb2sgKGRlZiwgaG9va0tleSwgaG9vaykge1xuICB2YXIgaW52b2tlcjtcbiAgdmFyIG9sZEhvb2sgPSBkZWZbaG9va0tleV07XG5cbiAgZnVuY3Rpb24gd3JhcHBlZEhvb2sgKCkge1xuICAgIGhvb2suYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAvLyBpbXBvcnRhbnQ6IHJlbW92ZSBtZXJnZWQgaG9vayB0byBlbnN1cmUgaXQncyBjYWxsZWQgb25seSBvbmNlXG4gICAgLy8gYW5kIHByZXZlbnQgbWVtb3J5IGxlYWtcbiAgICByZW1vdmUoaW52b2tlci5mbnMsIHdyYXBwZWRIb29rKTtcbiAgfVxuXG4gIGlmICghb2xkSG9vaykge1xuICAgIC8vIG5vIGV4aXN0aW5nIGhvb2tcbiAgICBpbnZva2VyID0gY3JlYXRlRm5JbnZva2VyKFt3cmFwcGVkSG9va10pO1xuICB9IGVsc2Uge1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgIGlmIChvbGRIb29rLmZucyAmJiBvbGRIb29rLm1lcmdlZCkge1xuICAgICAgLy8gYWxyZWFkeSBhIG1lcmdlZCBpbnZva2VyXG4gICAgICBpbnZva2VyID0gb2xkSG9vaztcbiAgICAgIGludm9rZXIuZm5zLnB1c2god3JhcHBlZEhvb2spO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBleGlzdGluZyBwbGFpbiBob29rXG4gICAgICBpbnZva2VyID0gY3JlYXRlRm5JbnZva2VyKFtvbGRIb29rLCB3cmFwcGVkSG9va10pO1xuICAgIH1cbiAgfVxuXG4gIGludm9rZXIubWVyZ2VkID0gdHJ1ZTtcbiAgZGVmW2hvb2tLZXldID0gaW52b2tlcjtcbn1cblxuLyogICovXG5cbi8vIFRoZSB0ZW1wbGF0ZSBjb21waWxlciBhdHRlbXB0cyB0byBtaW5pbWl6ZSB0aGUgbmVlZCBmb3Igbm9ybWFsaXphdGlvbiBieVxuLy8gc3RhdGljYWxseSBhbmFseXppbmcgdGhlIHRlbXBsYXRlIGF0IGNvbXBpbGUgdGltZS5cbi8vXG4vLyBGb3IgcGxhaW4gSFRNTCBtYXJrdXAsIG5vcm1hbGl6YXRpb24gY2FuIGJlIGNvbXBsZXRlbHkgc2tpcHBlZCBiZWNhdXNlIHRoZVxuLy8gZ2VuZXJhdGVkIHJlbmRlciBmdW5jdGlvbiBpcyBndWFyYW50ZWVkIHRvIHJldHVybiBBcnJheTxWTm9kZT4uIFRoZXJlIGFyZVxuLy8gdHdvIGNhc2VzIHdoZXJlIGV4dHJhIG5vcm1hbGl6YXRpb24gaXMgbmVlZGVkOlxuXG4vLyAxLiBXaGVuIHRoZSBjaGlsZHJlbiBjb250YWlucyBjb21wb25lbnRzIC0gYmVjYXVzZSBhIGZ1bmN0aW9uYWwgY29tcG9uZW50XG4vLyBtYXkgcmV0dXJuIGFuIEFycmF5IGluc3RlYWQgb2YgYSBzaW5nbGUgcm9vdC4gSW4gdGhpcyBjYXNlLCBqdXN0IGEgc2ltcGxlXG4vLyBub3JtYWxpemF0aW9uIGlzIG5lZWRlZCAtIGlmIGFueSBjaGlsZCBpcyBhbiBBcnJheSwgd2UgZmxhdHRlbiB0aGUgd2hvbGVcbi8vIHRoaW5nIHdpdGggQXJyYXkucHJvdG90eXBlLmNvbmNhdC4gSXQgaXMgZ3VhcmFudGVlZCB0byBiZSBvbmx5IDEtbGV2ZWwgZGVlcFxuLy8gYmVjYXVzZSBmdW5jdGlvbmFsIGNvbXBvbmVudHMgYWxyZWFkeSBub3JtYWxpemUgdGhlaXIgb3duIGNoaWxkcmVuLlxuZnVuY3Rpb24gc2ltcGxlTm9ybWFsaXplQ2hpbGRyZW4gKGNoaWxkcmVuKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShjaGlsZHJlbltpXSkpIHtcbiAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuY29uY2F0LmFwcGx5KFtdLCBjaGlsZHJlbilcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGNoaWxkcmVuXG59XG5cbi8vIDIuIFdoZW4gdGhlIGNoaWxkcmVuIGNvbnRhaW5zIGNvbnN0cnVjdHMgdGhhdCBhbHdheXMgZ2VuZXJhdGVkIG5lc3RlZCBBcnJheXMsXG4vLyBlLmcuIDx0ZW1wbGF0ZT4sIDxzbG90Piwgdi1mb3IsIG9yIHdoZW4gdGhlIGNoaWxkcmVuIGlzIHByb3ZpZGVkIGJ5IHVzZXJcbi8vIHdpdGggaGFuZC13cml0dGVuIHJlbmRlciBmdW5jdGlvbnMgLyBKU1guIEluIHN1Y2ggY2FzZXMgYSBmdWxsIG5vcm1hbGl6YXRpb25cbi8vIGlzIG5lZWRlZCB0byBjYXRlciB0byBhbGwgcG9zc2libGUgdHlwZXMgb2YgY2hpbGRyZW4gdmFsdWVzLlxuZnVuY3Rpb24gbm9ybWFsaXplQ2hpbGRyZW4gKGNoaWxkcmVuKSB7XG4gIHJldHVybiBpc1ByaW1pdGl2ZShjaGlsZHJlbilcbiAgICA/IFtjcmVhdGVUZXh0Vk5vZGUoY2hpbGRyZW4pXVxuICAgIDogQXJyYXkuaXNBcnJheShjaGlsZHJlbilcbiAgICAgID8gbm9ybWFsaXplQXJyYXlDaGlsZHJlbihjaGlsZHJlbilcbiAgICAgIDogdW5kZWZpbmVkXG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZUFycmF5Q2hpbGRyZW4gKGNoaWxkcmVuLCBuZXN0ZWRJbmRleCkge1xuICB2YXIgcmVzID0gW107XG4gIHZhciBpLCBjLCBsYXN0O1xuICBmb3IgKGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICBjID0gY2hpbGRyZW5baV07XG4gICAgaWYgKGMgPT0gbnVsbCB8fCB0eXBlb2YgYyA9PT0gJ2Jvb2xlYW4nKSB7IGNvbnRpbnVlIH1cbiAgICBsYXN0ID0gcmVzW3Jlcy5sZW5ndGggLSAxXTtcbiAgICAvLyAgbmVzdGVkXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoYykpIHtcbiAgICAgIHJlcy5wdXNoLmFwcGx5KHJlcywgbm9ybWFsaXplQXJyYXlDaGlsZHJlbihjLCAoKG5lc3RlZEluZGV4IHx8ICcnKSArIFwiX1wiICsgaSkpKTtcbiAgICB9IGVsc2UgaWYgKGlzUHJpbWl0aXZlKGMpKSB7XG4gICAgICBpZiAobGFzdCAmJiBsYXN0LnRleHQpIHtcbiAgICAgICAgbGFzdC50ZXh0ICs9IFN0cmluZyhjKTtcbiAgICAgIH0gZWxzZSBpZiAoYyAhPT0gJycpIHtcbiAgICAgICAgLy8gY29udmVydCBwcmltaXRpdmUgdG8gdm5vZGVcbiAgICAgICAgcmVzLnB1c2goY3JlYXRlVGV4dFZOb2RlKGMpKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGMudGV4dCAmJiBsYXN0ICYmIGxhc3QudGV4dCkge1xuICAgICAgICByZXNbcmVzLmxlbmd0aCAtIDFdID0gY3JlYXRlVGV4dFZOb2RlKGxhc3QudGV4dCArIGMudGV4dCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBkZWZhdWx0IGtleSBmb3IgbmVzdGVkIGFycmF5IGNoaWxkcmVuIChsaWtlbHkgZ2VuZXJhdGVkIGJ5IHYtZm9yKVxuICAgICAgICBpZiAoYy50YWcgJiYgYy5rZXkgPT0gbnVsbCAmJiBuZXN0ZWRJbmRleCAhPSBudWxsKSB7XG4gICAgICAgICAgYy5rZXkgPSBcIl9fdmxpc3RcIiArIG5lc3RlZEluZGV4ICsgXCJfXCIgKyBpICsgXCJfX1wiO1xuICAgICAgICB9XG4gICAgICAgIHJlcy5wdXNoKGMpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbi8qICAqL1xuXG5mdW5jdGlvbiBnZXRGaXJzdENvbXBvbmVudENoaWxkIChjaGlsZHJlbikge1xuICByZXR1cm4gY2hpbGRyZW4gJiYgY2hpbGRyZW4uZmlsdGVyKGZ1bmN0aW9uIChjKSB7IHJldHVybiBjICYmIGMuY29tcG9uZW50T3B0aW9uczsgfSlbMF1cbn1cblxuLyogICovXG5cbmZ1bmN0aW9uIGluaXRFdmVudHMgKHZtKSB7XG4gIHZtLl9ldmVudHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICB2bS5faGFzSG9va0V2ZW50ID0gZmFsc2U7XG4gIC8vIGluaXQgcGFyZW50IGF0dGFjaGVkIGV2ZW50c1xuICB2YXIgbGlzdGVuZXJzID0gdm0uJG9wdGlvbnMuX3BhcmVudExpc3RlbmVycztcbiAgaWYgKGxpc3RlbmVycykge1xuICAgIHVwZGF0ZUNvbXBvbmVudExpc3RlbmVycyh2bSwgbGlzdGVuZXJzKTtcbiAgfVxufVxuXG52YXIgdGFyZ2V0O1xuXG5mdW5jdGlvbiBhZGQgKGV2ZW50LCBmbiwgb25jZSQkMSkge1xuICBpZiAob25jZSQkMSkge1xuICAgIHRhcmdldC4kb25jZShldmVudCwgZm4pO1xuICB9IGVsc2Uge1xuICAgIHRhcmdldC4kb24oZXZlbnQsIGZuKTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZW1vdmUkMSAoZXZlbnQsIGZuKSB7XG4gIHRhcmdldC4kb2ZmKGV2ZW50LCBmbik7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUNvbXBvbmVudExpc3RlbmVycyAoXG4gIHZtLFxuICBsaXN0ZW5lcnMsXG4gIG9sZExpc3RlbmVyc1xuKSB7XG4gIHRhcmdldCA9IHZtO1xuICB1cGRhdGVMaXN0ZW5lcnMobGlzdGVuZXJzLCBvbGRMaXN0ZW5lcnMgfHwge30sIGFkZCwgcmVtb3ZlJDEsIHZtKTtcbn1cblxuZnVuY3Rpb24gZXZlbnRzTWl4aW4gKFZ1ZSkge1xuICB2YXIgaG9va1JFID0gL15ob29rOi87XG4gIFZ1ZS5wcm90b3R5cGUuJG9uID0gZnVuY3Rpb24gKGV2ZW50LCBmbikge1xuICAgIHZhciB0aGlzJDEgPSB0aGlzO1xuXG4gICAgdmFyIHZtID0gdGhpcztcbiAgICBpZiAoQXJyYXkuaXNBcnJheShldmVudCkpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gZXZlbnQubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHRoaXMkMS4kb24oZXZlbnRbaV0sIGZuKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgKHZtLl9ldmVudHNbZXZlbnRdIHx8ICh2bS5fZXZlbnRzW2V2ZW50XSA9IFtdKSkucHVzaChmbik7XG4gICAgICAvLyBvcHRpbWl6ZSBob29rOmV2ZW50IGNvc3QgYnkgdXNpbmcgYSBib29sZWFuIGZsYWcgbWFya2VkIGF0IHJlZ2lzdHJhdGlvblxuICAgICAgLy8gaW5zdGVhZCBvZiBhIGhhc2ggbG9va3VwXG4gICAgICBpZiAoaG9va1JFLnRlc3QoZXZlbnQpKSB7XG4gICAgICAgIHZtLl9oYXNIb29rRXZlbnQgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdm1cbiAgfTtcblxuICBWdWUucHJvdG90eXBlLiRvbmNlID0gZnVuY3Rpb24gKGV2ZW50LCBmbikge1xuICAgIHZhciB2bSA9IHRoaXM7XG4gICAgZnVuY3Rpb24gb24gKCkge1xuICAgICAgdm0uJG9mZihldmVudCwgb24pO1xuICAgICAgZm4uYXBwbHkodm0sIGFyZ3VtZW50cyk7XG4gICAgfVxuICAgIG9uLmZuID0gZm47XG4gICAgdm0uJG9uKGV2ZW50LCBvbik7XG4gICAgcmV0dXJuIHZtXG4gIH07XG5cbiAgVnVlLnByb3RvdHlwZS4kb2ZmID0gZnVuY3Rpb24gKGV2ZW50LCBmbikge1xuICAgIHZhciB0aGlzJDEgPSB0aGlzO1xuXG4gICAgdmFyIHZtID0gdGhpcztcbiAgICAvLyBhbGxcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIHZtLl9ldmVudHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgcmV0dXJuIHZtXG4gICAgfVxuICAgIC8vIGFycmF5IG9mIGV2ZW50c1xuICAgIGlmIChBcnJheS5pc0FycmF5KGV2ZW50KSkge1xuICAgICAgZm9yICh2YXIgaSQxID0gMCwgbCA9IGV2ZW50Lmxlbmd0aDsgaSQxIDwgbDsgaSQxKyspIHtcbiAgICAgICAgdGhpcyQxLiRvZmYoZXZlbnRbaSQxXSwgZm4pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZtXG4gICAgfVxuICAgIC8vIHNwZWNpZmljIGV2ZW50XG4gICAgdmFyIGNicyA9IHZtLl9ldmVudHNbZXZlbnRdO1xuICAgIGlmICghY2JzKSB7XG4gICAgICByZXR1cm4gdm1cbiAgICB9XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHZtLl9ldmVudHNbZXZlbnRdID0gbnVsbDtcbiAgICAgIHJldHVybiB2bVxuICAgIH1cbiAgICAvLyBzcGVjaWZpYyBoYW5kbGVyXG4gICAgdmFyIGNiO1xuICAgIHZhciBpID0gY2JzLmxlbmd0aDtcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICBjYiA9IGNic1tpXTtcbiAgICAgIGlmIChjYiA9PT0gZm4gfHwgY2IuZm4gPT09IGZuKSB7XG4gICAgICAgIGNicy5zcGxpY2UoaSwgMSk7XG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB2bVxuICB9O1xuXG4gIFZ1ZS5wcm90b3R5cGUuJGVtaXQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB2YXIgdm0gPSB0aGlzO1xuICAgIHZhciBjYnMgPSB2bS5fZXZlbnRzW2V2ZW50XTtcbiAgICBpZiAoY2JzKSB7XG4gICAgICBjYnMgPSBjYnMubGVuZ3RoID4gMSA/IHRvQXJyYXkoY2JzKSA6IGNicztcbiAgICAgIHZhciBhcmdzID0gdG9BcnJheShhcmd1bWVudHMsIDEpO1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBjYnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGNic1tpXS5hcHBseSh2bSwgYXJncyk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB2bVxuICB9O1xufVxuXG4vKiAgKi9cblxuLyoqXG4gKiBSdW50aW1lIGhlbHBlciBmb3IgcmVzb2x2aW5nIHJhdyBjaGlsZHJlbiBWTm9kZXMgaW50byBhIHNsb3Qgb2JqZWN0LlxuICovXG5mdW5jdGlvbiByZXNvbHZlU2xvdHMgKFxuICBjaGlsZHJlbixcbiAgY29udGV4dFxuKSB7XG4gIHZhciBzbG90cyA9IHt9O1xuICBpZiAoIWNoaWxkcmVuKSB7XG4gICAgcmV0dXJuIHNsb3RzXG4gIH1cbiAgdmFyIGRlZmF1bHRTbG90ID0gW107XG4gIHZhciBuYW1lLCBjaGlsZDtcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBjaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBjaGlsZCA9IGNoaWxkcmVuW2ldO1xuICAgIC8vIG5hbWVkIHNsb3RzIHNob3VsZCBvbmx5IGJlIHJlc3BlY3RlZCBpZiB0aGUgdm5vZGUgd2FzIHJlbmRlcmVkIGluIHRoZVxuICAgIC8vIHNhbWUgY29udGV4dC5cbiAgICBpZiAoKGNoaWxkLmNvbnRleHQgPT09IGNvbnRleHQgfHwgY2hpbGQuZnVuY3Rpb25hbENvbnRleHQgPT09IGNvbnRleHQpICYmXG4gICAgICAgIGNoaWxkLmRhdGEgJiYgKG5hbWUgPSBjaGlsZC5kYXRhLnNsb3QpKSB7XG4gICAgICB2YXIgc2xvdCA9IChzbG90c1tuYW1lXSB8fCAoc2xvdHNbbmFtZV0gPSBbXSkpO1xuICAgICAgaWYgKGNoaWxkLnRhZyA9PT0gJ3RlbXBsYXRlJykge1xuICAgICAgICBzbG90LnB1c2guYXBwbHkoc2xvdCwgY2hpbGQuY2hpbGRyZW4pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2xvdC5wdXNoKGNoaWxkKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZGVmYXVsdFNsb3QucHVzaChjaGlsZCk7XG4gICAgfVxuICB9XG4gIC8vIGlnbm9yZSB3aGl0ZXNwYWNlXG4gIGlmICghZGVmYXVsdFNsb3QuZXZlcnkoaXNXaGl0ZXNwYWNlKSkge1xuICAgIHNsb3RzLmRlZmF1bHQgPSBkZWZhdWx0U2xvdDtcbiAgfVxuICByZXR1cm4gc2xvdHNcbn1cblxuZnVuY3Rpb24gaXNXaGl0ZXNwYWNlIChub2RlKSB7XG4gIHJldHVybiBub2RlLmlzQ29tbWVudCB8fCBub2RlLnRleHQgPT09ICcgJ1xufVxuXG5mdW5jdGlvbiByZXNvbHZlU2NvcGVkU2xvdHMgKFxuICBmbnNcbikge1xuICB2YXIgcmVzID0ge307XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZm5zLmxlbmd0aDsgaSsrKSB7XG4gICAgcmVzW2Zuc1tpXVswXV0gPSBmbnNbaV1bMV07XG4gIH1cbiAgcmV0dXJuIHJlc1xufVxuXG4vKiAgKi9cblxudmFyIGFjdGl2ZUluc3RhbmNlID0gbnVsbDtcblxuZnVuY3Rpb24gaW5pdExpZmVjeWNsZSAodm0pIHtcbiAgdmFyIG9wdGlvbnMgPSB2bS4kb3B0aW9ucztcblxuICAvLyBsb2NhdGUgZmlyc3Qgbm9uLWFic3RyYWN0IHBhcmVudFxuICB2YXIgcGFyZW50ID0gb3B0aW9ucy5wYXJlbnQ7XG4gIGlmIChwYXJlbnQgJiYgIW9wdGlvbnMuYWJzdHJhY3QpIHtcbiAgICB3aGlsZSAocGFyZW50LiRvcHRpb25zLmFic3RyYWN0ICYmIHBhcmVudC4kcGFyZW50KSB7XG4gICAgICBwYXJlbnQgPSBwYXJlbnQuJHBhcmVudDtcbiAgICB9XG4gICAgcGFyZW50LiRjaGlsZHJlbi5wdXNoKHZtKTtcbiAgfVxuXG4gIHZtLiRwYXJlbnQgPSBwYXJlbnQ7XG4gIHZtLiRyb290ID0gcGFyZW50ID8gcGFyZW50LiRyb290IDogdm07XG5cbiAgdm0uJGNoaWxkcmVuID0gW107XG4gIHZtLiRyZWZzID0ge307XG5cbiAgdm0uX3dhdGNoZXIgPSBudWxsO1xuICB2bS5faW5hY3RpdmUgPSBudWxsO1xuICB2bS5fZGlyZWN0SW5hY3RpdmUgPSBmYWxzZTtcbiAgdm0uX2lzTW91bnRlZCA9IGZhbHNlO1xuICB2bS5faXNEZXN0cm95ZWQgPSBmYWxzZTtcbiAgdm0uX2lzQmVpbmdEZXN0cm95ZWQgPSBmYWxzZTtcbn1cblxuZnVuY3Rpb24gbGlmZWN5Y2xlTWl4aW4gKFZ1ZSkge1xuICBWdWUucHJvdG90eXBlLl91cGRhdGUgPSBmdW5jdGlvbiAodm5vZGUsIGh5ZHJhdGluZykge1xuICAgIHZhciB2bSA9IHRoaXM7XG4gICAgaWYgKHZtLl9pc01vdW50ZWQpIHtcbiAgICAgIGNhbGxIb29rKHZtLCAnYmVmb3JlVXBkYXRlJyk7XG4gICAgfVxuICAgIHZhciBwcmV2RWwgPSB2bS4kZWw7XG4gICAgdmFyIHByZXZWbm9kZSA9IHZtLl92bm9kZTtcbiAgICB2YXIgcHJldkFjdGl2ZUluc3RhbmNlID0gYWN0aXZlSW5zdGFuY2U7XG4gICAgYWN0aXZlSW5zdGFuY2UgPSB2bTtcbiAgICB2bS5fdm5vZGUgPSB2bm9kZTtcbiAgICAvLyBWdWUucHJvdG90eXBlLl9fcGF0Y2hfXyBpcyBpbmplY3RlZCBpbiBlbnRyeSBwb2ludHNcbiAgICAvLyBiYXNlZCBvbiB0aGUgcmVuZGVyaW5nIGJhY2tlbmQgdXNlZC5cbiAgICBpZiAoIXByZXZWbm9kZSkge1xuICAgICAgLy8gaW5pdGlhbCByZW5kZXJcbiAgICAgIHZtLiRlbCA9IHZtLl9fcGF0Y2hfXyhcbiAgICAgICAgdm0uJGVsLCB2bm9kZSwgaHlkcmF0aW5nLCBmYWxzZSAvKiByZW1vdmVPbmx5ICovLFxuICAgICAgICB2bS4kb3B0aW9ucy5fcGFyZW50RWxtLFxuICAgICAgICB2bS4kb3B0aW9ucy5fcmVmRWxtXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyB1cGRhdGVzXG4gICAgICB2bS4kZWwgPSB2bS5fX3BhdGNoX18ocHJldlZub2RlLCB2bm9kZSk7XG4gICAgfVxuICAgIGFjdGl2ZUluc3RhbmNlID0gcHJldkFjdGl2ZUluc3RhbmNlO1xuICAgIC8vIHVwZGF0ZSBfX3Z1ZV9fIHJlZmVyZW5jZVxuICAgIGlmIChwcmV2RWwpIHtcbiAgICAgIHByZXZFbC5fX3Z1ZV9fID0gbnVsbDtcbiAgICB9XG4gICAgaWYgKHZtLiRlbCkge1xuICAgICAgdm0uJGVsLl9fdnVlX18gPSB2bTtcbiAgICB9XG4gICAgLy8gaWYgcGFyZW50IGlzIGFuIEhPQywgdXBkYXRlIGl0cyAkZWwgYXMgd2VsbFxuICAgIGlmICh2bS4kdm5vZGUgJiYgdm0uJHBhcmVudCAmJiB2bS4kdm5vZGUgPT09IHZtLiRwYXJlbnQuX3Zub2RlKSB7XG4gICAgICB2bS4kcGFyZW50LiRlbCA9IHZtLiRlbDtcbiAgICB9XG4gICAgLy8gdXBkYXRlZCBob29rIGlzIGNhbGxlZCBieSB0aGUgc2NoZWR1bGVyIHRvIGVuc3VyZSB0aGF0IGNoaWxkcmVuIGFyZVxuICAgIC8vIHVwZGF0ZWQgaW4gYSBwYXJlbnQncyB1cGRhdGVkIGhvb2suXG4gIH07XG5cbiAgVnVlLnByb3RvdHlwZS4kZm9yY2VVcGRhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHZtID0gdGhpcztcbiAgICBpZiAodm0uX3dhdGNoZXIpIHtcbiAgICAgIHZtLl93YXRjaGVyLnVwZGF0ZSgpO1xuICAgIH1cbiAgfTtcblxuICBWdWUucHJvdG90eXBlLiRkZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciB2bSA9IHRoaXM7XG4gICAgaWYgKHZtLl9pc0JlaW5nRGVzdHJveWVkKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgY2FsbEhvb2sodm0sICdiZWZvcmVEZXN0cm95Jyk7XG4gICAgdm0uX2lzQmVpbmdEZXN0cm95ZWQgPSB0cnVlO1xuICAgIC8vIHJlbW92ZSBzZWxmIGZyb20gcGFyZW50XG4gICAgdmFyIHBhcmVudCA9IHZtLiRwYXJlbnQ7XG4gICAgaWYgKHBhcmVudCAmJiAhcGFyZW50Ll9pc0JlaW5nRGVzdHJveWVkICYmICF2bS4kb3B0aW9ucy5hYnN0cmFjdCkge1xuICAgICAgcmVtb3ZlKHBhcmVudC4kY2hpbGRyZW4sIHZtKTtcbiAgICB9XG4gICAgLy8gdGVhcmRvd24gd2F0Y2hlcnNcbiAgICBpZiAodm0uX3dhdGNoZXIpIHtcbiAgICAgIHZtLl93YXRjaGVyLnRlYXJkb3duKCk7XG4gICAgfVxuICAgIHZhciBpID0gdm0uX3dhdGNoZXJzLmxlbmd0aDtcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICB2bS5fd2F0Y2hlcnNbaV0udGVhcmRvd24oKTtcbiAgICB9XG4gICAgLy8gcmVtb3ZlIHJlZmVyZW5jZSBmcm9tIGRhdGEgb2JcbiAgICAvLyBmcm96ZW4gb2JqZWN0IG1heSBub3QgaGF2ZSBvYnNlcnZlci5cbiAgICBpZiAodm0uX2RhdGEuX19vYl9fKSB7XG4gICAgICB2bS5fZGF0YS5fX29iX18udm1Db3VudC0tO1xuICAgIH1cbiAgICAvLyBjYWxsIHRoZSBsYXN0IGhvb2suLi5cbiAgICB2bS5faXNEZXN0cm95ZWQgPSB0cnVlO1xuICAgIGNhbGxIb29rKHZtLCAnZGVzdHJveWVkJyk7XG4gICAgLy8gdHVybiBvZmYgYWxsIGluc3RhbmNlIGxpc3RlbmVycy5cbiAgICB2bS4kb2ZmKCk7XG4gICAgLy8gcmVtb3ZlIF9fdnVlX18gcmVmZXJlbmNlXG4gICAgaWYgKHZtLiRlbCkge1xuICAgICAgdm0uJGVsLl9fdnVlX18gPSBudWxsO1xuICAgIH1cbiAgICAvLyBpbnZva2UgZGVzdHJveSBob29rcyBvbiBjdXJyZW50IHJlbmRlcmVkIHRyZWVcbiAgICB2bS5fX3BhdGNoX18odm0uX3Zub2RlLCBudWxsKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gbW91bnRDb21wb25lbnQgKFxuICB2bSxcbiAgZWwsXG4gIGh5ZHJhdGluZ1xuKSB7XG4gIHZtLiRlbCA9IGVsO1xuICBpZiAoIXZtLiRvcHRpb25zLnJlbmRlcikge1xuICAgIHZtLiRvcHRpb25zLnJlbmRlciA9IGNyZWF0ZUVtcHR5Vk5vZGU7XG4gICAge1xuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICBpZiAoKHZtLiRvcHRpb25zLnRlbXBsYXRlICYmIHZtLiRvcHRpb25zLnRlbXBsYXRlLmNoYXJBdCgwKSAhPT0gJyMnKSB8fFxuICAgICAgICB2bS4kb3B0aW9ucy5lbCB8fCBlbCkge1xuICAgICAgICB3YXJuKFxuICAgICAgICAgICdZb3UgYXJlIHVzaW5nIHRoZSBydW50aW1lLW9ubHkgYnVpbGQgb2YgVnVlIHdoZXJlIHRoZSB0ZW1wbGF0ZSAnICtcbiAgICAgICAgICAnY29tcGlsZXIgaXMgbm90IGF2YWlsYWJsZS4gRWl0aGVyIHByZS1jb21waWxlIHRoZSB0ZW1wbGF0ZXMgaW50byAnICtcbiAgICAgICAgICAncmVuZGVyIGZ1bmN0aW9ucywgb3IgdXNlIHRoZSBjb21waWxlci1pbmNsdWRlZCBidWlsZC4nLFxuICAgICAgICAgIHZtXG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3YXJuKFxuICAgICAgICAgICdGYWlsZWQgdG8gbW91bnQgY29tcG9uZW50OiB0ZW1wbGF0ZSBvciByZW5kZXIgZnVuY3Rpb24gbm90IGRlZmluZWQuJyxcbiAgICAgICAgICB2bVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBjYWxsSG9vayh2bSwgJ2JlZm9yZU1vdW50Jyk7XG5cbiAgdmFyIHVwZGF0ZUNvbXBvbmVudDtcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gIGlmIChcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiBjb25maWcucGVyZm9ybWFuY2UgJiYgcGVyZikge1xuICAgIHVwZGF0ZUNvbXBvbmVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBuYW1lID0gdm0uX25hbWU7XG4gICAgICB2YXIgc3RhcnRUYWcgPSBcInN0YXJ0IFwiICsgbmFtZTtcbiAgICAgIHZhciBlbmRUYWcgPSBcImVuZCBcIiArIG5hbWU7XG4gICAgICBwZXJmLm1hcmsoc3RhcnRUYWcpO1xuICAgICAgdmFyIHZub2RlID0gdm0uX3JlbmRlcigpO1xuICAgICAgcGVyZi5tYXJrKGVuZFRhZyk7XG4gICAgICBwZXJmLm1lYXN1cmUoKG5hbWUgKyBcIiByZW5kZXJcIiksIHN0YXJ0VGFnLCBlbmRUYWcpO1xuICAgICAgcGVyZi5tYXJrKHN0YXJ0VGFnKTtcbiAgICAgIHZtLl91cGRhdGUodm5vZGUsIGh5ZHJhdGluZyk7XG4gICAgICBwZXJmLm1hcmsoZW5kVGFnKTtcbiAgICAgIHBlcmYubWVhc3VyZSgobmFtZSArIFwiIHBhdGNoXCIpLCBzdGFydFRhZywgZW5kVGFnKTtcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIHVwZGF0ZUNvbXBvbmVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZtLl91cGRhdGUodm0uX3JlbmRlcigpLCBoeWRyYXRpbmcpO1xuICAgIH07XG4gIH1cblxuICB2bS5fd2F0Y2hlciA9IG5ldyBXYXRjaGVyKHZtLCB1cGRhdGVDb21wb25lbnQsIG5vb3ApO1xuICBoeWRyYXRpbmcgPSBmYWxzZTtcblxuICAvLyBtYW51YWxseSBtb3VudGVkIGluc3RhbmNlLCBjYWxsIG1vdW50ZWQgb24gc2VsZlxuICAvLyBtb3VudGVkIGlzIGNhbGxlZCBmb3IgcmVuZGVyLWNyZWF0ZWQgY2hpbGQgY29tcG9uZW50cyBpbiBpdHMgaW5zZXJ0ZWQgaG9va1xuICBpZiAodm0uJHZub2RlID09IG51bGwpIHtcbiAgICB2bS5faXNNb3VudGVkID0gdHJ1ZTtcbiAgICBjYWxsSG9vayh2bSwgJ21vdW50ZWQnKTtcbiAgfVxuICByZXR1cm4gdm1cbn1cblxuZnVuY3Rpb24gdXBkYXRlQ2hpbGRDb21wb25lbnQgKFxuICB2bSxcbiAgcHJvcHNEYXRhLFxuICBsaXN0ZW5lcnMsXG4gIHBhcmVudFZub2RlLFxuICByZW5kZXJDaGlsZHJlblxuKSB7XG4gIC8vIGRldGVybWluZSB3aGV0aGVyIGNvbXBvbmVudCBoYXMgc2xvdCBjaGlsZHJlblxuICAvLyB3ZSBuZWVkIHRvIGRvIHRoaXMgYmVmb3JlIG92ZXJ3cml0aW5nICRvcHRpb25zLl9yZW5kZXJDaGlsZHJlblxuICB2YXIgaGFzQ2hpbGRyZW4gPSAhIShcbiAgICByZW5kZXJDaGlsZHJlbiB8fCAgICAgICAgICAgICAgIC8vIGhhcyBuZXcgc3RhdGljIHNsb3RzXG4gICAgdm0uJG9wdGlvbnMuX3JlbmRlckNoaWxkcmVuIHx8ICAvLyBoYXMgb2xkIHN0YXRpYyBzbG90c1xuICAgIHBhcmVudFZub2RlLmRhdGEuc2NvcGVkU2xvdHMgfHwgLy8gaGFzIG5ldyBzY29wZWQgc2xvdHNcbiAgICB2bS4kc2NvcGVkU2xvdHMgIT09IGVtcHR5T2JqZWN0IC8vIGhhcyBvbGQgc2NvcGVkIHNsb3RzXG4gICk7XG5cbiAgdm0uJG9wdGlvbnMuX3BhcmVudFZub2RlID0gcGFyZW50Vm5vZGU7XG4gIHZtLiR2bm9kZSA9IHBhcmVudFZub2RlOyAvLyB1cGRhdGUgdm0ncyBwbGFjZWhvbGRlciBub2RlIHdpdGhvdXQgcmUtcmVuZGVyXG4gIGlmICh2bS5fdm5vZGUpIHsgLy8gdXBkYXRlIGNoaWxkIHRyZWUncyBwYXJlbnRcbiAgICB2bS5fdm5vZGUucGFyZW50ID0gcGFyZW50Vm5vZGU7XG4gIH1cbiAgdm0uJG9wdGlvbnMuX3JlbmRlckNoaWxkcmVuID0gcmVuZGVyQ2hpbGRyZW47XG5cbiAgLy8gdXBkYXRlIHByb3BzXG4gIGlmIChwcm9wc0RhdGEgJiYgdm0uJG9wdGlvbnMucHJvcHMpIHtcbiAgICBvYnNlcnZlclN0YXRlLnNob3VsZENvbnZlcnQgPSBmYWxzZTtcbiAgICB7XG4gICAgICBvYnNlcnZlclN0YXRlLmlzU2V0dGluZ1Byb3BzID0gdHJ1ZTtcbiAgICB9XG4gICAgdmFyIHByb3BzID0gdm0uX3Byb3BzO1xuICAgIHZhciBwcm9wS2V5cyA9IHZtLiRvcHRpb25zLl9wcm9wS2V5cyB8fCBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BLZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIga2V5ID0gcHJvcEtleXNbaV07XG4gICAgICBwcm9wc1trZXldID0gdmFsaWRhdGVQcm9wKGtleSwgdm0uJG9wdGlvbnMucHJvcHMsIHByb3BzRGF0YSwgdm0pO1xuICAgIH1cbiAgICBvYnNlcnZlclN0YXRlLnNob3VsZENvbnZlcnQgPSB0cnVlO1xuICAgIHtcbiAgICAgIG9ic2VydmVyU3RhdGUuaXNTZXR0aW5nUHJvcHMgPSBmYWxzZTtcbiAgICB9XG4gICAgLy8ga2VlcCBhIGNvcHkgb2YgcmF3IHByb3BzRGF0YVxuICAgIHZtLiRvcHRpb25zLnByb3BzRGF0YSA9IHByb3BzRGF0YTtcbiAgfVxuICAvLyB1cGRhdGUgbGlzdGVuZXJzXG4gIGlmIChsaXN0ZW5lcnMpIHtcbiAgICB2YXIgb2xkTGlzdGVuZXJzID0gdm0uJG9wdGlvbnMuX3BhcmVudExpc3RlbmVycztcbiAgICB2bS4kb3B0aW9ucy5fcGFyZW50TGlzdGVuZXJzID0gbGlzdGVuZXJzO1xuICAgIHVwZGF0ZUNvbXBvbmVudExpc3RlbmVycyh2bSwgbGlzdGVuZXJzLCBvbGRMaXN0ZW5lcnMpO1xuICB9XG4gIC8vIHJlc29sdmUgc2xvdHMgKyBmb3JjZSB1cGRhdGUgaWYgaGFzIGNoaWxkcmVuXG4gIGlmIChoYXNDaGlsZHJlbikge1xuICAgIHZtLiRzbG90cyA9IHJlc29sdmVTbG90cyhyZW5kZXJDaGlsZHJlbiwgcGFyZW50Vm5vZGUuY29udGV4dCk7XG4gICAgdm0uJGZvcmNlVXBkYXRlKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaXNJbkluYWN0aXZlVHJlZSAodm0pIHtcbiAgd2hpbGUgKHZtICYmICh2bSA9IHZtLiRwYXJlbnQpKSB7XG4gICAgaWYgKHZtLl9pbmFjdGl2ZSkgeyByZXR1cm4gdHJ1ZSB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlXG59XG5cbmZ1bmN0aW9uIGFjdGl2YXRlQ2hpbGRDb21wb25lbnQgKHZtLCBkaXJlY3QpIHtcbiAgaWYgKGRpcmVjdCkge1xuICAgIHZtLl9kaXJlY3RJbmFjdGl2ZSA9IGZhbHNlO1xuICAgIGlmIChpc0luSW5hY3RpdmVUcmVlKHZtKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICB9IGVsc2UgaWYgKHZtLl9kaXJlY3RJbmFjdGl2ZSkge1xuICAgIHJldHVyblxuICB9XG4gIGlmICh2bS5faW5hY3RpdmUgfHwgdm0uX2luYWN0aXZlID09IG51bGwpIHtcbiAgICB2bS5faW5hY3RpdmUgPSBmYWxzZTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZtLiRjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgYWN0aXZhdGVDaGlsZENvbXBvbmVudCh2bS4kY2hpbGRyZW5baV0pO1xuICAgIH1cbiAgICBjYWxsSG9vayh2bSwgJ2FjdGl2YXRlZCcpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGRlYWN0aXZhdGVDaGlsZENvbXBvbmVudCAodm0sIGRpcmVjdCkge1xuICBpZiAoZGlyZWN0KSB7XG4gICAgdm0uX2RpcmVjdEluYWN0aXZlID0gdHJ1ZTtcbiAgICBpZiAoaXNJbkluYWN0aXZlVHJlZSh2bSkpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgfVxuICBpZiAoIXZtLl9pbmFjdGl2ZSkge1xuICAgIHZtLl9pbmFjdGl2ZSA9IHRydWU7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2bS4kY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgIGRlYWN0aXZhdGVDaGlsZENvbXBvbmVudCh2bS4kY2hpbGRyZW5baV0pO1xuICAgIH1cbiAgICBjYWxsSG9vayh2bSwgJ2RlYWN0aXZhdGVkJyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY2FsbEhvb2sgKHZtLCBob29rKSB7XG4gIHZhciBoYW5kbGVycyA9IHZtLiRvcHRpb25zW2hvb2tdO1xuICBpZiAoaGFuZGxlcnMpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgaiA9IGhhbmRsZXJzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaGFuZGxlcnNbaV0uY2FsbCh2bSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGhhbmRsZUVycm9yKGUsIHZtLCAoaG9vayArIFwiIGhvb2tcIikpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAodm0uX2hhc0hvb2tFdmVudCkge1xuICAgIHZtLiRlbWl0KCdob29rOicgKyBob29rKTtcbiAgfVxufVxuXG4vKiAgKi9cblxuXG52YXIgcXVldWUgPSBbXTtcbnZhciBoYXMgPSB7fTtcbnZhciBjaXJjdWxhciA9IHt9O1xudmFyIHdhaXRpbmcgPSBmYWxzZTtcbnZhciBmbHVzaGluZyA9IGZhbHNlO1xudmFyIGluZGV4ID0gMDtcblxuLyoqXG4gKiBSZXNldCB0aGUgc2NoZWR1bGVyJ3Mgc3RhdGUuXG4gKi9cbmZ1bmN0aW9uIHJlc2V0U2NoZWR1bGVyU3RhdGUgKCkge1xuICBxdWV1ZS5sZW5ndGggPSAwO1xuICBoYXMgPSB7fTtcbiAge1xuICAgIGNpcmN1bGFyID0ge307XG4gIH1cbiAgd2FpdGluZyA9IGZsdXNoaW5nID0gZmFsc2U7XG59XG5cbi8qKlxuICogRmx1c2ggYm90aCBxdWV1ZXMgYW5kIHJ1biB0aGUgd2F0Y2hlcnMuXG4gKi9cbmZ1bmN0aW9uIGZsdXNoU2NoZWR1bGVyUXVldWUgKCkge1xuICBmbHVzaGluZyA9IHRydWU7XG4gIHZhciB3YXRjaGVyLCBpZCwgdm07XG5cbiAgLy8gU29ydCBxdWV1ZSBiZWZvcmUgZmx1c2guXG4gIC8vIFRoaXMgZW5zdXJlcyB0aGF0OlxuICAvLyAxLiBDb21wb25lbnRzIGFyZSB1cGRhdGVkIGZyb20gcGFyZW50IHRvIGNoaWxkLiAoYmVjYXVzZSBwYXJlbnQgaXMgYWx3YXlzXG4gIC8vICAgIGNyZWF0ZWQgYmVmb3JlIHRoZSBjaGlsZClcbiAgLy8gMi4gQSBjb21wb25lbnQncyB1c2VyIHdhdGNoZXJzIGFyZSBydW4gYmVmb3JlIGl0cyByZW5kZXIgd2F0Y2hlciAoYmVjYXVzZVxuICAvLyAgICB1c2VyIHdhdGNoZXJzIGFyZSBjcmVhdGVkIGJlZm9yZSB0aGUgcmVuZGVyIHdhdGNoZXIpXG4gIC8vIDMuIElmIGEgY29tcG9uZW50IGlzIGRlc3Ryb3llZCBkdXJpbmcgYSBwYXJlbnQgY29tcG9uZW50J3Mgd2F0Y2hlciBydW4sXG4gIC8vICAgIGl0cyB3YXRjaGVycyBjYW4gYmUgc2tpcHBlZC5cbiAgcXVldWUuc29ydChmdW5jdGlvbiAoYSwgYikgeyByZXR1cm4gYS5pZCAtIGIuaWQ7IH0pO1xuXG4gIC8vIGRvIG5vdCBjYWNoZSBsZW5ndGggYmVjYXVzZSBtb3JlIHdhdGNoZXJzIG1pZ2h0IGJlIHB1c2hlZFxuICAvLyBhcyB3ZSBydW4gZXhpc3Rpbmcgd2F0Y2hlcnNcbiAgZm9yIChpbmRleCA9IDA7IGluZGV4IDwgcXVldWUubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgd2F0Y2hlciA9IHF1ZXVlW2luZGV4XTtcbiAgICBpZCA9IHdhdGNoZXIuaWQ7XG4gICAgaGFzW2lkXSA9IG51bGw7XG4gICAgd2F0Y2hlci5ydW4oKTtcbiAgICAvLyBpbiBkZXYgYnVpbGQsIGNoZWNrIGFuZCBzdG9wIGNpcmN1bGFyIHVwZGF0ZXMuXG4gICAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmIGhhc1tpZF0gIT0gbnVsbCkge1xuICAgICAgY2lyY3VsYXJbaWRdID0gKGNpcmN1bGFyW2lkXSB8fCAwKSArIDE7XG4gICAgICBpZiAoY2lyY3VsYXJbaWRdID4gY29uZmlnLl9tYXhVcGRhdGVDb3VudCkge1xuICAgICAgICB3YXJuKFxuICAgICAgICAgICdZb3UgbWF5IGhhdmUgYW4gaW5maW5pdGUgdXBkYXRlIGxvb3AgJyArIChcbiAgICAgICAgICAgIHdhdGNoZXIudXNlclxuICAgICAgICAgICAgICA/IChcImluIHdhdGNoZXIgd2l0aCBleHByZXNzaW9uIFxcXCJcIiArICh3YXRjaGVyLmV4cHJlc3Npb24pICsgXCJcXFwiXCIpXG4gICAgICAgICAgICAgIDogXCJpbiBhIGNvbXBvbmVudCByZW5kZXIgZnVuY3Rpb24uXCJcbiAgICAgICAgICApLFxuICAgICAgICAgIHdhdGNoZXIudm1cbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBjYWxsIHVwZGF0ZWQgaG9va3NcbiAgaW5kZXggPSBxdWV1ZS5sZW5ndGg7XG4gIHdoaWxlIChpbmRleC0tKSB7XG4gICAgd2F0Y2hlciA9IHF1ZXVlW2luZGV4XTtcbiAgICB2bSA9IHdhdGNoZXIudm07XG4gICAgaWYgKHZtLl93YXRjaGVyID09PSB3YXRjaGVyICYmIHZtLl9pc01vdW50ZWQpIHtcbiAgICAgIGNhbGxIb29rKHZtLCAndXBkYXRlZCcpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGRldnRvb2wgaG9va1xuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgaWYgKGRldnRvb2xzICYmIGNvbmZpZy5kZXZ0b29scykge1xuICAgIGRldnRvb2xzLmVtaXQoJ2ZsdXNoJyk7XG4gIH1cblxuICByZXNldFNjaGVkdWxlclN0YXRlKCk7XG59XG5cbi8qKlxuICogUHVzaCBhIHdhdGNoZXIgaW50byB0aGUgd2F0Y2hlciBxdWV1ZS5cbiAqIEpvYnMgd2l0aCBkdXBsaWNhdGUgSURzIHdpbGwgYmUgc2tpcHBlZCB1bmxlc3MgaXQnc1xuICogcHVzaGVkIHdoZW4gdGhlIHF1ZXVlIGlzIGJlaW5nIGZsdXNoZWQuXG4gKi9cbmZ1bmN0aW9uIHF1ZXVlV2F0Y2hlciAod2F0Y2hlcikge1xuICB2YXIgaWQgPSB3YXRjaGVyLmlkO1xuICBpZiAoaGFzW2lkXSA9PSBudWxsKSB7XG4gICAgaGFzW2lkXSA9IHRydWU7XG4gICAgaWYgKCFmbHVzaGluZykge1xuICAgICAgcXVldWUucHVzaCh3YXRjaGVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gaWYgYWxyZWFkeSBmbHVzaGluZywgc3BsaWNlIHRoZSB3YXRjaGVyIGJhc2VkIG9uIGl0cyBpZFxuICAgICAgLy8gaWYgYWxyZWFkeSBwYXN0IGl0cyBpZCwgaXQgd2lsbCBiZSBydW4gbmV4dCBpbW1lZGlhdGVseS5cbiAgICAgIHZhciBpID0gcXVldWUubGVuZ3RoIC0gMTtcbiAgICAgIHdoaWxlIChpID49IDAgJiYgcXVldWVbaV0uaWQgPiB3YXRjaGVyLmlkKSB7XG4gICAgICAgIGktLTtcbiAgICAgIH1cbiAgICAgIHF1ZXVlLnNwbGljZShNYXRoLm1heChpLCBpbmRleCkgKyAxLCAwLCB3YXRjaGVyKTtcbiAgICB9XG4gICAgLy8gcXVldWUgdGhlIGZsdXNoXG4gICAgaWYgKCF3YWl0aW5nKSB7XG4gICAgICB3YWl0aW5nID0gdHJ1ZTtcbiAgICAgIG5leHRUaWNrKGZsdXNoU2NoZWR1bGVyUXVldWUpO1xuICAgIH1cbiAgfVxufVxuXG4vKiAgKi9cblxudmFyIHVpZCQyID0gMDtcblxuLyoqXG4gKiBBIHdhdGNoZXIgcGFyc2VzIGFuIGV4cHJlc3Npb24sIGNvbGxlY3RzIGRlcGVuZGVuY2llcyxcbiAqIGFuZCBmaXJlcyBjYWxsYmFjayB3aGVuIHRoZSBleHByZXNzaW9uIHZhbHVlIGNoYW5nZXMuXG4gKiBUaGlzIGlzIHVzZWQgZm9yIGJvdGggdGhlICR3YXRjaCgpIGFwaSBhbmQgZGlyZWN0aXZlcy5cbiAqL1xudmFyIFdhdGNoZXIgPSBmdW5jdGlvbiBXYXRjaGVyIChcbiAgdm0sXG4gIGV4cE9yRm4sXG4gIGNiLFxuICBvcHRpb25zXG4pIHtcbiAgdGhpcy52bSA9IHZtO1xuICB2bS5fd2F0Y2hlcnMucHVzaCh0aGlzKTtcbiAgLy8gb3B0aW9uc1xuICBpZiAob3B0aW9ucykge1xuICAgIHRoaXMuZGVlcCA9ICEhb3B0aW9ucy5kZWVwO1xuICAgIHRoaXMudXNlciA9ICEhb3B0aW9ucy51c2VyO1xuICAgIHRoaXMubGF6eSA9ICEhb3B0aW9ucy5sYXp5O1xuICAgIHRoaXMuc3luYyA9ICEhb3B0aW9ucy5zeW5jO1xuICB9IGVsc2Uge1xuICAgIHRoaXMuZGVlcCA9IHRoaXMudXNlciA9IHRoaXMubGF6eSA9IHRoaXMuc3luYyA9IGZhbHNlO1xuICB9XG4gIHRoaXMuY2IgPSBjYjtcbiAgdGhpcy5pZCA9ICsrdWlkJDI7IC8vIHVpZCBmb3IgYmF0Y2hpbmdcbiAgdGhpcy5hY3RpdmUgPSB0cnVlO1xuICB0aGlzLmRpcnR5ID0gdGhpcy5sYXp5OyAvLyBmb3IgbGF6eSB3YXRjaGVyc1xuICB0aGlzLmRlcHMgPSBbXTtcbiAgdGhpcy5uZXdEZXBzID0gW107XG4gIHRoaXMuZGVwSWRzID0gbmV3IF9TZXQoKTtcbiAgdGhpcy5uZXdEZXBJZHMgPSBuZXcgX1NldCgpO1xuICB0aGlzLmV4cHJlc3Npb24gPSBleHBPckZuLnRvU3RyaW5nKCk7XG4gIC8vIHBhcnNlIGV4cHJlc3Npb24gZm9yIGdldHRlclxuICBpZiAodHlwZW9mIGV4cE9yRm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICB0aGlzLmdldHRlciA9IGV4cE9yRm47XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5nZXR0ZXIgPSBwYXJzZVBhdGgoZXhwT3JGbik7XG4gICAgaWYgKCF0aGlzLmdldHRlcikge1xuICAgICAgdGhpcy5nZXR0ZXIgPSBmdW5jdGlvbiAoKSB7fTtcbiAgICAgIFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmIHdhcm4oXG4gICAgICAgIFwiRmFpbGVkIHdhdGNoaW5nIHBhdGg6IFxcXCJcIiArIGV4cE9yRm4gKyBcIlxcXCIgXCIgK1xuICAgICAgICAnV2F0Y2hlciBvbmx5IGFjY2VwdHMgc2ltcGxlIGRvdC1kZWxpbWl0ZWQgcGF0aHMuICcgK1xuICAgICAgICAnRm9yIGZ1bGwgY29udHJvbCwgdXNlIGEgZnVuY3Rpb24gaW5zdGVhZC4nLFxuICAgICAgICB2bVxuICAgICAgKTtcbiAgICB9XG4gIH1cbiAgdGhpcy52YWx1ZSA9IHRoaXMubGF6eVxuICAgID8gdW5kZWZpbmVkXG4gICAgOiB0aGlzLmdldCgpO1xufTtcblxuLyoqXG4gKiBFdmFsdWF0ZSB0aGUgZ2V0dGVyLCBhbmQgcmUtY29sbGVjdCBkZXBlbmRlbmNpZXMuXG4gKi9cbldhdGNoZXIucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIGdldCAoKSB7XG4gIHB1c2hUYXJnZXQodGhpcyk7XG4gIHZhciB2YWx1ZTtcbiAgdmFyIHZtID0gdGhpcy52bTtcbiAgaWYgKHRoaXMudXNlcikge1xuICAgIHRyeSB7XG4gICAgICB2YWx1ZSA9IHRoaXMuZ2V0dGVyLmNhbGwodm0sIHZtKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBoYW5kbGVFcnJvcihlLCB2bSwgKFwiZ2V0dGVyIGZvciB3YXRjaGVyIFxcXCJcIiArICh0aGlzLmV4cHJlc3Npb24pICsgXCJcXFwiXCIpKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFsdWUgPSB0aGlzLmdldHRlci5jYWxsKHZtLCB2bSk7XG4gIH1cbiAgLy8gXCJ0b3VjaFwiIGV2ZXJ5IHByb3BlcnR5IHNvIHRoZXkgYXJlIGFsbCB0cmFja2VkIGFzXG4gIC8vIGRlcGVuZGVuY2llcyBmb3IgZGVlcCB3YXRjaGluZ1xuICBpZiAodGhpcy5kZWVwKSB7XG4gICAgdHJhdmVyc2UodmFsdWUpO1xuICB9XG4gIHBvcFRhcmdldCgpO1xuICB0aGlzLmNsZWFudXBEZXBzKCk7XG4gIHJldHVybiB2YWx1ZVxufTtcblxuLyoqXG4gKiBBZGQgYSBkZXBlbmRlbmN5IHRvIHRoaXMgZGlyZWN0aXZlLlxuICovXG5XYXRjaGVyLnByb3RvdHlwZS5hZGREZXAgPSBmdW5jdGlvbiBhZGREZXAgKGRlcCkge1xuICB2YXIgaWQgPSBkZXAuaWQ7XG4gIGlmICghdGhpcy5uZXdEZXBJZHMuaGFzKGlkKSkge1xuICAgIHRoaXMubmV3RGVwSWRzLmFkZChpZCk7XG4gICAgdGhpcy5uZXdEZXBzLnB1c2goZGVwKTtcbiAgICBpZiAoIXRoaXMuZGVwSWRzLmhhcyhpZCkpIHtcbiAgICAgIGRlcC5hZGRTdWIodGhpcyk7XG4gICAgfVxuICB9XG59O1xuXG4vKipcbiAqIENsZWFuIHVwIGZvciBkZXBlbmRlbmN5IGNvbGxlY3Rpb24uXG4gKi9cbldhdGNoZXIucHJvdG90eXBlLmNsZWFudXBEZXBzID0gZnVuY3Rpb24gY2xlYW51cERlcHMgKCkge1xuICAgIHZhciB0aGlzJDEgPSB0aGlzO1xuXG4gIHZhciBpID0gdGhpcy5kZXBzLmxlbmd0aDtcbiAgd2hpbGUgKGktLSkge1xuICAgIHZhciBkZXAgPSB0aGlzJDEuZGVwc1tpXTtcbiAgICBpZiAoIXRoaXMkMS5uZXdEZXBJZHMuaGFzKGRlcC5pZCkpIHtcbiAgICAgIGRlcC5yZW1vdmVTdWIodGhpcyQxKTtcbiAgICB9XG4gIH1cbiAgdmFyIHRtcCA9IHRoaXMuZGVwSWRzO1xuICB0aGlzLmRlcElkcyA9IHRoaXMubmV3RGVwSWRzO1xuICB0aGlzLm5ld0RlcElkcyA9IHRtcDtcbiAgdGhpcy5uZXdEZXBJZHMuY2xlYXIoKTtcbiAgdG1wID0gdGhpcy5kZXBzO1xuICB0aGlzLmRlcHMgPSB0aGlzLm5ld0RlcHM7XG4gIHRoaXMubmV3RGVwcyA9IHRtcDtcbiAgdGhpcy5uZXdEZXBzLmxlbmd0aCA9IDA7XG59O1xuXG4vKipcbiAqIFN1YnNjcmliZXIgaW50ZXJmYWNlLlxuICogV2lsbCBiZSBjYWxsZWQgd2hlbiBhIGRlcGVuZGVuY3kgY2hhbmdlcy5cbiAqL1xuV2F0Y2hlci5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gdXBkYXRlICgpIHtcbiAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgaWYgKHRoaXMubGF6eSkge1xuICAgIHRoaXMuZGlydHkgPSB0cnVlO1xuICB9IGVsc2UgaWYgKHRoaXMuc3luYykge1xuICAgIHRoaXMucnVuKCk7XG4gIH0gZWxzZSB7XG4gICAgcXVldWVXYXRjaGVyKHRoaXMpO1xuICB9XG59O1xuXG4vKipcbiAqIFNjaGVkdWxlciBqb2IgaW50ZXJmYWNlLlxuICogV2lsbCBiZSBjYWxsZWQgYnkgdGhlIHNjaGVkdWxlci5cbiAqL1xuV2F0Y2hlci5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gcnVuICgpIHtcbiAgaWYgKHRoaXMuYWN0aXZlKSB7XG4gICAgdmFyIHZhbHVlID0gdGhpcy5nZXQoKTtcbiAgICBpZiAoXG4gICAgICB2YWx1ZSAhPT0gdGhpcy52YWx1ZSB8fFxuICAgICAgLy8gRGVlcCB3YXRjaGVycyBhbmQgd2F0Y2hlcnMgb24gT2JqZWN0L0FycmF5cyBzaG91bGQgZmlyZSBldmVuXG4gICAgICAvLyB3aGVuIHRoZSB2YWx1ZSBpcyB0aGUgc2FtZSwgYmVjYXVzZSB0aGUgdmFsdWUgbWF5XG4gICAgICAvLyBoYXZlIG11dGF0ZWQuXG4gICAgICBpc09iamVjdCh2YWx1ZSkgfHxcbiAgICAgIHRoaXMuZGVlcFxuICAgICkge1xuICAgICAgLy8gc2V0IG5ldyB2YWx1ZVxuICAgICAgdmFyIG9sZFZhbHVlID0gdGhpcy52YWx1ZTtcbiAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgIGlmICh0aGlzLnVzZXIpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB0aGlzLmNiLmNhbGwodGhpcy52bSwgdmFsdWUsIG9sZFZhbHVlKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGhhbmRsZUVycm9yKGUsIHRoaXMudm0sIChcImNhbGxiYWNrIGZvciB3YXRjaGVyIFxcXCJcIiArICh0aGlzLmV4cHJlc3Npb24pICsgXCJcXFwiXCIpKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jYi5jYWxsKHRoaXMudm0sIHZhbHVlLCBvbGRWYWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG4vKipcbiAqIEV2YWx1YXRlIHRoZSB2YWx1ZSBvZiB0aGUgd2F0Y2hlci5cbiAqIFRoaXMgb25seSBnZXRzIGNhbGxlZCBmb3IgbGF6eSB3YXRjaGVycy5cbiAqL1xuV2F0Y2hlci5wcm90b3R5cGUuZXZhbHVhdGUgPSBmdW5jdGlvbiBldmFsdWF0ZSAoKSB7XG4gIHRoaXMudmFsdWUgPSB0aGlzLmdldCgpO1xuICB0aGlzLmRpcnR5ID0gZmFsc2U7XG59O1xuXG4vKipcbiAqIERlcGVuZCBvbiBhbGwgZGVwcyBjb2xsZWN0ZWQgYnkgdGhpcyB3YXRjaGVyLlxuICovXG5XYXRjaGVyLnByb3RvdHlwZS5kZXBlbmQgPSBmdW5jdGlvbiBkZXBlbmQgKCkge1xuICAgIHZhciB0aGlzJDEgPSB0aGlzO1xuXG4gIHZhciBpID0gdGhpcy5kZXBzLmxlbmd0aDtcbiAgd2hpbGUgKGktLSkge1xuICAgIHRoaXMkMS5kZXBzW2ldLmRlcGVuZCgpO1xuICB9XG59O1xuXG4vKipcbiAqIFJlbW92ZSBzZWxmIGZyb20gYWxsIGRlcGVuZGVuY2llcycgc3Vic2NyaWJlciBsaXN0LlxuICovXG5XYXRjaGVyLnByb3RvdHlwZS50ZWFyZG93biA9IGZ1bmN0aW9uIHRlYXJkb3duICgpIHtcbiAgICB2YXIgdGhpcyQxID0gdGhpcztcblxuICBpZiAodGhpcy5hY3RpdmUpIHtcbiAgICAvLyByZW1vdmUgc2VsZiBmcm9tIHZtJ3Mgd2F0Y2hlciBsaXN0XG4gICAgLy8gdGhpcyBpcyBhIHNvbWV3aGF0IGV4cGVuc2l2ZSBvcGVyYXRpb24gc28gd2Ugc2tpcCBpdFxuICAgIC8vIGlmIHRoZSB2bSBpcyBiZWluZyBkZXN0cm95ZWQuXG4gICAgaWYgKCF0aGlzLnZtLl9pc0JlaW5nRGVzdHJveWVkKSB7XG4gICAgICByZW1vdmUodGhpcy52bS5fd2F0Y2hlcnMsIHRoaXMpO1xuICAgIH1cbiAgICB2YXIgaSA9IHRoaXMuZGVwcy5sZW5ndGg7XG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgdGhpcyQxLmRlcHNbaV0ucmVtb3ZlU3ViKHRoaXMkMSk7XG4gICAgfVxuICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XG4gIH1cbn07XG5cbi8qKlxuICogUmVjdXJzaXZlbHkgdHJhdmVyc2UgYW4gb2JqZWN0IHRvIGV2b2tlIGFsbCBjb252ZXJ0ZWRcbiAqIGdldHRlcnMsIHNvIHRoYXQgZXZlcnkgbmVzdGVkIHByb3BlcnR5IGluc2lkZSB0aGUgb2JqZWN0XG4gKiBpcyBjb2xsZWN0ZWQgYXMgYSBcImRlZXBcIiBkZXBlbmRlbmN5LlxuICovXG52YXIgc2Vlbk9iamVjdHMgPSBuZXcgX1NldCgpO1xuZnVuY3Rpb24gdHJhdmVyc2UgKHZhbCkge1xuICBzZWVuT2JqZWN0cy5jbGVhcigpO1xuICBfdHJhdmVyc2UodmFsLCBzZWVuT2JqZWN0cyk7XG59XG5cbmZ1bmN0aW9uIF90cmF2ZXJzZSAodmFsLCBzZWVuKSB7XG4gIHZhciBpLCBrZXlzO1xuICB2YXIgaXNBID0gQXJyYXkuaXNBcnJheSh2YWwpO1xuICBpZiAoKCFpc0EgJiYgIWlzT2JqZWN0KHZhbCkpIHx8ICFPYmplY3QuaXNFeHRlbnNpYmxlKHZhbCkpIHtcbiAgICByZXR1cm5cbiAgfVxuICBpZiAodmFsLl9fb2JfXykge1xuICAgIHZhciBkZXBJZCA9IHZhbC5fX29iX18uZGVwLmlkO1xuICAgIGlmIChzZWVuLmhhcyhkZXBJZCkpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBzZWVuLmFkZChkZXBJZCk7XG4gIH1cbiAgaWYgKGlzQSkge1xuICAgIGkgPSB2YWwubGVuZ3RoO1xuICAgIHdoaWxlIChpLS0pIHsgX3RyYXZlcnNlKHZhbFtpXSwgc2Vlbik7IH1cbiAgfSBlbHNlIHtcbiAgICBrZXlzID0gT2JqZWN0LmtleXModmFsKTtcbiAgICBpID0ga2V5cy5sZW5ndGg7XG4gICAgd2hpbGUgKGktLSkgeyBfdHJhdmVyc2UodmFsW2tleXNbaV1dLCBzZWVuKTsgfVxuICB9XG59XG5cbi8qICAqL1xuXG52YXIgc2hhcmVkUHJvcGVydHlEZWZpbml0aW9uID0ge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBjb25maWd1cmFibGU6IHRydWUsXG4gIGdldDogbm9vcCxcbiAgc2V0OiBub29wXG59O1xuXG5mdW5jdGlvbiBwcm94eSAodGFyZ2V0LCBzb3VyY2VLZXksIGtleSkge1xuICBzaGFyZWRQcm9wZXJ0eURlZmluaXRpb24uZ2V0ID0gZnVuY3Rpb24gcHJveHlHZXR0ZXIgKCkge1xuICAgIHJldHVybiB0aGlzW3NvdXJjZUtleV1ba2V5XVxuICB9O1xuICBzaGFyZWRQcm9wZXJ0eURlZmluaXRpb24uc2V0ID0gZnVuY3Rpb24gcHJveHlTZXR0ZXIgKHZhbCkge1xuICAgIHRoaXNbc291cmNlS2V5XVtrZXldID0gdmFsO1xuICB9O1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHNoYXJlZFByb3BlcnR5RGVmaW5pdGlvbik7XG59XG5cbmZ1bmN0aW9uIGluaXRTdGF0ZSAodm0pIHtcbiAgdm0uX3dhdGNoZXJzID0gW107XG4gIHZhciBvcHRzID0gdm0uJG9wdGlvbnM7XG4gIGlmIChvcHRzLnByb3BzKSB7IGluaXRQcm9wcyh2bSwgb3B0cy5wcm9wcyk7IH1cbiAgaWYgKG9wdHMubWV0aG9kcykgeyBpbml0TWV0aG9kcyh2bSwgb3B0cy5tZXRob2RzKTsgfVxuICBpZiAob3B0cy5kYXRhKSB7XG4gICAgaW5pdERhdGEodm0pO1xuICB9IGVsc2Uge1xuICAgIG9ic2VydmUodm0uX2RhdGEgPSB7fSwgdHJ1ZSAvKiBhc1Jvb3REYXRhICovKTtcbiAgfVxuICBpZiAob3B0cy5jb21wdXRlZCkgeyBpbml0Q29tcHV0ZWQodm0sIG9wdHMuY29tcHV0ZWQpOyB9XG4gIGlmIChvcHRzLndhdGNoKSB7IGluaXRXYXRjaCh2bSwgb3B0cy53YXRjaCk7IH1cbn1cblxudmFyIGlzUmVzZXJ2ZWRQcm9wID0geyBrZXk6IDEsIHJlZjogMSwgc2xvdDogMSB9O1xuXG5mdW5jdGlvbiBpbml0UHJvcHMgKHZtLCBwcm9wc09wdGlvbnMpIHtcbiAgdmFyIHByb3BzRGF0YSA9IHZtLiRvcHRpb25zLnByb3BzRGF0YSB8fCB7fTtcbiAgdmFyIHByb3BzID0gdm0uX3Byb3BzID0ge307XG4gIC8vIGNhY2hlIHByb3Aga2V5cyBzbyB0aGF0IGZ1dHVyZSBwcm9wcyB1cGRhdGVzIGNhbiBpdGVyYXRlIHVzaW5nIEFycmF5XG4gIC8vIGluc3RlYWQgb2YgZHluYW1pYyBvYmplY3Qga2V5IGVudW1lcmF0aW9uLlxuICB2YXIga2V5cyA9IHZtLiRvcHRpb25zLl9wcm9wS2V5cyA9IFtdO1xuICB2YXIgaXNSb290ID0gIXZtLiRwYXJlbnQ7XG4gIC8vIHJvb3QgaW5zdGFuY2UgcHJvcHMgc2hvdWxkIGJlIGNvbnZlcnRlZFxuICBvYnNlcnZlclN0YXRlLnNob3VsZENvbnZlcnQgPSBpc1Jvb3Q7XG4gIHZhciBsb29wID0gZnVuY3Rpb24gKCBrZXkgKSB7XG4gICAga2V5cy5wdXNoKGtleSk7XG4gICAgdmFyIHZhbHVlID0gdmFsaWRhdGVQcm9wKGtleSwgcHJvcHNPcHRpb25zLCBwcm9wc0RhdGEsIHZtKTtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgIHtcbiAgICAgIGlmIChpc1Jlc2VydmVkUHJvcFtrZXldKSB7XG4gICAgICAgIHdhcm4oXG4gICAgICAgICAgKFwiXFxcIlwiICsga2V5ICsgXCJcXFwiIGlzIGEgcmVzZXJ2ZWQgYXR0cmlidXRlIGFuZCBjYW5ub3QgYmUgdXNlZCBhcyBjb21wb25lbnQgcHJvcC5cIiksXG4gICAgICAgICAgdm1cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIGRlZmluZVJlYWN0aXZlJCQxKHByb3BzLCBrZXksIHZhbHVlLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh2bS4kcGFyZW50ICYmICFvYnNlcnZlclN0YXRlLmlzU2V0dGluZ1Byb3BzKSB7XG4gICAgICAgICAgd2FybihcbiAgICAgICAgICAgIFwiQXZvaWQgbXV0YXRpbmcgYSBwcm9wIGRpcmVjdGx5IHNpbmNlIHRoZSB2YWx1ZSB3aWxsIGJlIFwiICtcbiAgICAgICAgICAgIFwib3ZlcndyaXR0ZW4gd2hlbmV2ZXIgdGhlIHBhcmVudCBjb21wb25lbnQgcmUtcmVuZGVycy4gXCIgK1xuICAgICAgICAgICAgXCJJbnN0ZWFkLCB1c2UgYSBkYXRhIG9yIGNvbXB1dGVkIHByb3BlcnR5IGJhc2VkIG9uIHRoZSBwcm9wJ3MgXCIgK1xuICAgICAgICAgICAgXCJ2YWx1ZS4gUHJvcCBiZWluZyBtdXRhdGVkOiBcXFwiXCIgKyBrZXkgKyBcIlxcXCJcIixcbiAgICAgICAgICAgIHZtXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIC8vIHN0YXRpYyBwcm9wcyBhcmUgYWxyZWFkeSBwcm94aWVkIG9uIHRoZSBjb21wb25lbnQncyBwcm90b3R5cGVcbiAgICAvLyBkdXJpbmcgVnVlLmV4dGVuZCgpLiBXZSBvbmx5IG5lZWQgdG8gcHJveHkgcHJvcHMgZGVmaW5lZCBhdFxuICAgIC8vIGluc3RhbnRpYXRpb24gaGVyZS5cbiAgICBpZiAoIShrZXkgaW4gdm0pKSB7XG4gICAgICBwcm94eSh2bSwgXCJfcHJvcHNcIiwga2V5KTtcbiAgICB9XG4gIH07XG5cbiAgZm9yICh2YXIga2V5IGluIHByb3BzT3B0aW9ucykgbG9vcCgga2V5ICk7XG4gIG9ic2VydmVyU3RhdGUuc2hvdWxkQ29udmVydCA9IHRydWU7XG59XG5cbmZ1bmN0aW9uIGluaXREYXRhICh2bSkge1xuICB2YXIgZGF0YSA9IHZtLiRvcHRpb25zLmRhdGE7XG4gIGRhdGEgPSB2bS5fZGF0YSA9IHR5cGVvZiBkYXRhID09PSAnZnVuY3Rpb24nXG4gICAgPyBkYXRhLmNhbGwodm0pXG4gICAgOiBkYXRhIHx8IHt9O1xuICBpZiAoIWlzUGxhaW5PYmplY3QoZGF0YSkpIHtcbiAgICBkYXRhID0ge307XG4gICAgXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiYgd2FybihcbiAgICAgICdkYXRhIGZ1bmN0aW9ucyBzaG91bGQgcmV0dXJuIGFuIG9iamVjdDpcXG4nICtcbiAgICAgICdodHRwczovL3Z1ZWpzLm9yZy92Mi9ndWlkZS9jb21wb25lbnRzLmh0bWwjZGF0YS1NdXN0LUJlLWEtRnVuY3Rpb24nLFxuICAgICAgdm1cbiAgICApO1xuICB9XG4gIC8vIHByb3h5IGRhdGEgb24gaW5zdGFuY2VcbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhkYXRhKTtcbiAgdmFyIHByb3BzID0gdm0uJG9wdGlvbnMucHJvcHM7XG4gIHZhciBpID0ga2V5cy5sZW5ndGg7XG4gIHdoaWxlIChpLS0pIHtcbiAgICBpZiAocHJvcHMgJiYgaGFzT3duKHByb3BzLCBrZXlzW2ldKSkge1xuICAgICAgXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiYgd2FybihcbiAgICAgICAgXCJUaGUgZGF0YSBwcm9wZXJ0eSBcXFwiXCIgKyAoa2V5c1tpXSkgKyBcIlxcXCIgaXMgYWxyZWFkeSBkZWNsYXJlZCBhcyBhIHByb3AuIFwiICtcbiAgICAgICAgXCJVc2UgcHJvcCBkZWZhdWx0IHZhbHVlIGluc3RlYWQuXCIsXG4gICAgICAgIHZtXG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAoIWlzUmVzZXJ2ZWQoa2V5c1tpXSkpIHtcbiAgICAgIHByb3h5KHZtLCBcIl9kYXRhXCIsIGtleXNbaV0pO1xuICAgIH1cbiAgfVxuICAvLyBvYnNlcnZlIGRhdGFcbiAgb2JzZXJ2ZShkYXRhLCB0cnVlIC8qIGFzUm9vdERhdGEgKi8pO1xufVxuXG52YXIgY29tcHV0ZWRXYXRjaGVyT3B0aW9ucyA9IHsgbGF6eTogdHJ1ZSB9O1xuXG5mdW5jdGlvbiBpbml0Q29tcHV0ZWQgKHZtLCBjb21wdXRlZCkge1xuICB2YXIgd2F0Y2hlcnMgPSB2bS5fY29tcHV0ZWRXYXRjaGVycyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbiAgZm9yICh2YXIga2V5IGluIGNvbXB1dGVkKSB7XG4gICAgdmFyIHVzZXJEZWYgPSBjb21wdXRlZFtrZXldO1xuICAgIHZhciBnZXR0ZXIgPSB0eXBlb2YgdXNlckRlZiA9PT0gJ2Z1bmN0aW9uJyA/IHVzZXJEZWYgOiB1c2VyRGVmLmdldDtcbiAgICAvLyBjcmVhdGUgaW50ZXJuYWwgd2F0Y2hlciBmb3IgdGhlIGNvbXB1dGVkIHByb3BlcnR5LlxuICAgIHdhdGNoZXJzW2tleV0gPSBuZXcgV2F0Y2hlcih2bSwgZ2V0dGVyLCBub29wLCBjb21wdXRlZFdhdGNoZXJPcHRpb25zKTtcblxuICAgIC8vIGNvbXBvbmVudC1kZWZpbmVkIGNvbXB1dGVkIHByb3BlcnRpZXMgYXJlIGFscmVhZHkgZGVmaW5lZCBvbiB0aGVcbiAgICAvLyBjb21wb25lbnQgcHJvdG90eXBlLiBXZSBvbmx5IG5lZWQgdG8gZGVmaW5lIGNvbXB1dGVkIHByb3BlcnRpZXMgZGVmaW5lZFxuICAgIC8vIGF0IGluc3RhbnRpYXRpb24gaGVyZS5cbiAgICBpZiAoIShrZXkgaW4gdm0pKSB7XG4gICAgICBkZWZpbmVDb21wdXRlZCh2bSwga2V5LCB1c2VyRGVmKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZGVmaW5lQ29tcHV0ZWQgKHRhcmdldCwga2V5LCB1c2VyRGVmKSB7XG4gIGlmICh0eXBlb2YgdXNlckRlZiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHNoYXJlZFByb3BlcnR5RGVmaW5pdGlvbi5nZXQgPSBjcmVhdGVDb21wdXRlZEdldHRlcihrZXkpO1xuICAgIHNoYXJlZFByb3BlcnR5RGVmaW5pdGlvbi5zZXQgPSBub29wO1xuICB9IGVsc2Uge1xuICAgIHNoYXJlZFByb3BlcnR5RGVmaW5pdGlvbi5nZXQgPSB1c2VyRGVmLmdldFxuICAgICAgPyB1c2VyRGVmLmNhY2hlICE9PSBmYWxzZVxuICAgICAgICA/IGNyZWF0ZUNvbXB1dGVkR2V0dGVyKGtleSlcbiAgICAgICAgOiB1c2VyRGVmLmdldFxuICAgICAgOiBub29wO1xuICAgIHNoYXJlZFByb3BlcnR5RGVmaW5pdGlvbi5zZXQgPSB1c2VyRGVmLnNldFxuICAgICAgPyB1c2VyRGVmLnNldFxuICAgICAgOiBub29wO1xuICB9XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgc2hhcmVkUHJvcGVydHlEZWZpbml0aW9uKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlQ29tcHV0ZWRHZXR0ZXIgKGtleSkge1xuICByZXR1cm4gZnVuY3Rpb24gY29tcHV0ZWRHZXR0ZXIgKCkge1xuICAgIHZhciB3YXRjaGVyID0gdGhpcy5fY29tcHV0ZWRXYXRjaGVycyAmJiB0aGlzLl9jb21wdXRlZFdhdGNoZXJzW2tleV07XG4gICAgaWYgKHdhdGNoZXIpIHtcbiAgICAgIGlmICh3YXRjaGVyLmRpcnR5KSB7XG4gICAgICAgIHdhdGNoZXIuZXZhbHVhdGUoKTtcbiAgICAgIH1cbiAgICAgIGlmIChEZXAudGFyZ2V0KSB7XG4gICAgICAgIHdhdGNoZXIuZGVwZW5kKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gd2F0Y2hlci52YWx1ZVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBpbml0TWV0aG9kcyAodm0sIG1ldGhvZHMpIHtcbiAgdmFyIHByb3BzID0gdm0uJG9wdGlvbnMucHJvcHM7XG4gIGZvciAodmFyIGtleSBpbiBtZXRob2RzKSB7XG4gICAgdm1ba2V5XSA9IG1ldGhvZHNba2V5XSA9PSBudWxsID8gbm9vcCA6IGJpbmQobWV0aG9kc1trZXldLCB2bSk7XG4gICAge1xuICAgICAgaWYgKG1ldGhvZHNba2V5XSA9PSBudWxsKSB7XG4gICAgICAgIHdhcm4oXG4gICAgICAgICAgXCJtZXRob2QgXFxcIlwiICsga2V5ICsgXCJcXFwiIGhhcyBhbiB1bmRlZmluZWQgdmFsdWUgaW4gdGhlIGNvbXBvbmVudCBkZWZpbml0aW9uLiBcIiArXG4gICAgICAgICAgXCJEaWQgeW91IHJlZmVyZW5jZSB0aGUgZnVuY3Rpb24gY29ycmVjdGx5P1wiLFxuICAgICAgICAgIHZtXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBpZiAocHJvcHMgJiYgaGFzT3duKHByb3BzLCBrZXkpKSB7XG4gICAgICAgIHdhcm4oXG4gICAgICAgICAgKFwibWV0aG9kIFxcXCJcIiArIGtleSArIFwiXFxcIiBoYXMgYWxyZWFkeSBiZWVuIGRlZmluZWQgYXMgYSBwcm9wLlwiKSxcbiAgICAgICAgICB2bVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBpbml0V2F0Y2ggKHZtLCB3YXRjaCkge1xuICBmb3IgKHZhciBrZXkgaW4gd2F0Y2gpIHtcbiAgICB2YXIgaGFuZGxlciA9IHdhdGNoW2tleV07XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoaGFuZGxlcikpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaGFuZGxlci5sZW5ndGg7IGkrKykge1xuICAgICAgICBjcmVhdGVXYXRjaGVyKHZtLCBrZXksIGhhbmRsZXJbaV0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjcmVhdGVXYXRjaGVyKHZtLCBrZXksIGhhbmRsZXIpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVXYXRjaGVyICh2bSwga2V5LCBoYW5kbGVyKSB7XG4gIHZhciBvcHRpb25zO1xuICBpZiAoaXNQbGFpbk9iamVjdChoYW5kbGVyKSkge1xuICAgIG9wdGlvbnMgPSBoYW5kbGVyO1xuICAgIGhhbmRsZXIgPSBoYW5kbGVyLmhhbmRsZXI7XG4gIH1cbiAgaWYgKHR5cGVvZiBoYW5kbGVyID09PSAnc3RyaW5nJykge1xuICAgIGhhbmRsZXIgPSB2bVtoYW5kbGVyXTtcbiAgfVxuICB2bS4kd2F0Y2goa2V5LCBoYW5kbGVyLCBvcHRpb25zKTtcbn1cblxuZnVuY3Rpb24gc3RhdGVNaXhpbiAoVnVlKSB7XG4gIC8vIGZsb3cgc29tZWhvdyBoYXMgcHJvYmxlbXMgd2l0aCBkaXJlY3RseSBkZWNsYXJlZCBkZWZpbml0aW9uIG9iamVjdFxuICAvLyB3aGVuIHVzaW5nIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSwgc28gd2UgaGF2ZSB0byBwcm9jZWR1cmFsbHkgYnVpbGQgdXBcbiAgLy8gdGhlIG9iamVjdCBoZXJlLlxuICB2YXIgZGF0YURlZiA9IHt9O1xuICBkYXRhRGVmLmdldCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXMuX2RhdGEgfTtcbiAgdmFyIHByb3BzRGVmID0ge307XG4gIHByb3BzRGVmLmdldCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXMuX3Byb3BzIH07XG4gIHtcbiAgICBkYXRhRGVmLnNldCA9IGZ1bmN0aW9uIChuZXdEYXRhKSB7XG4gICAgICB3YXJuKFxuICAgICAgICAnQXZvaWQgcmVwbGFjaW5nIGluc3RhbmNlIHJvb3QgJGRhdGEuICcgK1xuICAgICAgICAnVXNlIG5lc3RlZCBkYXRhIHByb3BlcnRpZXMgaW5zdGVhZC4nLFxuICAgICAgICB0aGlzXG4gICAgICApO1xuICAgIH07XG4gICAgcHJvcHNEZWYuc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgd2FybihcIiRwcm9wcyBpcyByZWFkb25seS5cIiwgdGhpcyk7XG4gICAgfTtcbiAgfVxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoVnVlLnByb3RvdHlwZSwgJyRkYXRhJywgZGF0YURlZik7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShWdWUucHJvdG90eXBlLCAnJHByb3BzJywgcHJvcHNEZWYpO1xuXG4gIFZ1ZS5wcm90b3R5cGUuJHNldCA9IHNldDtcbiAgVnVlLnByb3RvdHlwZS4kZGVsZXRlID0gZGVsO1xuXG4gIFZ1ZS5wcm90b3R5cGUuJHdhdGNoID0gZnVuY3Rpb24gKFxuICAgIGV4cE9yRm4sXG4gICAgY2IsXG4gICAgb3B0aW9uc1xuICApIHtcbiAgICB2YXIgdm0gPSB0aGlzO1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIG9wdGlvbnMudXNlciA9IHRydWU7XG4gICAgdmFyIHdhdGNoZXIgPSBuZXcgV2F0Y2hlcih2bSwgZXhwT3JGbiwgY2IsIG9wdGlvbnMpO1xuICAgIGlmIChvcHRpb25zLmltbWVkaWF0ZSkge1xuICAgICAgY2IuY2FsbCh2bSwgd2F0Y2hlci52YWx1ZSk7XG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbiB1bndhdGNoRm4gKCkge1xuICAgICAgd2F0Y2hlci50ZWFyZG93bigpO1xuICAgIH1cbiAgfTtcbn1cblxuLyogICovXG5cbnZhciBob29rcyA9IHsgaW5pdDogaW5pdCwgcHJlcGF0Y2g6IHByZXBhdGNoLCBpbnNlcnQ6IGluc2VydCwgZGVzdHJveTogZGVzdHJveSB9O1xudmFyIGhvb2tzVG9NZXJnZSA9IE9iamVjdC5rZXlzKGhvb2tzKTtcblxuZnVuY3Rpb24gY3JlYXRlQ29tcG9uZW50IChcbiAgQ3RvcixcbiAgZGF0YSxcbiAgY29udGV4dCxcbiAgY2hpbGRyZW4sXG4gIHRhZ1xuKSB7XG4gIGlmICghQ3Rvcikge1xuICAgIHJldHVyblxuICB9XG5cbiAgdmFyIGJhc2VDdG9yID0gY29udGV4dC4kb3B0aW9ucy5fYmFzZTtcbiAgaWYgKGlzT2JqZWN0KEN0b3IpKSB7XG4gICAgQ3RvciA9IGJhc2VDdG9yLmV4dGVuZChDdG9yKTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgQ3RvciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHtcbiAgICAgIHdhcm4oKFwiSW52YWxpZCBDb21wb25lbnQgZGVmaW5pdGlvbjogXCIgKyAoU3RyaW5nKEN0b3IpKSksIGNvbnRleHQpO1xuICAgIH1cbiAgICByZXR1cm5cbiAgfVxuXG4gIC8vIGFzeW5jIGNvbXBvbmVudFxuICBpZiAoIUN0b3IuY2lkKSB7XG4gICAgaWYgKEN0b3IucmVzb2x2ZWQpIHtcbiAgICAgIEN0b3IgPSBDdG9yLnJlc29sdmVkO1xuICAgIH0gZWxzZSB7XG4gICAgICBDdG9yID0gcmVzb2x2ZUFzeW5jQ29tcG9uZW50KEN0b3IsIGJhc2VDdG9yLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIGl0J3Mgb2sgdG8gcXVldWUgdGhpcyBvbiBldmVyeSByZW5kZXIgYmVjYXVzZVxuICAgICAgICAvLyAkZm9yY2VVcGRhdGUgaXMgYnVmZmVyZWQgYnkgdGhlIHNjaGVkdWxlci5cbiAgICAgICAgY29udGV4dC4kZm9yY2VVcGRhdGUoKTtcbiAgICAgIH0pO1xuICAgICAgaWYgKCFDdG9yKSB7XG4gICAgICAgIC8vIHJldHVybiBub3RoaW5nIGlmIHRoaXMgaXMgaW5kZWVkIGFuIGFzeW5jIGNvbXBvbmVudFxuICAgICAgICAvLyB3YWl0IGZvciB0aGUgY2FsbGJhY2sgdG8gdHJpZ2dlciBwYXJlbnQgdXBkYXRlLlxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyByZXNvbHZlIGNvbnN0cnVjdG9yIG9wdGlvbnMgaW4gY2FzZSBnbG9iYWwgbWl4aW5zIGFyZSBhcHBsaWVkIGFmdGVyXG4gIC8vIGNvbXBvbmVudCBjb25zdHJ1Y3RvciBjcmVhdGlvblxuICByZXNvbHZlQ29uc3RydWN0b3JPcHRpb25zKEN0b3IpO1xuXG4gIGRhdGEgPSBkYXRhIHx8IHt9O1xuXG4gIC8vIHRyYW5zZm9ybSBjb21wb25lbnQgdi1tb2RlbCBkYXRhIGludG8gcHJvcHMgJiBldmVudHNcbiAgaWYgKGRhdGEubW9kZWwpIHtcbiAgICB0cmFuc2Zvcm1Nb2RlbChDdG9yLm9wdGlvbnMsIGRhdGEpO1xuICB9XG5cbiAgLy8gZXh0cmFjdCBwcm9wc1xuICB2YXIgcHJvcHNEYXRhID0gZXh0cmFjdFByb3BzKGRhdGEsIEN0b3IpO1xuXG4gIC8vIGZ1bmN0aW9uYWwgY29tcG9uZW50XG4gIGlmIChDdG9yLm9wdGlvbnMuZnVuY3Rpb25hbCkge1xuICAgIHJldHVybiBjcmVhdGVGdW5jdGlvbmFsQ29tcG9uZW50KEN0b3IsIHByb3BzRGF0YSwgZGF0YSwgY29udGV4dCwgY2hpbGRyZW4pXG4gIH1cblxuICAvLyBleHRyYWN0IGxpc3RlbmVycywgc2luY2UgdGhlc2UgbmVlZHMgdG8gYmUgdHJlYXRlZCBhc1xuICAvLyBjaGlsZCBjb21wb25lbnQgbGlzdGVuZXJzIGluc3RlYWQgb2YgRE9NIGxpc3RlbmVyc1xuICB2YXIgbGlzdGVuZXJzID0gZGF0YS5vbjtcbiAgLy8gcmVwbGFjZSB3aXRoIGxpc3RlbmVycyB3aXRoIC5uYXRpdmUgbW9kaWZpZXJcbiAgZGF0YS5vbiA9IGRhdGEubmF0aXZlT247XG5cbiAgaWYgKEN0b3Iub3B0aW9ucy5hYnN0cmFjdCkge1xuICAgIC8vIGFic3RyYWN0IGNvbXBvbmVudHMgZG8gbm90IGtlZXAgYW55dGhpbmdcbiAgICAvLyBvdGhlciB0aGFuIHByb3BzICYgbGlzdGVuZXJzXG4gICAgZGF0YSA9IHt9O1xuICB9XG5cbiAgLy8gbWVyZ2UgY29tcG9uZW50IG1hbmFnZW1lbnQgaG9va3Mgb250byB0aGUgcGxhY2Vob2xkZXIgbm9kZVxuICBtZXJnZUhvb2tzKGRhdGEpO1xuXG4gIC8vIHJldHVybiBhIHBsYWNlaG9sZGVyIHZub2RlXG4gIHZhciBuYW1lID0gQ3Rvci5vcHRpb25zLm5hbWUgfHwgdGFnO1xuICB2YXIgdm5vZGUgPSBuZXcgVk5vZGUoXG4gICAgKFwidnVlLWNvbXBvbmVudC1cIiArIChDdG9yLmNpZCkgKyAobmFtZSA/IChcIi1cIiArIG5hbWUpIDogJycpKSxcbiAgICBkYXRhLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBjb250ZXh0LFxuICAgIHsgQ3RvcjogQ3RvciwgcHJvcHNEYXRhOiBwcm9wc0RhdGEsIGxpc3RlbmVyczogbGlzdGVuZXJzLCB0YWc6IHRhZywgY2hpbGRyZW46IGNoaWxkcmVuIH1cbiAgKTtcbiAgcmV0dXJuIHZub2RlXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUZ1bmN0aW9uYWxDb21wb25lbnQgKFxuICBDdG9yLFxuICBwcm9wc0RhdGEsXG4gIGRhdGEsXG4gIGNvbnRleHQsXG4gIGNoaWxkcmVuXG4pIHtcbiAgdmFyIHByb3BzID0ge307XG4gIHZhciBwcm9wT3B0aW9ucyA9IEN0b3Iub3B0aW9ucy5wcm9wcztcbiAgaWYgKHByb3BPcHRpb25zKSB7XG4gICAgZm9yICh2YXIga2V5IGluIHByb3BPcHRpb25zKSB7XG4gICAgICBwcm9wc1trZXldID0gdmFsaWRhdGVQcm9wKGtleSwgcHJvcE9wdGlvbnMsIHByb3BzRGF0YSk7XG4gICAgfVxuICB9XG4gIC8vIGVuc3VyZSB0aGUgY3JlYXRlRWxlbWVudCBmdW5jdGlvbiBpbiBmdW5jdGlvbmFsIGNvbXBvbmVudHNcbiAgLy8gZ2V0cyBhIHVuaXF1ZSBjb250ZXh0IC0gdGhpcyBpcyBuZWNlc3NhcnkgZm9yIGNvcnJlY3QgbmFtZWQgc2xvdCBjaGVja1xuICB2YXIgX2NvbnRleHQgPSBPYmplY3QuY3JlYXRlKGNvbnRleHQpO1xuICB2YXIgaCA9IGZ1bmN0aW9uIChhLCBiLCBjLCBkKSB7IHJldHVybiBjcmVhdGVFbGVtZW50KF9jb250ZXh0LCBhLCBiLCBjLCBkLCB0cnVlKTsgfTtcbiAgdmFyIHZub2RlID0gQ3Rvci5vcHRpb25zLnJlbmRlci5jYWxsKG51bGwsIGgsIHtcbiAgICBwcm9wczogcHJvcHMsXG4gICAgZGF0YTogZGF0YSxcbiAgICBwYXJlbnQ6IGNvbnRleHQsXG4gICAgY2hpbGRyZW46IGNoaWxkcmVuLFxuICAgIHNsb3RzOiBmdW5jdGlvbiAoKSB7IHJldHVybiByZXNvbHZlU2xvdHMoY2hpbGRyZW4sIGNvbnRleHQpOyB9XG4gIH0pO1xuICBpZiAodm5vZGUgaW5zdGFuY2VvZiBWTm9kZSkge1xuICAgIHZub2RlLmZ1bmN0aW9uYWxDb250ZXh0ID0gY29udGV4dDtcbiAgICBpZiAoZGF0YS5zbG90KSB7XG4gICAgICAodm5vZGUuZGF0YSB8fCAodm5vZGUuZGF0YSA9IHt9KSkuc2xvdCA9IGRhdGEuc2xvdDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHZub2RlXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUNvbXBvbmVudEluc3RhbmNlRm9yVm5vZGUgKFxuICB2bm9kZSwgLy8gd2Uga25vdyBpdCdzIE1vdW50ZWRDb21wb25lbnRWTm9kZSBidXQgZmxvdyBkb2Vzbid0XG4gIHBhcmVudCwgLy8gYWN0aXZlSW5zdGFuY2UgaW4gbGlmZWN5Y2xlIHN0YXRlXG4gIHBhcmVudEVsbSxcbiAgcmVmRWxtXG4pIHtcbiAgdmFyIHZub2RlQ29tcG9uZW50T3B0aW9ucyA9IHZub2RlLmNvbXBvbmVudE9wdGlvbnM7XG4gIHZhciBvcHRpb25zID0ge1xuICAgIF9pc0NvbXBvbmVudDogdHJ1ZSxcbiAgICBwYXJlbnQ6IHBhcmVudCxcbiAgICBwcm9wc0RhdGE6IHZub2RlQ29tcG9uZW50T3B0aW9ucy5wcm9wc0RhdGEsXG4gICAgX2NvbXBvbmVudFRhZzogdm5vZGVDb21wb25lbnRPcHRpb25zLnRhZyxcbiAgICBfcGFyZW50Vm5vZGU6IHZub2RlLFxuICAgIF9wYXJlbnRMaXN0ZW5lcnM6IHZub2RlQ29tcG9uZW50T3B0aW9ucy5saXN0ZW5lcnMsXG4gICAgX3JlbmRlckNoaWxkcmVuOiB2bm9kZUNvbXBvbmVudE9wdGlvbnMuY2hpbGRyZW4sXG4gICAgX3BhcmVudEVsbTogcGFyZW50RWxtIHx8IG51bGwsXG4gICAgX3JlZkVsbTogcmVmRWxtIHx8IG51bGxcbiAgfTtcbiAgLy8gY2hlY2sgaW5saW5lLXRlbXBsYXRlIHJlbmRlciBmdW5jdGlvbnNcbiAgdmFyIGlubGluZVRlbXBsYXRlID0gdm5vZGUuZGF0YS5pbmxpbmVUZW1wbGF0ZTtcbiAgaWYgKGlubGluZVRlbXBsYXRlKSB7XG4gICAgb3B0aW9ucy5yZW5kZXIgPSBpbmxpbmVUZW1wbGF0ZS5yZW5kZXI7XG4gICAgb3B0aW9ucy5zdGF0aWNSZW5kZXJGbnMgPSBpbmxpbmVUZW1wbGF0ZS5zdGF0aWNSZW5kZXJGbnM7XG4gIH1cbiAgcmV0dXJuIG5ldyB2bm9kZUNvbXBvbmVudE9wdGlvbnMuQ3RvcihvcHRpb25zKVxufVxuXG5mdW5jdGlvbiBpbml0IChcbiAgdm5vZGUsXG4gIGh5ZHJhdGluZyxcbiAgcGFyZW50RWxtLFxuICByZWZFbG1cbikge1xuICBpZiAoIXZub2RlLmNvbXBvbmVudEluc3RhbmNlIHx8IHZub2RlLmNvbXBvbmVudEluc3RhbmNlLl9pc0Rlc3Ryb3llZCkge1xuICAgIHZhciBjaGlsZCA9IHZub2RlLmNvbXBvbmVudEluc3RhbmNlID0gY3JlYXRlQ29tcG9uZW50SW5zdGFuY2VGb3JWbm9kZShcbiAgICAgIHZub2RlLFxuICAgICAgYWN0aXZlSW5zdGFuY2UsXG4gICAgICBwYXJlbnRFbG0sXG4gICAgICByZWZFbG1cbiAgICApO1xuICAgIGNoaWxkLiRtb3VudChoeWRyYXRpbmcgPyB2bm9kZS5lbG0gOiB1bmRlZmluZWQsIGh5ZHJhdGluZyk7XG4gIH0gZWxzZSBpZiAodm5vZGUuZGF0YS5rZWVwQWxpdmUpIHtcbiAgICAvLyBrZXB0LWFsaXZlIGNvbXBvbmVudHMsIHRyZWF0IGFzIGEgcGF0Y2hcbiAgICB2YXIgbW91bnRlZE5vZGUgPSB2bm9kZTsgLy8gd29yayBhcm91bmQgZmxvd1xuICAgIHByZXBhdGNoKG1vdW50ZWROb2RlLCBtb3VudGVkTm9kZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcHJlcGF0Y2ggKFxuICBvbGRWbm9kZSxcbiAgdm5vZGVcbikge1xuICB2YXIgb3B0aW9ucyA9IHZub2RlLmNvbXBvbmVudE9wdGlvbnM7XG4gIHZhciBjaGlsZCA9IHZub2RlLmNvbXBvbmVudEluc3RhbmNlID0gb2xkVm5vZGUuY29tcG9uZW50SW5zdGFuY2U7XG4gIHVwZGF0ZUNoaWxkQ29tcG9uZW50KFxuICAgIGNoaWxkLFxuICAgIG9wdGlvbnMucHJvcHNEYXRhLCAvLyB1cGRhdGVkIHByb3BzXG4gICAgb3B0aW9ucy5saXN0ZW5lcnMsIC8vIHVwZGF0ZWQgbGlzdGVuZXJzXG4gICAgdm5vZGUsIC8vIG5ldyBwYXJlbnQgdm5vZGVcbiAgICBvcHRpb25zLmNoaWxkcmVuIC8vIG5ldyBjaGlsZHJlblxuICApO1xufVxuXG5mdW5jdGlvbiBpbnNlcnQgKHZub2RlKSB7XG4gIGlmICghdm5vZGUuY29tcG9uZW50SW5zdGFuY2UuX2lzTW91bnRlZCkge1xuICAgIHZub2RlLmNvbXBvbmVudEluc3RhbmNlLl9pc01vdW50ZWQgPSB0cnVlO1xuICAgIGNhbGxIb29rKHZub2RlLmNvbXBvbmVudEluc3RhbmNlLCAnbW91bnRlZCcpO1xuICB9XG4gIGlmICh2bm9kZS5kYXRhLmtlZXBBbGl2ZSkge1xuICAgIGFjdGl2YXRlQ2hpbGRDb21wb25lbnQodm5vZGUuY29tcG9uZW50SW5zdGFuY2UsIHRydWUgLyogZGlyZWN0ICovKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBkZXN0cm95ICh2bm9kZSkge1xuICBpZiAoIXZub2RlLmNvbXBvbmVudEluc3RhbmNlLl9pc0Rlc3Ryb3llZCkge1xuICAgIGlmICghdm5vZGUuZGF0YS5rZWVwQWxpdmUpIHtcbiAgICAgIHZub2RlLmNvbXBvbmVudEluc3RhbmNlLiRkZXN0cm95KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlYWN0aXZhdGVDaGlsZENvbXBvbmVudCh2bm9kZS5jb21wb25lbnRJbnN0YW5jZSwgdHJ1ZSAvKiBkaXJlY3QgKi8pO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiByZXNvbHZlQXN5bmNDb21wb25lbnQgKFxuICBmYWN0b3J5LFxuICBiYXNlQ3RvcixcbiAgY2Jcbikge1xuICBpZiAoZmFjdG9yeS5yZXF1ZXN0ZWQpIHtcbiAgICAvLyBwb29sIGNhbGxiYWNrc1xuICAgIGZhY3RvcnkucGVuZGluZ0NhbGxiYWNrcy5wdXNoKGNiKTtcbiAgfSBlbHNlIHtcbiAgICBmYWN0b3J5LnJlcXVlc3RlZCA9IHRydWU7XG4gICAgdmFyIGNicyA9IGZhY3RvcnkucGVuZGluZ0NhbGxiYWNrcyA9IFtjYl07XG4gICAgdmFyIHN5bmMgPSB0cnVlO1xuXG4gICAgdmFyIHJlc29sdmUgPSBmdW5jdGlvbiAocmVzKSB7XG4gICAgICBpZiAoaXNPYmplY3QocmVzKSkge1xuICAgICAgICByZXMgPSBiYXNlQ3Rvci5leHRlbmQocmVzKTtcbiAgICAgIH1cbiAgICAgIC8vIGNhY2hlIHJlc29sdmVkXG4gICAgICBmYWN0b3J5LnJlc29sdmVkID0gcmVzO1xuICAgICAgLy8gaW52b2tlIGNhbGxiYWNrcyBvbmx5IGlmIHRoaXMgaXMgbm90IGEgc3luY2hyb25vdXMgcmVzb2x2ZVxuICAgICAgLy8gKGFzeW5jIHJlc29sdmVzIGFyZSBzaGltbWVkIGFzIHN5bmNocm9ub3VzIGR1cmluZyBTU1IpXG4gICAgICBpZiAoIXN5bmMpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBjYnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgY2JzW2ldKHJlcyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIHJlamVjdCA9IGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgIFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmIHdhcm4oXG4gICAgICAgIFwiRmFpbGVkIHRvIHJlc29sdmUgYXN5bmMgY29tcG9uZW50OiBcIiArIChTdHJpbmcoZmFjdG9yeSkpICtcbiAgICAgICAgKHJlYXNvbiA/IChcIlxcblJlYXNvbjogXCIgKyByZWFzb24pIDogJycpXG4gICAgICApO1xuICAgIH07XG5cbiAgICB2YXIgcmVzID0gZmFjdG9yeShyZXNvbHZlLCByZWplY3QpO1xuXG4gICAgLy8gaGFuZGxlIHByb21pc2VcbiAgICBpZiAocmVzICYmIHR5cGVvZiByZXMudGhlbiA9PT0gJ2Z1bmN0aW9uJyAmJiAhZmFjdG9yeS5yZXNvbHZlZCkge1xuICAgICAgcmVzLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcbiAgICB9XG5cbiAgICBzeW5jID0gZmFsc2U7XG4gICAgLy8gcmV0dXJuIGluIGNhc2UgcmVzb2x2ZWQgc3luY2hyb25vdXNseVxuICAgIHJldHVybiBmYWN0b3J5LnJlc29sdmVkXG4gIH1cbn1cblxuZnVuY3Rpb24gZXh0cmFjdFByb3BzIChkYXRhLCBDdG9yKSB7XG4gIC8vIHdlIGFyZSBvbmx5IGV4dHJhY3RpbmcgcmF3IHZhbHVlcyBoZXJlLlxuICAvLyB2YWxpZGF0aW9uIGFuZCBkZWZhdWx0IHZhbHVlcyBhcmUgaGFuZGxlZCBpbiB0aGUgY2hpbGRcbiAgLy8gY29tcG9uZW50IGl0c2VsZi5cbiAgdmFyIHByb3BPcHRpb25zID0gQ3Rvci5vcHRpb25zLnByb3BzO1xuICBpZiAoIXByb3BPcHRpb25zKSB7XG4gICAgcmV0dXJuXG4gIH1cbiAgdmFyIHJlcyA9IHt9O1xuICB2YXIgYXR0cnMgPSBkYXRhLmF0dHJzO1xuICB2YXIgcHJvcHMgPSBkYXRhLnByb3BzO1xuICB2YXIgZG9tUHJvcHMgPSBkYXRhLmRvbVByb3BzO1xuICBpZiAoYXR0cnMgfHwgcHJvcHMgfHwgZG9tUHJvcHMpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gcHJvcE9wdGlvbnMpIHtcbiAgICAgIHZhciBhbHRLZXkgPSBoeXBoZW5hdGUoa2V5KTtcbiAgICAgIGNoZWNrUHJvcChyZXMsIHByb3BzLCBrZXksIGFsdEtleSwgdHJ1ZSkgfHxcbiAgICAgIGNoZWNrUHJvcChyZXMsIGF0dHJzLCBrZXksIGFsdEtleSkgfHxcbiAgICAgIGNoZWNrUHJvcChyZXMsIGRvbVByb3BzLCBrZXksIGFsdEtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXNcbn1cblxuZnVuY3Rpb24gY2hlY2tQcm9wIChcbiAgcmVzLFxuICBoYXNoLFxuICBrZXksXG4gIGFsdEtleSxcbiAgcHJlc2VydmVcbikge1xuICBpZiAoaGFzaCkge1xuICAgIGlmIChoYXNPd24oaGFzaCwga2V5KSkge1xuICAgICAgcmVzW2tleV0gPSBoYXNoW2tleV07XG4gICAgICBpZiAoIXByZXNlcnZlKSB7XG4gICAgICAgIGRlbGV0ZSBoYXNoW2tleV07XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH0gZWxzZSBpZiAoaGFzT3duKGhhc2gsIGFsdEtleSkpIHtcbiAgICAgIHJlc1trZXldID0gaGFzaFthbHRLZXldO1xuICAgICAgaWYgKCFwcmVzZXJ2ZSkge1xuICAgICAgICBkZWxldGUgaGFzaFthbHRLZXldO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlXG59XG5cbmZ1bmN0aW9uIG1lcmdlSG9va3MgKGRhdGEpIHtcbiAgaWYgKCFkYXRhLmhvb2spIHtcbiAgICBkYXRhLmhvb2sgPSB7fTtcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGhvb2tzVG9NZXJnZS5sZW5ndGg7IGkrKykge1xuICAgIHZhciBrZXkgPSBob29rc1RvTWVyZ2VbaV07XG4gICAgdmFyIGZyb21QYXJlbnQgPSBkYXRhLmhvb2tba2V5XTtcbiAgICB2YXIgb3VycyA9IGhvb2tzW2tleV07XG4gICAgZGF0YS5ob29rW2tleV0gPSBmcm9tUGFyZW50ID8gbWVyZ2VIb29rJDEob3VycywgZnJvbVBhcmVudCkgOiBvdXJzO1xuICB9XG59XG5cbmZ1bmN0aW9uIG1lcmdlSG9vayQxIChvbmUsIHR3bykge1xuICByZXR1cm4gZnVuY3Rpb24gKGEsIGIsIGMsIGQpIHtcbiAgICBvbmUoYSwgYiwgYywgZCk7XG4gICAgdHdvKGEsIGIsIGMsIGQpO1xuICB9XG59XG5cbi8vIHRyYW5zZm9ybSBjb21wb25lbnQgdi1tb2RlbCBpbmZvICh2YWx1ZSBhbmQgY2FsbGJhY2spIGludG9cbi8vIHByb3AgYW5kIGV2ZW50IGhhbmRsZXIgcmVzcGVjdGl2ZWx5LlxuZnVuY3Rpb24gdHJhbnNmb3JtTW9kZWwgKG9wdGlvbnMsIGRhdGEpIHtcbiAgdmFyIHByb3AgPSAob3B0aW9ucy5tb2RlbCAmJiBvcHRpb25zLm1vZGVsLnByb3ApIHx8ICd2YWx1ZSc7XG4gIHZhciBldmVudCA9IChvcHRpb25zLm1vZGVsICYmIG9wdGlvbnMubW9kZWwuZXZlbnQpIHx8ICdpbnB1dCc7KGRhdGEucHJvcHMgfHwgKGRhdGEucHJvcHMgPSB7fSkpW3Byb3BdID0gZGF0YS5tb2RlbC52YWx1ZTtcbiAgdmFyIG9uID0gZGF0YS5vbiB8fCAoZGF0YS5vbiA9IHt9KTtcbiAgaWYgKG9uW2V2ZW50XSkge1xuICAgIG9uW2V2ZW50XSA9IFtkYXRhLm1vZGVsLmNhbGxiYWNrXS5jb25jYXQob25bZXZlbnRdKTtcbiAgfSBlbHNlIHtcbiAgICBvbltldmVudF0gPSBkYXRhLm1vZGVsLmNhbGxiYWNrO1xuICB9XG59XG5cbi8qICAqL1xuXG52YXIgU0lNUExFX05PUk1BTElaRSA9IDE7XG52YXIgQUxXQVlTX05PUk1BTElaRSA9IDI7XG5cbi8vIHdyYXBwZXIgZnVuY3Rpb24gZm9yIHByb3ZpZGluZyBhIG1vcmUgZmxleGlibGUgaW50ZXJmYWNlXG4vLyB3aXRob3V0IGdldHRpbmcgeWVsbGVkIGF0IGJ5IGZsb3dcbmZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQgKFxuICBjb250ZXh0LFxuICB0YWcsXG4gIGRhdGEsXG4gIGNoaWxkcmVuLFxuICBub3JtYWxpemF0aW9uVHlwZSxcbiAgYWx3YXlzTm9ybWFsaXplXG4pIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YSkgfHwgaXNQcmltaXRpdmUoZGF0YSkpIHtcbiAgICBub3JtYWxpemF0aW9uVHlwZSA9IGNoaWxkcmVuO1xuICAgIGNoaWxkcmVuID0gZGF0YTtcbiAgICBkYXRhID0gdW5kZWZpbmVkO1xuICB9XG4gIGlmIChhbHdheXNOb3JtYWxpemUpIHsgbm9ybWFsaXphdGlvblR5cGUgPSBBTFdBWVNfTk9STUFMSVpFOyB9XG4gIHJldHVybiBfY3JlYXRlRWxlbWVudChjb250ZXh0LCB0YWcsIGRhdGEsIGNoaWxkcmVuLCBub3JtYWxpemF0aW9uVHlwZSlcbn1cblxuZnVuY3Rpb24gX2NyZWF0ZUVsZW1lbnQgKFxuICBjb250ZXh0LFxuICB0YWcsXG4gIGRhdGEsXG4gIGNoaWxkcmVuLFxuICBub3JtYWxpemF0aW9uVHlwZVxuKSB7XG4gIGlmIChkYXRhICYmIGRhdGEuX19vYl9fKSB7XG4gICAgXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiYgd2FybihcbiAgICAgIFwiQXZvaWQgdXNpbmcgb2JzZXJ2ZWQgZGF0YSBvYmplY3QgYXMgdm5vZGUgZGF0YTogXCIgKyAoSlNPTi5zdHJpbmdpZnkoZGF0YSkpICsgXCJcXG5cIiArXG4gICAgICAnQWx3YXlzIGNyZWF0ZSBmcmVzaCB2bm9kZSBkYXRhIG9iamVjdHMgaW4gZWFjaCByZW5kZXIhJyxcbiAgICAgIGNvbnRleHRcbiAgICApO1xuICAgIHJldHVybiBjcmVhdGVFbXB0eVZOb2RlKClcbiAgfVxuICBpZiAoIXRhZykge1xuICAgIC8vIGluIGNhc2Ugb2YgY29tcG9uZW50IDppcyBzZXQgdG8gZmFsc3kgdmFsdWVcbiAgICByZXR1cm4gY3JlYXRlRW1wdHlWTm9kZSgpXG4gIH1cbiAgLy8gc3VwcG9ydCBzaW5nbGUgZnVuY3Rpb24gY2hpbGRyZW4gYXMgZGVmYXVsdCBzY29wZWQgc2xvdFxuICBpZiAoQXJyYXkuaXNBcnJheShjaGlsZHJlbikgJiZcbiAgICAgIHR5cGVvZiBjaGlsZHJlblswXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGRhdGEgPSBkYXRhIHx8IHt9O1xuICAgIGRhdGEuc2NvcGVkU2xvdHMgPSB7IGRlZmF1bHQ6IGNoaWxkcmVuWzBdIH07XG4gICAgY2hpbGRyZW4ubGVuZ3RoID0gMDtcbiAgfVxuICBpZiAobm9ybWFsaXphdGlvblR5cGUgPT09IEFMV0FZU19OT1JNQUxJWkUpIHtcbiAgICBjaGlsZHJlbiA9IG5vcm1hbGl6ZUNoaWxkcmVuKGNoaWxkcmVuKTtcbiAgfSBlbHNlIGlmIChub3JtYWxpemF0aW9uVHlwZSA9PT0gU0lNUExFX05PUk1BTElaRSkge1xuICAgIGNoaWxkcmVuID0gc2ltcGxlTm9ybWFsaXplQ2hpbGRyZW4oY2hpbGRyZW4pO1xuICB9XG4gIHZhciB2bm9kZSwgbnM7XG4gIGlmICh0eXBlb2YgdGFnID09PSAnc3RyaW5nJykge1xuICAgIHZhciBDdG9yO1xuICAgIG5zID0gY29uZmlnLmdldFRhZ05hbWVzcGFjZSh0YWcpO1xuICAgIGlmIChjb25maWcuaXNSZXNlcnZlZFRhZyh0YWcpKSB7XG4gICAgICAvLyBwbGF0Zm9ybSBidWlsdC1pbiBlbGVtZW50c1xuICAgICAgdm5vZGUgPSBuZXcgVk5vZGUoXG4gICAgICAgIGNvbmZpZy5wYXJzZVBsYXRmb3JtVGFnTmFtZSh0YWcpLCBkYXRhLCBjaGlsZHJlbixcbiAgICAgICAgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGNvbnRleHRcbiAgICAgICk7XG4gICAgfSBlbHNlIGlmICgoQ3RvciA9IHJlc29sdmVBc3NldChjb250ZXh0LiRvcHRpb25zLCAnY29tcG9uZW50cycsIHRhZykpKSB7XG4gICAgICAvLyBjb21wb25lbnRcbiAgICAgIHZub2RlID0gY3JlYXRlQ29tcG9uZW50KEN0b3IsIGRhdGEsIGNvbnRleHQsIGNoaWxkcmVuLCB0YWcpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyB1bmtub3duIG9yIHVubGlzdGVkIG5hbWVzcGFjZWQgZWxlbWVudHNcbiAgICAgIC8vIGNoZWNrIGF0IHJ1bnRpbWUgYmVjYXVzZSBpdCBtYXkgZ2V0IGFzc2lnbmVkIGEgbmFtZXNwYWNlIHdoZW4gaXRzXG4gICAgICAvLyBwYXJlbnQgbm9ybWFsaXplcyBjaGlsZHJlblxuICAgICAgdm5vZGUgPSBuZXcgVk5vZGUoXG4gICAgICAgIHRhZywgZGF0YSwgY2hpbGRyZW4sXG4gICAgICAgIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBjb250ZXh0XG4gICAgICApO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBkaXJlY3QgY29tcG9uZW50IG9wdGlvbnMgLyBjb25zdHJ1Y3RvclxuICAgIHZub2RlID0gY3JlYXRlQ29tcG9uZW50KHRhZywgZGF0YSwgY29udGV4dCwgY2hpbGRyZW4pO1xuICB9XG4gIGlmICh2bm9kZSkge1xuICAgIGlmIChucykgeyBhcHBseU5TKHZub2RlLCBucyk7IH1cbiAgICByZXR1cm4gdm5vZGVcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gY3JlYXRlRW1wdHlWTm9kZSgpXG4gIH1cbn1cblxuZnVuY3Rpb24gYXBwbHlOUyAodm5vZGUsIG5zKSB7XG4gIHZub2RlLm5zID0gbnM7XG4gIGlmICh2bm9kZS50YWcgPT09ICdmb3JlaWduT2JqZWN0Jykge1xuICAgIC8vIHVzZSBkZWZhdWx0IG5hbWVzcGFjZSBpbnNpZGUgZm9yZWlnbk9iamVjdFxuICAgIHJldHVyblxuICB9XG4gIGlmICh2bm9kZS5jaGlsZHJlbikge1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gdm5vZGUuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICB2YXIgY2hpbGQgPSB2bm9kZS5jaGlsZHJlbltpXTtcbiAgICAgIGlmIChjaGlsZC50YWcgJiYgIWNoaWxkLm5zKSB7XG4gICAgICAgIGFwcGx5TlMoY2hpbGQsIG5zKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyogICovXG5cbi8qKlxuICogUnVudGltZSBoZWxwZXIgZm9yIHJlbmRlcmluZyB2LWZvciBsaXN0cy5cbiAqL1xuZnVuY3Rpb24gcmVuZGVyTGlzdCAoXG4gIHZhbCxcbiAgcmVuZGVyXG4pIHtcbiAgdmFyIHJldCwgaSwgbCwga2V5cywga2V5O1xuICBpZiAoQXJyYXkuaXNBcnJheSh2YWwpIHx8IHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0ID0gbmV3IEFycmF5KHZhbC5sZW5ndGgpO1xuICAgIGZvciAoaSA9IDAsIGwgPSB2YWwubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICByZXRbaV0gPSByZW5kZXIodmFsW2ldLCBpKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAodHlwZW9mIHZhbCA9PT0gJ251bWJlcicpIHtcbiAgICByZXQgPSBuZXcgQXJyYXkodmFsKTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgdmFsOyBpKyspIHtcbiAgICAgIHJldFtpXSA9IHJlbmRlcihpICsgMSwgaSk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KHZhbCkpIHtcbiAgICBrZXlzID0gT2JqZWN0LmtleXModmFsKTtcbiAgICByZXQgPSBuZXcgQXJyYXkoa2V5cy5sZW5ndGgpO1xuICAgIGZvciAoaSA9IDAsIGwgPSBrZXlzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAga2V5ID0ga2V5c1tpXTtcbiAgICAgIHJldFtpXSA9IHJlbmRlcih2YWxba2V5XSwga2V5LCBpKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG4vKiAgKi9cblxuLyoqXG4gKiBSdW50aW1lIGhlbHBlciBmb3IgcmVuZGVyaW5nIDxzbG90PlxuICovXG5mdW5jdGlvbiByZW5kZXJTbG90IChcbiAgbmFtZSxcbiAgZmFsbGJhY2ssXG4gIHByb3BzLFxuICBiaW5kT2JqZWN0XG4pIHtcbiAgdmFyIHNjb3BlZFNsb3RGbiA9IHRoaXMuJHNjb3BlZFNsb3RzW25hbWVdO1xuICBpZiAoc2NvcGVkU2xvdEZuKSB7IC8vIHNjb3BlZCBzbG90XG4gICAgcHJvcHMgPSBwcm9wcyB8fCB7fTtcbiAgICBpZiAoYmluZE9iamVjdCkge1xuICAgICAgZXh0ZW5kKHByb3BzLCBiaW5kT2JqZWN0KTtcbiAgICB9XG4gICAgcmV0dXJuIHNjb3BlZFNsb3RGbihwcm9wcykgfHwgZmFsbGJhY2tcbiAgfSBlbHNlIHtcbiAgICB2YXIgc2xvdE5vZGVzID0gdGhpcy4kc2xvdHNbbmFtZV07XG4gICAgLy8gd2FybiBkdXBsaWNhdGUgc2xvdCB1c2FnZVxuICAgIGlmIChzbG90Tm9kZXMgJiYgXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIHNsb3ROb2Rlcy5fcmVuZGVyZWQgJiYgd2FybihcbiAgICAgICAgXCJEdXBsaWNhdGUgcHJlc2VuY2Ugb2Ygc2xvdCBcXFwiXCIgKyBuYW1lICsgXCJcXFwiIGZvdW5kIGluIHRoZSBzYW1lIHJlbmRlciB0cmVlIFwiICtcbiAgICAgICAgXCItIHRoaXMgd2lsbCBsaWtlbHkgY2F1c2UgcmVuZGVyIGVycm9ycy5cIixcbiAgICAgICAgdGhpc1xuICAgICAgKTtcbiAgICAgIHNsb3ROb2Rlcy5fcmVuZGVyZWQgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gc2xvdE5vZGVzIHx8IGZhbGxiYWNrXG4gIH1cbn1cblxuLyogICovXG5cbi8qKlxuICogUnVudGltZSBoZWxwZXIgZm9yIHJlc29sdmluZyBmaWx0ZXJzXG4gKi9cbmZ1bmN0aW9uIHJlc29sdmVGaWx0ZXIgKGlkKSB7XG4gIHJldHVybiByZXNvbHZlQXNzZXQodGhpcy4kb3B0aW9ucywgJ2ZpbHRlcnMnLCBpZCwgdHJ1ZSkgfHwgaWRlbnRpdHlcbn1cblxuLyogICovXG5cbi8qKlxuICogUnVudGltZSBoZWxwZXIgZm9yIGNoZWNraW5nIGtleUNvZGVzIGZyb20gY29uZmlnLlxuICovXG5mdW5jdGlvbiBjaGVja0tleUNvZGVzIChcbiAgZXZlbnRLZXlDb2RlLFxuICBrZXksXG4gIGJ1aWx0SW5BbGlhc1xuKSB7XG4gIHZhciBrZXlDb2RlcyA9IGNvbmZpZy5rZXlDb2Rlc1trZXldIHx8IGJ1aWx0SW5BbGlhcztcbiAgaWYgKEFycmF5LmlzQXJyYXkoa2V5Q29kZXMpKSB7XG4gICAgcmV0dXJuIGtleUNvZGVzLmluZGV4T2YoZXZlbnRLZXlDb2RlKSA9PT0gLTFcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ga2V5Q29kZXMgIT09IGV2ZW50S2V5Q29kZVxuICB9XG59XG5cbi8qICAqL1xuXG4vKipcbiAqIFJ1bnRpbWUgaGVscGVyIGZvciBtZXJnaW5nIHYtYmluZD1cIm9iamVjdFwiIGludG8gYSBWTm9kZSdzIGRhdGEuXG4gKi9cbmZ1bmN0aW9uIGJpbmRPYmplY3RQcm9wcyAoXG4gIGRhdGEsXG4gIHRhZyxcbiAgdmFsdWUsXG4gIGFzUHJvcFxuKSB7XG4gIGlmICh2YWx1ZSkge1xuICAgIGlmICghaXNPYmplY3QodmFsdWUpKSB7XG4gICAgICBcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiB3YXJuKFxuICAgICAgICAndi1iaW5kIHdpdGhvdXQgYXJndW1lbnQgZXhwZWN0cyBhbiBPYmplY3Qgb3IgQXJyYXkgdmFsdWUnLFxuICAgICAgICB0aGlzXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgdmFsdWUgPSB0b09iamVjdCh2YWx1ZSk7XG4gICAgICB9XG4gICAgICBmb3IgKHZhciBrZXkgaW4gdmFsdWUpIHtcbiAgICAgICAgaWYgKGtleSA9PT0gJ2NsYXNzJyB8fCBrZXkgPT09ICdzdHlsZScpIHtcbiAgICAgICAgICBkYXRhW2tleV0gPSB2YWx1ZVtrZXldO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciB0eXBlID0gZGF0YS5hdHRycyAmJiBkYXRhLmF0dHJzLnR5cGU7XG4gICAgICAgICAgdmFyIGhhc2ggPSBhc1Byb3AgfHwgY29uZmlnLm11c3RVc2VQcm9wKHRhZywgdHlwZSwga2V5KVxuICAgICAgICAgICAgPyBkYXRhLmRvbVByb3BzIHx8IChkYXRhLmRvbVByb3BzID0ge30pXG4gICAgICAgICAgICA6IGRhdGEuYXR0cnMgfHwgKGRhdGEuYXR0cnMgPSB7fSk7XG4gICAgICAgICAgaGFzaFtrZXldID0gdmFsdWVba2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gZGF0YVxufVxuXG4vKiAgKi9cblxuLyoqXG4gKiBSdW50aW1lIGhlbHBlciBmb3IgcmVuZGVyaW5nIHN0YXRpYyB0cmVlcy5cbiAqL1xuZnVuY3Rpb24gcmVuZGVyU3RhdGljIChcbiAgaW5kZXgsXG4gIGlzSW5Gb3Jcbikge1xuICB2YXIgdHJlZSA9IHRoaXMuX3N0YXRpY1RyZWVzW2luZGV4XTtcbiAgLy8gaWYgaGFzIGFscmVhZHktcmVuZGVyZWQgc3RhdGljIHRyZWUgYW5kIG5vdCBpbnNpZGUgdi1mb3IsXG4gIC8vIHdlIGNhbiByZXVzZSB0aGUgc2FtZSB0cmVlIGJ5IGRvaW5nIGEgc2hhbGxvdyBjbG9uZS5cbiAgaWYgKHRyZWUgJiYgIWlzSW5Gb3IpIHtcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheSh0cmVlKVxuICAgICAgPyBjbG9uZVZOb2Rlcyh0cmVlKVxuICAgICAgOiBjbG9uZVZOb2RlKHRyZWUpXG4gIH1cbiAgLy8gb3RoZXJ3aXNlLCByZW5kZXIgYSBmcmVzaCB0cmVlLlxuICB0cmVlID0gdGhpcy5fc3RhdGljVHJlZXNbaW5kZXhdID1cbiAgICB0aGlzLiRvcHRpb25zLnN0YXRpY1JlbmRlckZuc1tpbmRleF0uY2FsbCh0aGlzLl9yZW5kZXJQcm94eSk7XG4gIG1hcmtTdGF0aWModHJlZSwgKFwiX19zdGF0aWNfX1wiICsgaW5kZXgpLCBmYWxzZSk7XG4gIHJldHVybiB0cmVlXG59XG5cbi8qKlxuICogUnVudGltZSBoZWxwZXIgZm9yIHYtb25jZS5cbiAqIEVmZmVjdGl2ZWx5IGl0IG1lYW5zIG1hcmtpbmcgdGhlIG5vZGUgYXMgc3RhdGljIHdpdGggYSB1bmlxdWUga2V5LlxuICovXG5mdW5jdGlvbiBtYXJrT25jZSAoXG4gIHRyZWUsXG4gIGluZGV4LFxuICBrZXlcbikge1xuICBtYXJrU3RhdGljKHRyZWUsIChcIl9fb25jZV9fXCIgKyBpbmRleCArIChrZXkgPyAoXCJfXCIgKyBrZXkpIDogXCJcIikpLCB0cnVlKTtcbiAgcmV0dXJuIHRyZWVcbn1cblxuZnVuY3Rpb24gbWFya1N0YXRpYyAoXG4gIHRyZWUsXG4gIGtleSxcbiAgaXNPbmNlXG4pIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkodHJlZSkpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRyZWUubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh0cmVlW2ldICYmIHR5cGVvZiB0cmVlW2ldICE9PSAnc3RyaW5nJykge1xuICAgICAgICBtYXJrU3RhdGljTm9kZSh0cmVlW2ldLCAoa2V5ICsgXCJfXCIgKyBpKSwgaXNPbmNlKTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgbWFya1N0YXRpY05vZGUodHJlZSwga2V5LCBpc09uY2UpO1xuICB9XG59XG5cbmZ1bmN0aW9uIG1hcmtTdGF0aWNOb2RlIChub2RlLCBrZXksIGlzT25jZSkge1xuICBub2RlLmlzU3RhdGljID0gdHJ1ZTtcbiAgbm9kZS5rZXkgPSBrZXk7XG4gIG5vZGUuaXNPbmNlID0gaXNPbmNlO1xufVxuXG4vKiAgKi9cblxuZnVuY3Rpb24gaW5pdFJlbmRlciAodm0pIHtcbiAgdm0uJHZub2RlID0gbnVsbDsgLy8gdGhlIHBsYWNlaG9sZGVyIG5vZGUgaW4gcGFyZW50IHRyZWVcbiAgdm0uX3Zub2RlID0gbnVsbDsgLy8gdGhlIHJvb3Qgb2YgdGhlIGNoaWxkIHRyZWVcbiAgdm0uX3N0YXRpY1RyZWVzID0gbnVsbDtcbiAgdmFyIHBhcmVudFZub2RlID0gdm0uJG9wdGlvbnMuX3BhcmVudFZub2RlO1xuICB2YXIgcmVuZGVyQ29udGV4dCA9IHBhcmVudFZub2RlICYmIHBhcmVudFZub2RlLmNvbnRleHQ7XG4gIHZtLiRzbG90cyA9IHJlc29sdmVTbG90cyh2bS4kb3B0aW9ucy5fcmVuZGVyQ2hpbGRyZW4sIHJlbmRlckNvbnRleHQpO1xuICB2bS4kc2NvcGVkU2xvdHMgPSBlbXB0eU9iamVjdDtcbiAgLy8gYmluZCB0aGUgY3JlYXRlRWxlbWVudCBmbiB0byB0aGlzIGluc3RhbmNlXG4gIC8vIHNvIHRoYXQgd2UgZ2V0IHByb3BlciByZW5kZXIgY29udGV4dCBpbnNpZGUgaXQuXG4gIC8vIGFyZ3Mgb3JkZXI6IHRhZywgZGF0YSwgY2hpbGRyZW4sIG5vcm1hbGl6YXRpb25UeXBlLCBhbHdheXNOb3JtYWxpemVcbiAgLy8gaW50ZXJuYWwgdmVyc2lvbiBpcyB1c2VkIGJ5IHJlbmRlciBmdW5jdGlvbnMgY29tcGlsZWQgZnJvbSB0ZW1wbGF0ZXNcbiAgdm0uX2MgPSBmdW5jdGlvbiAoYSwgYiwgYywgZCkgeyByZXR1cm4gY3JlYXRlRWxlbWVudCh2bSwgYSwgYiwgYywgZCwgZmFsc2UpOyB9O1xuICAvLyBub3JtYWxpemF0aW9uIGlzIGFsd2F5cyBhcHBsaWVkIGZvciB0aGUgcHVibGljIHZlcnNpb24sIHVzZWQgaW5cbiAgLy8gdXNlci13cml0dGVuIHJlbmRlciBmdW5jdGlvbnMuXG4gIHZtLiRjcmVhdGVFbGVtZW50ID0gZnVuY3Rpb24gKGEsIGIsIGMsIGQpIHsgcmV0dXJuIGNyZWF0ZUVsZW1lbnQodm0sIGEsIGIsIGMsIGQsIHRydWUpOyB9O1xufVxuXG5mdW5jdGlvbiByZW5kZXJNaXhpbiAoVnVlKSB7XG4gIFZ1ZS5wcm90b3R5cGUuJG5leHRUaWNrID0gZnVuY3Rpb24gKGZuKSB7XG4gICAgcmV0dXJuIG5leHRUaWNrKGZuLCB0aGlzKVxuICB9O1xuXG4gIFZ1ZS5wcm90b3R5cGUuX3JlbmRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdm0gPSB0aGlzO1xuICAgIHZhciByZWYgPSB2bS4kb3B0aW9ucztcbiAgICB2YXIgcmVuZGVyID0gcmVmLnJlbmRlcjtcbiAgICB2YXIgc3RhdGljUmVuZGVyRm5zID0gcmVmLnN0YXRpY1JlbmRlckZucztcbiAgICB2YXIgX3BhcmVudFZub2RlID0gcmVmLl9wYXJlbnRWbm9kZTtcblxuICAgIGlmICh2bS5faXNNb3VudGVkKSB7XG4gICAgICAvLyBjbG9uZSBzbG90IG5vZGVzIG9uIHJlLXJlbmRlcnNcbiAgICAgIGZvciAodmFyIGtleSBpbiB2bS4kc2xvdHMpIHtcbiAgICAgICAgdm0uJHNsb3RzW2tleV0gPSBjbG9uZVZOb2Rlcyh2bS4kc2xvdHNba2V5XSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdm0uJHNjb3BlZFNsb3RzID0gKF9wYXJlbnRWbm9kZSAmJiBfcGFyZW50Vm5vZGUuZGF0YS5zY29wZWRTbG90cykgfHwgZW1wdHlPYmplY3Q7XG5cbiAgICBpZiAoc3RhdGljUmVuZGVyRm5zICYmICF2bS5fc3RhdGljVHJlZXMpIHtcbiAgICAgIHZtLl9zdGF0aWNUcmVlcyA9IFtdO1xuICAgIH1cbiAgICAvLyBzZXQgcGFyZW50IHZub2RlLiB0aGlzIGFsbG93cyByZW5kZXIgZnVuY3Rpb25zIHRvIGhhdmUgYWNjZXNzXG4gICAgLy8gdG8gdGhlIGRhdGEgb24gdGhlIHBsYWNlaG9sZGVyIG5vZGUuXG4gICAgdm0uJHZub2RlID0gX3BhcmVudFZub2RlO1xuICAgIC8vIHJlbmRlciBzZWxmXG4gICAgdmFyIHZub2RlO1xuICAgIHRyeSB7XG4gICAgICB2bm9kZSA9IHJlbmRlci5jYWxsKHZtLl9yZW5kZXJQcm94eSwgdm0uJGNyZWF0ZUVsZW1lbnQpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGhhbmRsZUVycm9yKGUsIHZtLCBcInJlbmRlciBmdW5jdGlvblwiKTtcbiAgICAgIC8vIHJldHVybiBlcnJvciByZW5kZXIgcmVzdWx0LFxuICAgICAgLy8gb3IgcHJldmlvdXMgdm5vZGUgdG8gcHJldmVudCByZW5kZXIgZXJyb3IgY2F1c2luZyBibGFuayBjb21wb25lbnRcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICB7XG4gICAgICAgIHZub2RlID0gdm0uJG9wdGlvbnMucmVuZGVyRXJyb3JcbiAgICAgICAgICA/IHZtLiRvcHRpb25zLnJlbmRlckVycm9yLmNhbGwodm0uX3JlbmRlclByb3h5LCB2bS4kY3JlYXRlRWxlbWVudCwgZSlcbiAgICAgICAgICA6IHZtLl92bm9kZTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gcmV0dXJuIGVtcHR5IHZub2RlIGluIGNhc2UgdGhlIHJlbmRlciBmdW5jdGlvbiBlcnJvcmVkIG91dFxuICAgIGlmICghKHZub2RlIGluc3RhbmNlb2YgVk5vZGUpKSB7XG4gICAgICBpZiAoXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiYgQXJyYXkuaXNBcnJheSh2bm9kZSkpIHtcbiAgICAgICAgd2FybihcbiAgICAgICAgICAnTXVsdGlwbGUgcm9vdCBub2RlcyByZXR1cm5lZCBmcm9tIHJlbmRlciBmdW5jdGlvbi4gUmVuZGVyIGZ1bmN0aW9uICcgK1xuICAgICAgICAgICdzaG91bGQgcmV0dXJuIGEgc2luZ2xlIHJvb3Qgbm9kZS4nLFxuICAgICAgICAgIHZtXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICB2bm9kZSA9IGNyZWF0ZUVtcHR5Vk5vZGUoKTtcbiAgICB9XG4gICAgLy8gc2V0IHBhcmVudFxuICAgIHZub2RlLnBhcmVudCA9IF9wYXJlbnRWbm9kZTtcbiAgICByZXR1cm4gdm5vZGVcbiAgfTtcblxuICAvLyBpbnRlcm5hbCByZW5kZXIgaGVscGVycy5cbiAgLy8gdGhlc2UgYXJlIGV4cG9zZWQgb24gdGhlIGluc3RhbmNlIHByb3RvdHlwZSB0byByZWR1Y2UgZ2VuZXJhdGVkIHJlbmRlclxuICAvLyBjb2RlIHNpemUuXG4gIFZ1ZS5wcm90b3R5cGUuX28gPSBtYXJrT25jZTtcbiAgVnVlLnByb3RvdHlwZS5fbiA9IHRvTnVtYmVyO1xuICBWdWUucHJvdG90eXBlLl9zID0gX3RvU3RyaW5nO1xuICBWdWUucHJvdG90eXBlLl9sID0gcmVuZGVyTGlzdDtcbiAgVnVlLnByb3RvdHlwZS5fdCA9IHJlbmRlclNsb3Q7XG4gIFZ1ZS5wcm90b3R5cGUuX3EgPSBsb29zZUVxdWFsO1xuICBWdWUucHJvdG90eXBlLl9pID0gbG9vc2VJbmRleE9mO1xuICBWdWUucHJvdG90eXBlLl9tID0gcmVuZGVyU3RhdGljO1xuICBWdWUucHJvdG90eXBlLl9mID0gcmVzb2x2ZUZpbHRlcjtcbiAgVnVlLnByb3RvdHlwZS5fayA9IGNoZWNrS2V5Q29kZXM7XG4gIFZ1ZS5wcm90b3R5cGUuX2IgPSBiaW5kT2JqZWN0UHJvcHM7XG4gIFZ1ZS5wcm90b3R5cGUuX3YgPSBjcmVhdGVUZXh0Vk5vZGU7XG4gIFZ1ZS5wcm90b3R5cGUuX2UgPSBjcmVhdGVFbXB0eVZOb2RlO1xuICBWdWUucHJvdG90eXBlLl91ID0gcmVzb2x2ZVNjb3BlZFNsb3RzO1xufVxuXG4vKiAgKi9cblxuZnVuY3Rpb24gaW5pdFByb3ZpZGUgKHZtKSB7XG4gIHZhciBwcm92aWRlID0gdm0uJG9wdGlvbnMucHJvdmlkZTtcbiAgaWYgKHByb3ZpZGUpIHtcbiAgICB2bS5fcHJvdmlkZWQgPSB0eXBlb2YgcHJvdmlkZSA9PT0gJ2Z1bmN0aW9uJ1xuICAgICAgPyBwcm92aWRlLmNhbGwodm0pXG4gICAgICA6IHByb3ZpZGU7XG4gIH1cbn1cblxuZnVuY3Rpb24gaW5pdEluamVjdGlvbnMgKHZtKSB7XG4gIHZhciBpbmplY3QgPSB2bS4kb3B0aW9ucy5pbmplY3Q7XG4gIGlmIChpbmplY3QpIHtcbiAgICAvLyBpbmplY3QgaXMgOmFueSBiZWNhdXNlIGZsb3cgaXMgbm90IHNtYXJ0IGVub3VnaCB0byBmaWd1cmUgb3V0IGNhY2hlZFxuICAgIC8vIGlzQXJyYXkgaGVyZVxuICAgIHZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheShpbmplY3QpO1xuICAgIHZhciBrZXlzID0gaXNBcnJheVxuICAgICAgPyBpbmplY3RcbiAgICAgIDogaGFzU3ltYm9sXG4gICAgICAgID8gUmVmbGVjdC5vd25LZXlzKGluamVjdClcbiAgICAgICAgOiBPYmplY3Qua2V5cyhpbmplY3QpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIga2V5ID0ga2V5c1tpXTtcbiAgICAgIHZhciBwcm92aWRlS2V5ID0gaXNBcnJheSA/IGtleSA6IGluamVjdFtrZXldO1xuICAgICAgdmFyIHNvdXJjZSA9IHZtO1xuICAgICAgd2hpbGUgKHNvdXJjZSkge1xuICAgICAgICBpZiAoc291cmNlLl9wcm92aWRlZCAmJiBwcm92aWRlS2V5IGluIHNvdXJjZS5fcHJvdmlkZWQpIHtcbiAgICAgICAgICB2bVtrZXldID0gc291cmNlLl9wcm92aWRlZFtwcm92aWRlS2V5XTtcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICAgIHNvdXJjZSA9IHNvdXJjZS4kcGFyZW50O1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKiAgKi9cblxudmFyIHVpZCA9IDA7XG5cbmZ1bmN0aW9uIGluaXRNaXhpbiAoVnVlKSB7XG4gIFZ1ZS5wcm90b3R5cGUuX2luaXQgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgIGlmIChcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiBjb25maWcucGVyZm9ybWFuY2UgJiYgcGVyZikge1xuICAgICAgcGVyZi5tYXJrKCdpbml0Jyk7XG4gICAgfVxuXG4gICAgdmFyIHZtID0gdGhpcztcbiAgICAvLyBhIHVpZFxuICAgIHZtLl91aWQgPSB1aWQrKztcbiAgICAvLyBhIGZsYWcgdG8gYXZvaWQgdGhpcyBiZWluZyBvYnNlcnZlZFxuICAgIHZtLl9pc1Z1ZSA9IHRydWU7XG4gICAgLy8gbWVyZ2Ugb3B0aW9uc1xuICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMuX2lzQ29tcG9uZW50KSB7XG4gICAgICAvLyBvcHRpbWl6ZSBpbnRlcm5hbCBjb21wb25lbnQgaW5zdGFudGlhdGlvblxuICAgICAgLy8gc2luY2UgZHluYW1pYyBvcHRpb25zIG1lcmdpbmcgaXMgcHJldHR5IHNsb3csIGFuZCBub25lIG9mIHRoZVxuICAgICAgLy8gaW50ZXJuYWwgY29tcG9uZW50IG9wdGlvbnMgbmVlZHMgc3BlY2lhbCB0cmVhdG1lbnQuXG4gICAgICBpbml0SW50ZXJuYWxDb21wb25lbnQodm0sIG9wdGlvbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2bS4kb3B0aW9ucyA9IG1lcmdlT3B0aW9ucyhcbiAgICAgICAgcmVzb2x2ZUNvbnN0cnVjdG9yT3B0aW9ucyh2bS5jb25zdHJ1Y3RvciksXG4gICAgICAgIG9wdGlvbnMgfHwge30sXG4gICAgICAgIHZtXG4gICAgICApO1xuICAgIH1cbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgIHtcbiAgICAgIGluaXRQcm94eSh2bSk7XG4gICAgfVxuICAgIC8vIGV4cG9zZSByZWFsIHNlbGZcbiAgICB2bS5fc2VsZiA9IHZtO1xuICAgIGluaXRMaWZlY3ljbGUodm0pO1xuICAgIGluaXRFdmVudHModm0pO1xuICAgIGluaXRSZW5kZXIodm0pO1xuICAgIGNhbGxIb29rKHZtLCAnYmVmb3JlQ3JlYXRlJyk7XG4gICAgaW5pdEluamVjdGlvbnModm0pOyAvLyByZXNvbHZlIGluamVjdGlvbnMgYmVmb3JlIGRhdGEvcHJvcHNcbiAgICBpbml0U3RhdGUodm0pO1xuICAgIGluaXRQcm92aWRlKHZtKTsgLy8gcmVzb2x2ZSBwcm92aWRlIGFmdGVyIGRhdGEvcHJvcHNcbiAgICBjYWxsSG9vayh2bSwgJ2NyZWF0ZWQnKTtcblxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgIGlmIChcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiBjb25maWcucGVyZm9ybWFuY2UgJiYgcGVyZikge1xuICAgICAgdm0uX25hbWUgPSBmb3JtYXRDb21wb25lbnROYW1lKHZtLCBmYWxzZSk7XG4gICAgICBwZXJmLm1hcmsoJ2luaXQgZW5kJyk7XG4gICAgICBwZXJmLm1lYXN1cmUoKCh2bS5fbmFtZSkgKyBcIiBpbml0XCIpLCAnaW5pdCcsICdpbml0IGVuZCcpO1xuICAgIH1cblxuICAgIGlmICh2bS4kb3B0aW9ucy5lbCkge1xuICAgICAgdm0uJG1vdW50KHZtLiRvcHRpb25zLmVsKTtcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIGluaXRJbnRlcm5hbENvbXBvbmVudCAodm0sIG9wdGlvbnMpIHtcbiAgdmFyIG9wdHMgPSB2bS4kb3B0aW9ucyA9IE9iamVjdC5jcmVhdGUodm0uY29uc3RydWN0b3Iub3B0aW9ucyk7XG4gIC8vIGRvaW5nIHRoaXMgYmVjYXVzZSBpdCdzIGZhc3RlciB0aGFuIGR5bmFtaWMgZW51bWVyYXRpb24uXG4gIG9wdHMucGFyZW50ID0gb3B0aW9ucy5wYXJlbnQ7XG4gIG9wdHMucHJvcHNEYXRhID0gb3B0aW9ucy5wcm9wc0RhdGE7XG4gIG9wdHMuX3BhcmVudFZub2RlID0gb3B0aW9ucy5fcGFyZW50Vm5vZGU7XG4gIG9wdHMuX3BhcmVudExpc3RlbmVycyA9IG9wdGlvbnMuX3BhcmVudExpc3RlbmVycztcbiAgb3B0cy5fcmVuZGVyQ2hpbGRyZW4gPSBvcHRpb25zLl9yZW5kZXJDaGlsZHJlbjtcbiAgb3B0cy5fY29tcG9uZW50VGFnID0gb3B0aW9ucy5fY29tcG9uZW50VGFnO1xuICBvcHRzLl9wYXJlbnRFbG0gPSBvcHRpb25zLl9wYXJlbnRFbG07XG4gIG9wdHMuX3JlZkVsbSA9IG9wdGlvbnMuX3JlZkVsbTtcbiAgaWYgKG9wdGlvbnMucmVuZGVyKSB7XG4gICAgb3B0cy5yZW5kZXIgPSBvcHRpb25zLnJlbmRlcjtcbiAgICBvcHRzLnN0YXRpY1JlbmRlckZucyA9IG9wdGlvbnMuc3RhdGljUmVuZGVyRm5zO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlc29sdmVDb25zdHJ1Y3Rvck9wdGlvbnMgKEN0b3IpIHtcbiAgdmFyIG9wdGlvbnMgPSBDdG9yLm9wdGlvbnM7XG4gIGlmIChDdG9yLnN1cGVyKSB7XG4gICAgdmFyIHN1cGVyT3B0aW9ucyA9IHJlc29sdmVDb25zdHJ1Y3Rvck9wdGlvbnMoQ3Rvci5zdXBlcik7XG4gICAgdmFyIGNhY2hlZFN1cGVyT3B0aW9ucyA9IEN0b3Iuc3VwZXJPcHRpb25zO1xuICAgIGlmIChzdXBlck9wdGlvbnMgIT09IGNhY2hlZFN1cGVyT3B0aW9ucykge1xuICAgICAgLy8gc3VwZXIgb3B0aW9uIGNoYW5nZWQsXG4gICAgICAvLyBuZWVkIHRvIHJlc29sdmUgbmV3IG9wdGlvbnMuXG4gICAgICBDdG9yLnN1cGVyT3B0aW9ucyA9IHN1cGVyT3B0aW9ucztcbiAgICAgIC8vIGNoZWNrIGlmIHRoZXJlIGFyZSBhbnkgbGF0ZS1tb2RpZmllZC9hdHRhY2hlZCBvcHRpb25zICgjNDk3NilcbiAgICAgIHZhciBtb2RpZmllZE9wdGlvbnMgPSByZXNvbHZlTW9kaWZpZWRPcHRpb25zKEN0b3IpO1xuICAgICAgLy8gdXBkYXRlIGJhc2UgZXh0ZW5kIG9wdGlvbnNcbiAgICAgIGlmIChtb2RpZmllZE9wdGlvbnMpIHtcbiAgICAgICAgZXh0ZW5kKEN0b3IuZXh0ZW5kT3B0aW9ucywgbW9kaWZpZWRPcHRpb25zKTtcbiAgICAgIH1cbiAgICAgIG9wdGlvbnMgPSBDdG9yLm9wdGlvbnMgPSBtZXJnZU9wdGlvbnMoc3VwZXJPcHRpb25zLCBDdG9yLmV4dGVuZE9wdGlvbnMpO1xuICAgICAgaWYgKG9wdGlvbnMubmFtZSkge1xuICAgICAgICBvcHRpb25zLmNvbXBvbmVudHNbb3B0aW9ucy5uYW1lXSA9IEN0b3I7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBvcHRpb25zXG59XG5cbmZ1bmN0aW9uIHJlc29sdmVNb2RpZmllZE9wdGlvbnMgKEN0b3IpIHtcbiAgdmFyIG1vZGlmaWVkO1xuICB2YXIgbGF0ZXN0ID0gQ3Rvci5vcHRpb25zO1xuICB2YXIgc2VhbGVkID0gQ3Rvci5zZWFsZWRPcHRpb25zO1xuICBmb3IgKHZhciBrZXkgaW4gbGF0ZXN0KSB7XG4gICAgaWYgKGxhdGVzdFtrZXldICE9PSBzZWFsZWRba2V5XSkge1xuICAgICAgaWYgKCFtb2RpZmllZCkgeyBtb2RpZmllZCA9IHt9OyB9XG4gICAgICBtb2RpZmllZFtrZXldID0gZGVkdXBlKGxhdGVzdFtrZXldLCBzZWFsZWRba2V5XSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBtb2RpZmllZFxufVxuXG5mdW5jdGlvbiBkZWR1cGUgKGxhdGVzdCwgc2VhbGVkKSB7XG4gIC8vIGNvbXBhcmUgbGF0ZXN0IGFuZCBzZWFsZWQgdG8gZW5zdXJlIGxpZmVjeWNsZSBob29rcyB3b24ndCBiZSBkdXBsaWNhdGVkXG4gIC8vIGJldHdlZW4gbWVyZ2VzXG4gIGlmIChBcnJheS5pc0FycmF5KGxhdGVzdCkpIHtcbiAgICB2YXIgcmVzID0gW107XG4gICAgc2VhbGVkID0gQXJyYXkuaXNBcnJheShzZWFsZWQpID8gc2VhbGVkIDogW3NlYWxlZF07XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXRlc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChzZWFsZWQuaW5kZXhPZihsYXRlc3RbaV0pIDwgMCkge1xuICAgICAgICByZXMucHVzaChsYXRlc3RbaV0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGxhdGVzdFxuICB9XG59XG5cbmZ1bmN0aW9uIFZ1ZSQzIChvcHRpb25zKSB7XG4gIGlmIChcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJlxuICAgICEodGhpcyBpbnN0YW5jZW9mIFZ1ZSQzKSkge1xuICAgIHdhcm4oJ1Z1ZSBpcyBhIGNvbnN0cnVjdG9yIGFuZCBzaG91bGQgYmUgY2FsbGVkIHdpdGggdGhlIGBuZXdgIGtleXdvcmQnKTtcbiAgfVxuICB0aGlzLl9pbml0KG9wdGlvbnMpO1xufVxuXG5pbml0TWl4aW4oVnVlJDMpO1xuc3RhdGVNaXhpbihWdWUkMyk7XG5ldmVudHNNaXhpbihWdWUkMyk7XG5saWZlY3ljbGVNaXhpbihWdWUkMyk7XG5yZW5kZXJNaXhpbihWdWUkMyk7XG5cbi8qICAqL1xuXG5mdW5jdGlvbiBpbml0VXNlIChWdWUpIHtcbiAgVnVlLnVzZSA9IGZ1bmN0aW9uIChwbHVnaW4pIHtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICBpZiAocGx1Z2luLmluc3RhbGxlZCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIC8vIGFkZGl0aW9uYWwgcGFyYW1ldGVyc1xuICAgIHZhciBhcmdzID0gdG9BcnJheShhcmd1bWVudHMsIDEpO1xuICAgIGFyZ3MudW5zaGlmdCh0aGlzKTtcbiAgICBpZiAodHlwZW9mIHBsdWdpbi5pbnN0YWxsID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBwbHVnaW4uaW5zdGFsbC5hcHBseShwbHVnaW4sIGFyZ3MpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHBsdWdpbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcGx1Z2luLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgIH1cbiAgICBwbHVnaW4uaW5zdGFsbGVkID0gdHJ1ZTtcbiAgICByZXR1cm4gdGhpc1xuICB9O1xufVxuXG4vKiAgKi9cblxuZnVuY3Rpb24gaW5pdE1peGluJDEgKFZ1ZSkge1xuICBWdWUubWl4aW4gPSBmdW5jdGlvbiAobWl4aW4pIHtcbiAgICB0aGlzLm9wdGlvbnMgPSBtZXJnZU9wdGlvbnModGhpcy5vcHRpb25zLCBtaXhpbik7XG4gIH07XG59XG5cbi8qICAqL1xuXG5mdW5jdGlvbiBpbml0RXh0ZW5kIChWdWUpIHtcbiAgLyoqXG4gICAqIEVhY2ggaW5zdGFuY2UgY29uc3RydWN0b3IsIGluY2x1ZGluZyBWdWUsIGhhcyBhIHVuaXF1ZVxuICAgKiBjaWQuIFRoaXMgZW5hYmxlcyB1cyB0byBjcmVhdGUgd3JhcHBlZCBcImNoaWxkXG4gICAqIGNvbnN0cnVjdG9yc1wiIGZvciBwcm90b3R5cGFsIGluaGVyaXRhbmNlIGFuZCBjYWNoZSB0aGVtLlxuICAgKi9cbiAgVnVlLmNpZCA9IDA7XG4gIHZhciBjaWQgPSAxO1xuXG4gIC8qKlxuICAgKiBDbGFzcyBpbmhlcml0YW5jZVxuICAgKi9cbiAgVnVlLmV4dGVuZCA9IGZ1bmN0aW9uIChleHRlbmRPcHRpb25zKSB7XG4gICAgZXh0ZW5kT3B0aW9ucyA9IGV4dGVuZE9wdGlvbnMgfHwge307XG4gICAgdmFyIFN1cGVyID0gdGhpcztcbiAgICB2YXIgU3VwZXJJZCA9IFN1cGVyLmNpZDtcbiAgICB2YXIgY2FjaGVkQ3RvcnMgPSBleHRlbmRPcHRpb25zLl9DdG9yIHx8IChleHRlbmRPcHRpb25zLl9DdG9yID0ge30pO1xuICAgIGlmIChjYWNoZWRDdG9yc1tTdXBlcklkXSkge1xuICAgICAgcmV0dXJuIGNhY2hlZEN0b3JzW1N1cGVySWRdXG4gICAgfVxuXG4gICAgdmFyIG5hbWUgPSBleHRlbmRPcHRpb25zLm5hbWUgfHwgU3VwZXIub3B0aW9ucy5uYW1lO1xuICAgIHtcbiAgICAgIGlmICghL15bYS16QS1aXVtcXHctXSokLy50ZXN0KG5hbWUpKSB7XG4gICAgICAgIHdhcm4oXG4gICAgICAgICAgJ0ludmFsaWQgY29tcG9uZW50IG5hbWU6IFwiJyArIG5hbWUgKyAnXCIuIENvbXBvbmVudCBuYW1lcyAnICtcbiAgICAgICAgICAnY2FuIG9ubHkgY29udGFpbiBhbHBoYW51bWVyaWMgY2hhcmFjdGVycyBhbmQgdGhlIGh5cGhlbiwgJyArXG4gICAgICAgICAgJ2FuZCBtdXN0IHN0YXJ0IHdpdGggYSBsZXR0ZXIuJ1xuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBTdWIgPSBmdW5jdGlvbiBWdWVDb21wb25lbnQgKG9wdGlvbnMpIHtcbiAgICAgIHRoaXMuX2luaXQob3B0aW9ucyk7XG4gICAgfTtcbiAgICBTdWIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShTdXBlci5wcm90b3R5cGUpO1xuICAgIFN1Yi5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBTdWI7XG4gICAgU3ViLmNpZCA9IGNpZCsrO1xuICAgIFN1Yi5vcHRpb25zID0gbWVyZ2VPcHRpb25zKFxuICAgICAgU3VwZXIub3B0aW9ucyxcbiAgICAgIGV4dGVuZE9wdGlvbnNcbiAgICApO1xuICAgIFN1Ylsnc3VwZXInXSA9IFN1cGVyO1xuXG4gICAgLy8gRm9yIHByb3BzIGFuZCBjb21wdXRlZCBwcm9wZXJ0aWVzLCB3ZSBkZWZpbmUgdGhlIHByb3h5IGdldHRlcnMgb25cbiAgICAvLyB0aGUgVnVlIGluc3RhbmNlcyBhdCBleHRlbnNpb24gdGltZSwgb24gdGhlIGV4dGVuZGVkIHByb3RvdHlwZS4gVGhpc1xuICAgIC8vIGF2b2lkcyBPYmplY3QuZGVmaW5lUHJvcGVydHkgY2FsbHMgZm9yIGVhY2ggaW5zdGFuY2UgY3JlYXRlZC5cbiAgICBpZiAoU3ViLm9wdGlvbnMucHJvcHMpIHtcbiAgICAgIGluaXRQcm9wcyQxKFN1Yik7XG4gICAgfVxuICAgIGlmIChTdWIub3B0aW9ucy5jb21wdXRlZCkge1xuICAgICAgaW5pdENvbXB1dGVkJDEoU3ViKTtcbiAgICB9XG5cbiAgICAvLyBhbGxvdyBmdXJ0aGVyIGV4dGVuc2lvbi9taXhpbi9wbHVnaW4gdXNhZ2VcbiAgICBTdWIuZXh0ZW5kID0gU3VwZXIuZXh0ZW5kO1xuICAgIFN1Yi5taXhpbiA9IFN1cGVyLm1peGluO1xuICAgIFN1Yi51c2UgPSBTdXBlci51c2U7XG5cbiAgICAvLyBjcmVhdGUgYXNzZXQgcmVnaXN0ZXJzLCBzbyBleHRlbmRlZCBjbGFzc2VzXG4gICAgLy8gY2FuIGhhdmUgdGhlaXIgcHJpdmF0ZSBhc3NldHMgdG9vLlxuICAgIGNvbmZpZy5fYXNzZXRUeXBlcy5mb3JFYWNoKGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgICBTdWJbdHlwZV0gPSBTdXBlclt0eXBlXTtcbiAgICB9KTtcbiAgICAvLyBlbmFibGUgcmVjdXJzaXZlIHNlbGYtbG9va3VwXG4gICAgaWYgKG5hbWUpIHtcbiAgICAgIFN1Yi5vcHRpb25zLmNvbXBvbmVudHNbbmFtZV0gPSBTdWI7XG4gICAgfVxuXG4gICAgLy8ga2VlcCBhIHJlZmVyZW5jZSB0byB0aGUgc3VwZXIgb3B0aW9ucyBhdCBleHRlbnNpb24gdGltZS5cbiAgICAvLyBsYXRlciBhdCBpbnN0YW50aWF0aW9uIHdlIGNhbiBjaGVjayBpZiBTdXBlcidzIG9wdGlvbnMgaGF2ZVxuICAgIC8vIGJlZW4gdXBkYXRlZC5cbiAgICBTdWIuc3VwZXJPcHRpb25zID0gU3VwZXIub3B0aW9ucztcbiAgICBTdWIuZXh0ZW5kT3B0aW9ucyA9IGV4dGVuZE9wdGlvbnM7XG4gICAgU3ViLnNlYWxlZE9wdGlvbnMgPSBleHRlbmQoe30sIFN1Yi5vcHRpb25zKTtcblxuICAgIC8vIGNhY2hlIGNvbnN0cnVjdG9yXG4gICAgY2FjaGVkQ3RvcnNbU3VwZXJJZF0gPSBTdWI7XG4gICAgcmV0dXJuIFN1YlxuICB9O1xufVxuXG5mdW5jdGlvbiBpbml0UHJvcHMkMSAoQ29tcCkge1xuICB2YXIgcHJvcHMgPSBDb21wLm9wdGlvbnMucHJvcHM7XG4gIGZvciAodmFyIGtleSBpbiBwcm9wcykge1xuICAgIHByb3h5KENvbXAucHJvdG90eXBlLCBcIl9wcm9wc1wiLCBrZXkpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGluaXRDb21wdXRlZCQxIChDb21wKSB7XG4gIHZhciBjb21wdXRlZCA9IENvbXAub3B0aW9ucy5jb21wdXRlZDtcbiAgZm9yICh2YXIga2V5IGluIGNvbXB1dGVkKSB7XG4gICAgZGVmaW5lQ29tcHV0ZWQoQ29tcC5wcm90b3R5cGUsIGtleSwgY29tcHV0ZWRba2V5XSk7XG4gIH1cbn1cblxuLyogICovXG5cbmZ1bmN0aW9uIGluaXRBc3NldFJlZ2lzdGVycyAoVnVlKSB7XG4gIC8qKlxuICAgKiBDcmVhdGUgYXNzZXQgcmVnaXN0cmF0aW9uIG1ldGhvZHMuXG4gICAqL1xuICBjb25maWcuX2Fzc2V0VHlwZXMuZm9yRWFjaChmdW5jdGlvbiAodHlwZSkge1xuICAgIFZ1ZVt0eXBlXSA9IGZ1bmN0aW9uIChcbiAgICAgIGlkLFxuICAgICAgZGVmaW5pdGlvblxuICAgICkge1xuICAgICAgaWYgKCFkZWZpbml0aW9uKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnNbdHlwZSArICdzJ11baWRdXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgICAge1xuICAgICAgICAgIGlmICh0eXBlID09PSAnY29tcG9uZW50JyAmJiBjb25maWcuaXNSZXNlcnZlZFRhZyhpZCkpIHtcbiAgICAgICAgICAgIHdhcm4oXG4gICAgICAgICAgICAgICdEbyBub3QgdXNlIGJ1aWx0LWluIG9yIHJlc2VydmVkIEhUTUwgZWxlbWVudHMgYXMgY29tcG9uZW50ICcgK1xuICAgICAgICAgICAgICAnaWQ6ICcgKyBpZFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGUgPT09ICdjb21wb25lbnQnICYmIGlzUGxhaW5PYmplY3QoZGVmaW5pdGlvbikpIHtcbiAgICAgICAgICBkZWZpbml0aW9uLm5hbWUgPSBkZWZpbml0aW9uLm5hbWUgfHwgaWQ7XG4gICAgICAgICAgZGVmaW5pdGlvbiA9IHRoaXMub3B0aW9ucy5fYmFzZS5leHRlbmQoZGVmaW5pdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGUgPT09ICdkaXJlY3RpdmUnICYmIHR5cGVvZiBkZWZpbml0aW9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgZGVmaW5pdGlvbiA9IHsgYmluZDogZGVmaW5pdGlvbiwgdXBkYXRlOiBkZWZpbml0aW9uIH07XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5vcHRpb25zW3R5cGUgKyAncyddW2lkXSA9IGRlZmluaXRpb247XG4gICAgICAgIHJldHVybiBkZWZpbml0aW9uXG4gICAgICB9XG4gICAgfTtcbiAgfSk7XG59XG5cbi8qICAqL1xuXG52YXIgcGF0dGVyblR5cGVzID0gW1N0cmluZywgUmVnRXhwXTtcblxuZnVuY3Rpb24gZ2V0Q29tcG9uZW50TmFtZSAob3B0cykge1xuICByZXR1cm4gb3B0cyAmJiAob3B0cy5DdG9yLm9wdGlvbnMubmFtZSB8fCBvcHRzLnRhZylcbn1cblxuZnVuY3Rpb24gbWF0Y2hlcyAocGF0dGVybiwgbmFtZSkge1xuICBpZiAodHlwZW9mIHBhdHRlcm4gPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHBhdHRlcm4uc3BsaXQoJywnKS5pbmRleE9mKG5hbWUpID4gLTFcbiAgfSBlbHNlIGlmIChwYXR0ZXJuIGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgcmV0dXJuIHBhdHRlcm4udGVzdChuYW1lKVxuICB9XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIHJldHVybiBmYWxzZVxufVxuXG5mdW5jdGlvbiBwcnVuZUNhY2hlIChjYWNoZSwgZmlsdGVyKSB7XG4gIGZvciAodmFyIGtleSBpbiBjYWNoZSkge1xuICAgIHZhciBjYWNoZWROb2RlID0gY2FjaGVba2V5XTtcbiAgICBpZiAoY2FjaGVkTm9kZSkge1xuICAgICAgdmFyIG5hbWUgPSBnZXRDb21wb25lbnROYW1lKGNhY2hlZE5vZGUuY29tcG9uZW50T3B0aW9ucyk7XG4gICAgICBpZiAobmFtZSAmJiAhZmlsdGVyKG5hbWUpKSB7XG4gICAgICAgIHBydW5lQ2FjaGVFbnRyeShjYWNoZWROb2RlKTtcbiAgICAgICAgY2FjaGVba2V5XSA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHBydW5lQ2FjaGVFbnRyeSAodm5vZGUpIHtcbiAgaWYgKHZub2RlKSB7XG4gICAgaWYgKCF2bm9kZS5jb21wb25lbnRJbnN0YW5jZS5faW5hY3RpdmUpIHtcbiAgICAgIGNhbGxIb29rKHZub2RlLmNvbXBvbmVudEluc3RhbmNlLCAnZGVhY3RpdmF0ZWQnKTtcbiAgICB9XG4gICAgdm5vZGUuY29tcG9uZW50SW5zdGFuY2UuJGRlc3Ryb3koKTtcbiAgfVxufVxuXG52YXIgS2VlcEFsaXZlID0ge1xuICBuYW1lOiAna2VlcC1hbGl2ZScsXG4gIGFic3RyYWN0OiB0cnVlLFxuXG4gIHByb3BzOiB7XG4gICAgaW5jbHVkZTogcGF0dGVyblR5cGVzLFxuICAgIGV4Y2x1ZGU6IHBhdHRlcm5UeXBlc1xuICB9LFxuXG4gIGNyZWF0ZWQ6IGZ1bmN0aW9uIGNyZWF0ZWQgKCkge1xuICAgIHRoaXMuY2FjaGUgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICB9LFxuXG4gIGRlc3Ryb3llZDogZnVuY3Rpb24gZGVzdHJveWVkICgpIHtcbiAgICB2YXIgdGhpcyQxID0gdGhpcztcblxuICAgIGZvciAodmFyIGtleSBpbiB0aGlzJDEuY2FjaGUpIHtcbiAgICAgIHBydW5lQ2FjaGVFbnRyeSh0aGlzJDEuY2FjaGVba2V5XSk7XG4gICAgfVxuICB9LFxuXG4gIHdhdGNoOiB7XG4gICAgaW5jbHVkZTogZnVuY3Rpb24gaW5jbHVkZSAodmFsKSB7XG4gICAgICBwcnVuZUNhY2hlKHRoaXMuY2FjaGUsIGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBtYXRjaGVzKHZhbCwgbmFtZSk7IH0pO1xuICAgIH0sXG4gICAgZXhjbHVkZTogZnVuY3Rpb24gZXhjbHVkZSAodmFsKSB7XG4gICAgICBwcnVuZUNhY2hlKHRoaXMuY2FjaGUsIGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiAhbWF0Y2hlcyh2YWwsIG5hbWUpOyB9KTtcbiAgICB9XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIgKCkge1xuICAgIHZhciB2bm9kZSA9IGdldEZpcnN0Q29tcG9uZW50Q2hpbGQodGhpcy4kc2xvdHMuZGVmYXVsdCk7XG4gICAgdmFyIGNvbXBvbmVudE9wdGlvbnMgPSB2bm9kZSAmJiB2bm9kZS5jb21wb25lbnRPcHRpb25zO1xuICAgIGlmIChjb21wb25lbnRPcHRpb25zKSB7XG4gICAgICAvLyBjaGVjayBwYXR0ZXJuXG4gICAgICB2YXIgbmFtZSA9IGdldENvbXBvbmVudE5hbWUoY29tcG9uZW50T3B0aW9ucyk7XG4gICAgICBpZiAobmFtZSAmJiAoXG4gICAgICAgICh0aGlzLmluY2x1ZGUgJiYgIW1hdGNoZXModGhpcy5pbmNsdWRlLCBuYW1lKSkgfHxcbiAgICAgICAgKHRoaXMuZXhjbHVkZSAmJiBtYXRjaGVzKHRoaXMuZXhjbHVkZSwgbmFtZSkpXG4gICAgICApKSB7XG4gICAgICAgIHJldHVybiB2bm9kZVxuICAgICAgfVxuICAgICAgdmFyIGtleSA9IHZub2RlLmtleSA9PSBudWxsXG4gICAgICAgIC8vIHNhbWUgY29uc3RydWN0b3IgbWF5IGdldCByZWdpc3RlcmVkIGFzIGRpZmZlcmVudCBsb2NhbCBjb21wb25lbnRzXG4gICAgICAgIC8vIHNvIGNpZCBhbG9uZSBpcyBub3QgZW5vdWdoICgjMzI2OSlcbiAgICAgICAgPyBjb21wb25lbnRPcHRpb25zLkN0b3IuY2lkICsgKGNvbXBvbmVudE9wdGlvbnMudGFnID8gKFwiOjpcIiArIChjb21wb25lbnRPcHRpb25zLnRhZykpIDogJycpXG4gICAgICAgIDogdm5vZGUua2V5O1xuICAgICAgaWYgKHRoaXMuY2FjaGVba2V5XSkge1xuICAgICAgICB2bm9kZS5jb21wb25lbnRJbnN0YW5jZSA9IHRoaXMuY2FjaGVba2V5XS5jb21wb25lbnRJbnN0YW5jZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY2FjaGVba2V5XSA9IHZub2RlO1xuICAgICAgfVxuICAgICAgdm5vZGUuZGF0YS5rZWVwQWxpdmUgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gdm5vZGVcbiAgfVxufTtcblxudmFyIGJ1aWx0SW5Db21wb25lbnRzID0ge1xuICBLZWVwQWxpdmU6IEtlZXBBbGl2ZVxufTtcblxuLyogICovXG5cbmZ1bmN0aW9uIGluaXRHbG9iYWxBUEkgKFZ1ZSkge1xuICAvLyBjb25maWdcbiAgdmFyIGNvbmZpZ0RlZiA9IHt9O1xuICBjb25maWdEZWYuZ2V0ID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gY29uZmlnOyB9O1xuICB7XG4gICAgY29uZmlnRGVmLnNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHdhcm4oXG4gICAgICAgICdEbyBub3QgcmVwbGFjZSB0aGUgVnVlLmNvbmZpZyBvYmplY3QsIHNldCBpbmRpdmlkdWFsIGZpZWxkcyBpbnN0ZWFkLidcbiAgICAgICk7XG4gICAgfTtcbiAgfVxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoVnVlLCAnY29uZmlnJywgY29uZmlnRGVmKTtcblxuICAvLyBleHBvc2VkIHV0aWwgbWV0aG9kcy5cbiAgLy8gTk9URTogdGhlc2UgYXJlIG5vdCBjb25zaWRlcmVkIHBhcnQgb2YgdGhlIHB1YmxpYyBBUEkgLSBhdm9pZCByZWx5aW5nIG9uXG4gIC8vIHRoZW0gdW5sZXNzIHlvdSBhcmUgYXdhcmUgb2YgdGhlIHJpc2suXG4gIFZ1ZS51dGlsID0ge1xuICAgIHdhcm46IHdhcm4sXG4gICAgZXh0ZW5kOiBleHRlbmQsXG4gICAgbWVyZ2VPcHRpb25zOiBtZXJnZU9wdGlvbnMsXG4gICAgZGVmaW5lUmVhY3RpdmU6IGRlZmluZVJlYWN0aXZlJCQxXG4gIH07XG5cbiAgVnVlLnNldCA9IHNldDtcbiAgVnVlLmRlbGV0ZSA9IGRlbDtcbiAgVnVlLm5leHRUaWNrID0gbmV4dFRpY2s7XG5cbiAgVnVlLm9wdGlvbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICBjb25maWcuX2Fzc2V0VHlwZXMuZm9yRWFjaChmdW5jdGlvbiAodHlwZSkge1xuICAgIFZ1ZS5vcHRpb25zW3R5cGUgKyAncyddID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgfSk7XG5cbiAgLy8gdGhpcyBpcyB1c2VkIHRvIGlkZW50aWZ5IHRoZSBcImJhc2VcIiBjb25zdHJ1Y3RvciB0byBleHRlbmQgYWxsIHBsYWluLW9iamVjdFxuICAvLyBjb21wb25lbnRzIHdpdGggaW4gV2VleCdzIG11bHRpLWluc3RhbmNlIHNjZW5hcmlvcy5cbiAgVnVlLm9wdGlvbnMuX2Jhc2UgPSBWdWU7XG5cbiAgZXh0ZW5kKFZ1ZS5vcHRpb25zLmNvbXBvbmVudHMsIGJ1aWx0SW5Db21wb25lbnRzKTtcblxuICBpbml0VXNlKFZ1ZSk7XG4gIGluaXRNaXhpbiQxKFZ1ZSk7XG4gIGluaXRFeHRlbmQoVnVlKTtcbiAgaW5pdEFzc2V0UmVnaXN0ZXJzKFZ1ZSk7XG59XG5cbmluaXRHbG9iYWxBUEkoVnVlJDMpO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoVnVlJDMucHJvdG90eXBlLCAnJGlzU2VydmVyJywge1xuICBnZXQ6IGlzU2VydmVyUmVuZGVyaW5nXG59KTtcblxuVnVlJDMudmVyc2lvbiA9ICcyLjIuMic7XG5cbi8qICAqL1xuXG4vLyBhdHRyaWJ1dGVzIHRoYXQgc2hvdWxkIGJlIHVzaW5nIHByb3BzIGZvciBiaW5kaW5nXG52YXIgYWNjZXB0VmFsdWUgPSBtYWtlTWFwKCdpbnB1dCx0ZXh0YXJlYSxvcHRpb24sc2VsZWN0Jyk7XG52YXIgbXVzdFVzZVByb3AgPSBmdW5jdGlvbiAodGFnLCB0eXBlLCBhdHRyKSB7XG4gIHJldHVybiAoXG4gICAgKGF0dHIgPT09ICd2YWx1ZScgJiYgYWNjZXB0VmFsdWUodGFnKSkgJiYgdHlwZSAhPT0gJ2J1dHRvbicgfHxcbiAgICAoYXR0ciA9PT0gJ3NlbGVjdGVkJyAmJiB0YWcgPT09ICdvcHRpb24nKSB8fFxuICAgIChhdHRyID09PSAnY2hlY2tlZCcgJiYgdGFnID09PSAnaW5wdXQnKSB8fFxuICAgIChhdHRyID09PSAnbXV0ZWQnICYmIHRhZyA9PT0gJ3ZpZGVvJylcbiAgKVxufTtcblxudmFyIGlzRW51bWVyYXRlZEF0dHIgPSBtYWtlTWFwKCdjb250ZW50ZWRpdGFibGUsZHJhZ2dhYmxlLHNwZWxsY2hlY2snKTtcblxudmFyIGlzQm9vbGVhbkF0dHIgPSBtYWtlTWFwKFxuICAnYWxsb3dmdWxsc2NyZWVuLGFzeW5jLGF1dG9mb2N1cyxhdXRvcGxheSxjaGVja2VkLGNvbXBhY3QsY29udHJvbHMsZGVjbGFyZSwnICtcbiAgJ2RlZmF1bHQsZGVmYXVsdGNoZWNrZWQsZGVmYXVsdG11dGVkLGRlZmF1bHRzZWxlY3RlZCxkZWZlcixkaXNhYmxlZCwnICtcbiAgJ2VuYWJsZWQsZm9ybW5vdmFsaWRhdGUsaGlkZGVuLGluZGV0ZXJtaW5hdGUsaW5lcnQsaXNtYXAsaXRlbXNjb3BlLGxvb3AsbXVsdGlwbGUsJyArXG4gICdtdXRlZCxub2hyZWYsbm9yZXNpemUsbm9zaGFkZSxub3ZhbGlkYXRlLG5vd3JhcCxvcGVuLHBhdXNlb25leGl0LHJlYWRvbmx5LCcgK1xuICAncmVxdWlyZWQscmV2ZXJzZWQsc2NvcGVkLHNlYW1sZXNzLHNlbGVjdGVkLHNvcnRhYmxlLHRyYW5zbGF0ZSwnICtcbiAgJ3RydWVzcGVlZCx0eXBlbXVzdG1hdGNoLHZpc2libGUnXG4pO1xuXG52YXIgeGxpbmtOUyA9ICdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJztcblxudmFyIGlzWGxpbmsgPSBmdW5jdGlvbiAobmFtZSkge1xuICByZXR1cm4gbmFtZS5jaGFyQXQoNSkgPT09ICc6JyAmJiBuYW1lLnNsaWNlKDAsIDUpID09PSAneGxpbmsnXG59O1xuXG52YXIgZ2V0WGxpbmtQcm9wID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgcmV0dXJuIGlzWGxpbmsobmFtZSkgPyBuYW1lLnNsaWNlKDYsIG5hbWUubGVuZ3RoKSA6ICcnXG59O1xuXG52YXIgaXNGYWxzeUF0dHJWYWx1ZSA9IGZ1bmN0aW9uICh2YWwpIHtcbiAgcmV0dXJuIHZhbCA9PSBudWxsIHx8IHZhbCA9PT0gZmFsc2Vcbn07XG5cbi8qICAqL1xuXG5mdW5jdGlvbiBnZW5DbGFzc0ZvclZub2RlICh2bm9kZSkge1xuICB2YXIgZGF0YSA9IHZub2RlLmRhdGE7XG4gIHZhciBwYXJlbnROb2RlID0gdm5vZGU7XG4gIHZhciBjaGlsZE5vZGUgPSB2bm9kZTtcbiAgd2hpbGUgKGNoaWxkTm9kZS5jb21wb25lbnRJbnN0YW5jZSkge1xuICAgIGNoaWxkTm9kZSA9IGNoaWxkTm9kZS5jb21wb25lbnRJbnN0YW5jZS5fdm5vZGU7XG4gICAgaWYgKGNoaWxkTm9kZS5kYXRhKSB7XG4gICAgICBkYXRhID0gbWVyZ2VDbGFzc0RhdGEoY2hpbGROb2RlLmRhdGEsIGRhdGEpO1xuICAgIH1cbiAgfVxuICB3aGlsZSAoKHBhcmVudE5vZGUgPSBwYXJlbnROb2RlLnBhcmVudCkpIHtcbiAgICBpZiAocGFyZW50Tm9kZS5kYXRhKSB7XG4gICAgICBkYXRhID0gbWVyZ2VDbGFzc0RhdGEoZGF0YSwgcGFyZW50Tm9kZS5kYXRhKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGdlbkNsYXNzRnJvbURhdGEoZGF0YSlcbn1cblxuZnVuY3Rpb24gbWVyZ2VDbGFzc0RhdGEgKGNoaWxkLCBwYXJlbnQpIHtcbiAgcmV0dXJuIHtcbiAgICBzdGF0aWNDbGFzczogY29uY2F0KGNoaWxkLnN0YXRpY0NsYXNzLCBwYXJlbnQuc3RhdGljQ2xhc3MpLFxuICAgIGNsYXNzOiBjaGlsZC5jbGFzc1xuICAgICAgPyBbY2hpbGQuY2xhc3MsIHBhcmVudC5jbGFzc11cbiAgICAgIDogcGFyZW50LmNsYXNzXG4gIH1cbn1cblxuZnVuY3Rpb24gZ2VuQ2xhc3NGcm9tRGF0YSAoZGF0YSkge1xuICB2YXIgZHluYW1pY0NsYXNzID0gZGF0YS5jbGFzcztcbiAgdmFyIHN0YXRpY0NsYXNzID0gZGF0YS5zdGF0aWNDbGFzcztcbiAgaWYgKHN0YXRpY0NsYXNzIHx8IGR5bmFtaWNDbGFzcykge1xuICAgIHJldHVybiBjb25jYXQoc3RhdGljQ2xhc3MsIHN0cmluZ2lmeUNsYXNzKGR5bmFtaWNDbGFzcykpXG4gIH1cbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgcmV0dXJuICcnXG59XG5cbmZ1bmN0aW9uIGNvbmNhdCAoYSwgYikge1xuICByZXR1cm4gYSA/IGIgPyAoYSArICcgJyArIGIpIDogYSA6IChiIHx8ICcnKVxufVxuXG5mdW5jdGlvbiBzdHJpbmdpZnlDbGFzcyAodmFsdWUpIHtcbiAgdmFyIHJlcyA9ICcnO1xuICBpZiAoIXZhbHVlKSB7XG4gICAgcmV0dXJuIHJlc1xuICB9XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHZhbHVlXG4gIH1cbiAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgdmFyIHN0cmluZ2lmaWVkO1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gdmFsdWUubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBpZiAodmFsdWVbaV0pIHtcbiAgICAgICAgaWYgKChzdHJpbmdpZmllZCA9IHN0cmluZ2lmeUNsYXNzKHZhbHVlW2ldKSkpIHtcbiAgICAgICAgICByZXMgKz0gc3RyaW5naWZpZWQgKyAnICc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlcy5zbGljZSgwLCAtMSlcbiAgfVxuICBpZiAoaXNPYmplY3QodmFsdWUpKSB7XG4gICAgZm9yICh2YXIga2V5IGluIHZhbHVlKSB7XG4gICAgICBpZiAodmFsdWVba2V5XSkgeyByZXMgKz0ga2V5ICsgJyAnOyB9XG4gICAgfVxuICAgIHJldHVybiByZXMuc2xpY2UoMCwgLTEpXG4gIH1cbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgcmV0dXJuIHJlc1xufVxuXG4vKiAgKi9cblxudmFyIG5hbWVzcGFjZU1hcCA9IHtcbiAgc3ZnOiAnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLFxuICBtYXRoOiAnaHR0cDovL3d3dy53My5vcmcvMTk5OC9NYXRoL01hdGhNTCdcbn07XG5cbnZhciBpc0hUTUxUYWcgPSBtYWtlTWFwKFxuICAnaHRtbCxib2R5LGJhc2UsaGVhZCxsaW5rLG1ldGEsc3R5bGUsdGl0bGUsJyArXG4gICdhZGRyZXNzLGFydGljbGUsYXNpZGUsZm9vdGVyLGhlYWRlcixoMSxoMixoMyxoNCxoNSxoNixoZ3JvdXAsbmF2LHNlY3Rpb24sJyArXG4gICdkaXYsZGQsZGwsZHQsZmlnY2FwdGlvbixmaWd1cmUsaHIsaW1nLGxpLG1haW4sb2wscCxwcmUsdWwsJyArXG4gICdhLGIsYWJicixiZGksYmRvLGJyLGNpdGUsY29kZSxkYXRhLGRmbixlbSxpLGtiZCxtYXJrLHEscnAscnQscnRjLHJ1YnksJyArXG4gICdzLHNhbXAsc21hbGwsc3BhbixzdHJvbmcsc3ViLHN1cCx0aW1lLHUsdmFyLHdicixhcmVhLGF1ZGlvLG1hcCx0cmFjayx2aWRlbywnICtcbiAgJ2VtYmVkLG9iamVjdCxwYXJhbSxzb3VyY2UsY2FudmFzLHNjcmlwdCxub3NjcmlwdCxkZWwsaW5zLCcgK1xuICAnY2FwdGlvbixjb2wsY29sZ3JvdXAsdGFibGUsdGhlYWQsdGJvZHksdGQsdGgsdHIsJyArXG4gICdidXR0b24sZGF0YWxpc3QsZmllbGRzZXQsZm9ybSxpbnB1dCxsYWJlbCxsZWdlbmQsbWV0ZXIsb3B0Z3JvdXAsb3B0aW9uLCcgK1xuICAnb3V0cHV0LHByb2dyZXNzLHNlbGVjdCx0ZXh0YXJlYSwnICtcbiAgJ2RldGFpbHMsZGlhbG9nLG1lbnUsbWVudWl0ZW0sc3VtbWFyeSwnICtcbiAgJ2NvbnRlbnQsZWxlbWVudCxzaGFkb3csdGVtcGxhdGUnXG4pO1xuXG4vLyB0aGlzIG1hcCBpcyBpbnRlbnRpb25hbGx5IHNlbGVjdGl2ZSwgb25seSBjb3ZlcmluZyBTVkcgZWxlbWVudHMgdGhhdCBtYXlcbi8vIGNvbnRhaW4gY2hpbGQgZWxlbWVudHMuXG52YXIgaXNTVkcgPSBtYWtlTWFwKFxuICAnc3ZnLGFuaW1hdGUsY2lyY2xlLGNsaXBwYXRoLGN1cnNvcixkZWZzLGRlc2MsZWxsaXBzZSxmaWx0ZXIsZm9udC1mYWNlLCcgK1xuICAnZm9yZWlnbk9iamVjdCxnLGdseXBoLGltYWdlLGxpbmUsbWFya2VyLG1hc2ssbWlzc2luZy1nbHlwaCxwYXRoLHBhdHRlcm4sJyArXG4gICdwb2x5Z29uLHBvbHlsaW5lLHJlY3Qsc3dpdGNoLHN5bWJvbCx0ZXh0LHRleHRwYXRoLHRzcGFuLHVzZSx2aWV3JyxcbiAgdHJ1ZVxuKTtcblxudmFyIGlzUHJlVGFnID0gZnVuY3Rpb24gKHRhZykgeyByZXR1cm4gdGFnID09PSAncHJlJzsgfTtcblxudmFyIGlzUmVzZXJ2ZWRUYWcgPSBmdW5jdGlvbiAodGFnKSB7XG4gIHJldHVybiBpc0hUTUxUYWcodGFnKSB8fCBpc1NWRyh0YWcpXG59O1xuXG5mdW5jdGlvbiBnZXRUYWdOYW1lc3BhY2UgKHRhZykge1xuICBpZiAoaXNTVkcodGFnKSkge1xuICAgIHJldHVybiAnc3ZnJ1xuICB9XG4gIC8vIGJhc2ljIHN1cHBvcnQgZm9yIE1hdGhNTFxuICAvLyBub3RlIGl0IGRvZXNuJ3Qgc3VwcG9ydCBvdGhlciBNYXRoTUwgZWxlbWVudHMgYmVpbmcgY29tcG9uZW50IHJvb3RzXG4gIGlmICh0YWcgPT09ICdtYXRoJykge1xuICAgIHJldHVybiAnbWF0aCdcbiAgfVxufVxuXG52YXIgdW5rbm93bkVsZW1lbnRDYWNoZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5mdW5jdGlvbiBpc1Vua25vd25FbGVtZW50ICh0YWcpIHtcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gIGlmICghaW5Ccm93c2VyKSB7XG4gICAgcmV0dXJuIHRydWVcbiAgfVxuICBpZiAoaXNSZXNlcnZlZFRhZyh0YWcpKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbiAgdGFnID0gdGFnLnRvTG93ZXJDYXNlKCk7XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICBpZiAodW5rbm93bkVsZW1lbnRDYWNoZVt0YWddICE9IG51bGwpIHtcbiAgICByZXR1cm4gdW5rbm93bkVsZW1lbnRDYWNoZVt0YWddXG4gIH1cbiAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpO1xuICBpZiAodGFnLmluZGV4T2YoJy0nKSA+IC0xKSB7XG4gICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjgyMTAzNjQvMTA3MDI0NFxuICAgIHJldHVybiAodW5rbm93bkVsZW1lbnRDYWNoZVt0YWddID0gKFxuICAgICAgZWwuY29uc3RydWN0b3IgPT09IHdpbmRvdy5IVE1MVW5rbm93bkVsZW1lbnQgfHxcbiAgICAgIGVsLmNvbnN0cnVjdG9yID09PSB3aW5kb3cuSFRNTEVsZW1lbnRcbiAgICApKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiAodW5rbm93bkVsZW1lbnRDYWNoZVt0YWddID0gL0hUTUxVbmtub3duRWxlbWVudC8udGVzdChlbC50b1N0cmluZygpKSlcbiAgfVxufVxuXG4vKiAgKi9cblxuLyoqXG4gKiBRdWVyeSBhbiBlbGVtZW50IHNlbGVjdG9yIGlmIGl0J3Mgbm90IGFuIGVsZW1lbnQgYWxyZWFkeS5cbiAqL1xuZnVuY3Rpb24gcXVlcnkgKGVsKSB7XG4gIGlmICh0eXBlb2YgZWwgPT09ICdzdHJpbmcnKSB7XG4gICAgdmFyIHNlbGVjdGVkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbCk7XG4gICAgaWYgKCFzZWxlY3RlZCkge1xuICAgICAgXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiYgd2FybihcbiAgICAgICAgJ0Nhbm5vdCBmaW5kIGVsZW1lbnQ6ICcgKyBlbFxuICAgICAgKTtcbiAgICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIH1cbiAgICByZXR1cm4gc2VsZWN0ZWRcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZWxcbiAgfVxufVxuXG4vKiAgKi9cblxuZnVuY3Rpb24gY3JlYXRlRWxlbWVudCQxICh0YWdOYW1lLCB2bm9kZSkge1xuICB2YXIgZWxtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWdOYW1lKTtcbiAgaWYgKHRhZ05hbWUgIT09ICdzZWxlY3QnKSB7XG4gICAgcmV0dXJuIGVsbVxuICB9XG4gIC8vIGZhbHNlIG9yIG51bGwgd2lsbCByZW1vdmUgdGhlIGF0dHJpYnV0ZSBidXQgdW5kZWZpbmVkIHdpbGwgbm90XG4gIGlmICh2bm9kZS5kYXRhICYmIHZub2RlLmRhdGEuYXR0cnMgJiYgdm5vZGUuZGF0YS5hdHRycy5tdWx0aXBsZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgZWxtLnNldEF0dHJpYnV0ZSgnbXVsdGlwbGUnLCAnbXVsdGlwbGUnKTtcbiAgfVxuICByZXR1cm4gZWxtXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnROUyAobmFtZXNwYWNlLCB0YWdOYW1lKSB7XG4gIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobmFtZXNwYWNlTWFwW25hbWVzcGFjZV0sIHRhZ05hbWUpXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVRleHROb2RlICh0ZXh0KSB7XG4gIHJldHVybiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0ZXh0KVxufVxuXG5mdW5jdGlvbiBjcmVhdGVDb21tZW50ICh0ZXh0KSB7XG4gIHJldHVybiBkb2N1bWVudC5jcmVhdGVDb21tZW50KHRleHQpXG59XG5cbmZ1bmN0aW9uIGluc2VydEJlZm9yZSAocGFyZW50Tm9kZSwgbmV3Tm9kZSwgcmVmZXJlbmNlTm9kZSkge1xuICBwYXJlbnROb2RlLmluc2VydEJlZm9yZShuZXdOb2RlLCByZWZlcmVuY2VOb2RlKTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlQ2hpbGQgKG5vZGUsIGNoaWxkKSB7XG4gIG5vZGUucmVtb3ZlQ2hpbGQoY2hpbGQpO1xufVxuXG5mdW5jdGlvbiBhcHBlbmRDaGlsZCAobm9kZSwgY2hpbGQpIHtcbiAgbm9kZS5hcHBlbmRDaGlsZChjaGlsZCk7XG59XG5cbmZ1bmN0aW9uIHBhcmVudE5vZGUgKG5vZGUpIHtcbiAgcmV0dXJuIG5vZGUucGFyZW50Tm9kZVxufVxuXG5mdW5jdGlvbiBuZXh0U2libGluZyAobm9kZSkge1xuICByZXR1cm4gbm9kZS5uZXh0U2libGluZ1xufVxuXG5mdW5jdGlvbiB0YWdOYW1lIChub2RlKSB7XG4gIHJldHVybiBub2RlLnRhZ05hbWVcbn1cblxuZnVuY3Rpb24gc2V0VGV4dENvbnRlbnQgKG5vZGUsIHRleHQpIHtcbiAgbm9kZS50ZXh0Q29udGVudCA9IHRleHQ7XG59XG5cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZSAobm9kZSwga2V5LCB2YWwpIHtcbiAgbm9kZS5zZXRBdHRyaWJ1dGUoa2V5LCB2YWwpO1xufVxuXG5cbnZhciBub2RlT3BzID0gT2JqZWN0LmZyZWV6ZSh7XG5cdGNyZWF0ZUVsZW1lbnQ6IGNyZWF0ZUVsZW1lbnQkMSxcblx0Y3JlYXRlRWxlbWVudE5TOiBjcmVhdGVFbGVtZW50TlMsXG5cdGNyZWF0ZVRleHROb2RlOiBjcmVhdGVUZXh0Tm9kZSxcblx0Y3JlYXRlQ29tbWVudDogY3JlYXRlQ29tbWVudCxcblx0aW5zZXJ0QmVmb3JlOiBpbnNlcnRCZWZvcmUsXG5cdHJlbW92ZUNoaWxkOiByZW1vdmVDaGlsZCxcblx0YXBwZW5kQ2hpbGQ6IGFwcGVuZENoaWxkLFxuXHRwYXJlbnROb2RlOiBwYXJlbnROb2RlLFxuXHRuZXh0U2libGluZzogbmV4dFNpYmxpbmcsXG5cdHRhZ05hbWU6IHRhZ05hbWUsXG5cdHNldFRleHRDb250ZW50OiBzZXRUZXh0Q29udGVudCxcblx0c2V0QXR0cmlidXRlOiBzZXRBdHRyaWJ1dGVcbn0pO1xuXG4vKiAgKi9cblxudmFyIHJlZiA9IHtcbiAgY3JlYXRlOiBmdW5jdGlvbiBjcmVhdGUgKF8sIHZub2RlKSB7XG4gICAgcmVnaXN0ZXJSZWYodm5vZGUpO1xuICB9LFxuICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZSAob2xkVm5vZGUsIHZub2RlKSB7XG4gICAgaWYgKG9sZFZub2RlLmRhdGEucmVmICE9PSB2bm9kZS5kYXRhLnJlZikge1xuICAgICAgcmVnaXN0ZXJSZWYob2xkVm5vZGUsIHRydWUpO1xuICAgICAgcmVnaXN0ZXJSZWYodm5vZGUpO1xuICAgIH1cbiAgfSxcbiAgZGVzdHJveTogZnVuY3Rpb24gZGVzdHJveSAodm5vZGUpIHtcbiAgICByZWdpc3RlclJlZih2bm9kZSwgdHJ1ZSk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyUmVmICh2bm9kZSwgaXNSZW1vdmFsKSB7XG4gIHZhciBrZXkgPSB2bm9kZS5kYXRhLnJlZjtcbiAgaWYgKCFrZXkpIHsgcmV0dXJuIH1cblxuICB2YXIgdm0gPSB2bm9kZS5jb250ZXh0O1xuICB2YXIgcmVmID0gdm5vZGUuY29tcG9uZW50SW5zdGFuY2UgfHwgdm5vZGUuZWxtO1xuICB2YXIgcmVmcyA9IHZtLiRyZWZzO1xuICBpZiAoaXNSZW1vdmFsKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkocmVmc1trZXldKSkge1xuICAgICAgcmVtb3ZlKHJlZnNba2V5XSwgcmVmKTtcbiAgICB9IGVsc2UgaWYgKHJlZnNba2V5XSA9PT0gcmVmKSB7XG4gICAgICByZWZzW2tleV0gPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmICh2bm9kZS5kYXRhLnJlZkluRm9yKSB7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShyZWZzW2tleV0pICYmIHJlZnNba2V5XS5pbmRleE9mKHJlZikgPCAwKSB7XG4gICAgICAgIHJlZnNba2V5XS5wdXNoKHJlZik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZWZzW2tleV0gPSBbcmVmXTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmVmc1trZXldID0gcmVmO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFZpcnR1YWwgRE9NIHBhdGNoaW5nIGFsZ29yaXRobSBiYXNlZCBvbiBTbmFiYmRvbSBieVxuICogU2ltb24gRnJpaXMgVmluZHVtIChAcGFsZGVwaW5kKVxuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlXG4gKiBodHRwczovL2dpdGh1Yi5jb20vcGFsZGVwaW5kL3NuYWJiZG9tL2Jsb2IvbWFzdGVyL0xJQ0VOU0VcbiAqXG4gKiBtb2RpZmllZCBieSBFdmFuIFlvdSAoQHl5eDk5MDgwMylcbiAqXG5cbi8qXG4gKiBOb3QgdHlwZS1jaGVja2luZyB0aGlzIGJlY2F1c2UgdGhpcyBmaWxlIGlzIHBlcmYtY3JpdGljYWwgYW5kIHRoZSBjb3N0XG4gKiBvZiBtYWtpbmcgZmxvdyB1bmRlcnN0YW5kIGl0IGlzIG5vdCB3b3J0aCBpdC5cbiAqL1xuXG52YXIgZW1wdHlOb2RlID0gbmV3IFZOb2RlKCcnLCB7fSwgW10pO1xuXG52YXIgaG9va3MkMSA9IFsnY3JlYXRlJywgJ2FjdGl2YXRlJywgJ3VwZGF0ZScsICdyZW1vdmUnLCAnZGVzdHJveSddO1xuXG5mdW5jdGlvbiBpc1VuZGVmIChzKSB7XG4gIHJldHVybiBzID09IG51bGxcbn1cblxuZnVuY3Rpb24gaXNEZWYgKHMpIHtcbiAgcmV0dXJuIHMgIT0gbnVsbFxufVxuXG5mdW5jdGlvbiBzYW1lVm5vZGUgKHZub2RlMSwgdm5vZGUyKSB7XG4gIHJldHVybiAoXG4gICAgdm5vZGUxLmtleSA9PT0gdm5vZGUyLmtleSAmJlxuICAgIHZub2RlMS50YWcgPT09IHZub2RlMi50YWcgJiZcbiAgICB2bm9kZTEuaXNDb21tZW50ID09PSB2bm9kZTIuaXNDb21tZW50ICYmXG4gICAgIXZub2RlMS5kYXRhID09PSAhdm5vZGUyLmRhdGFcbiAgKVxufVxuXG5mdW5jdGlvbiBjcmVhdGVLZXlUb09sZElkeCAoY2hpbGRyZW4sIGJlZ2luSWR4LCBlbmRJZHgpIHtcbiAgdmFyIGksIGtleTtcbiAgdmFyIG1hcCA9IHt9O1xuICBmb3IgKGkgPSBiZWdpbklkeDsgaSA8PSBlbmRJZHg7ICsraSkge1xuICAgIGtleSA9IGNoaWxkcmVuW2ldLmtleTtcbiAgICBpZiAoaXNEZWYoa2V5KSkgeyBtYXBba2V5XSA9IGk7IH1cbiAgfVxuICByZXR1cm4gbWFwXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVBhdGNoRnVuY3Rpb24gKGJhY2tlbmQpIHtcbiAgdmFyIGksIGo7XG4gIHZhciBjYnMgPSB7fTtcblxuICB2YXIgbW9kdWxlcyA9IGJhY2tlbmQubW9kdWxlcztcbiAgdmFyIG5vZGVPcHMgPSBiYWNrZW5kLm5vZGVPcHM7XG5cbiAgZm9yIChpID0gMDsgaSA8IGhvb2tzJDEubGVuZ3RoOyArK2kpIHtcbiAgICBjYnNbaG9va3MkMVtpXV0gPSBbXTtcbiAgICBmb3IgKGogPSAwOyBqIDwgbW9kdWxlcy5sZW5ndGg7ICsraikge1xuICAgICAgaWYgKG1vZHVsZXNbal1baG9va3MkMVtpXV0gIT09IHVuZGVmaW5lZCkgeyBjYnNbaG9va3MkMVtpXV0ucHVzaChtb2R1bGVzW2pdW2hvb2tzJDFbaV1dKTsgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGVtcHR5Tm9kZUF0IChlbG0pIHtcbiAgICByZXR1cm4gbmV3IFZOb2RlKG5vZGVPcHMudGFnTmFtZShlbG0pLnRvTG93ZXJDYXNlKCksIHt9LCBbXSwgdW5kZWZpbmVkLCBlbG0pXG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVSbUNiIChjaGlsZEVsbSwgbGlzdGVuZXJzKSB7XG4gICAgZnVuY3Rpb24gcmVtb3ZlJCQxICgpIHtcbiAgICAgIGlmICgtLXJlbW92ZSQkMS5saXN0ZW5lcnMgPT09IDApIHtcbiAgICAgICAgcmVtb3ZlTm9kZShjaGlsZEVsbSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJlbW92ZSQkMS5saXN0ZW5lcnMgPSBsaXN0ZW5lcnM7XG4gICAgcmV0dXJuIHJlbW92ZSQkMVxuICB9XG5cbiAgZnVuY3Rpb24gcmVtb3ZlTm9kZSAoZWwpIHtcbiAgICB2YXIgcGFyZW50ID0gbm9kZU9wcy5wYXJlbnROb2RlKGVsKTtcbiAgICAvLyBlbGVtZW50IG1heSBoYXZlIGFscmVhZHkgYmVlbiByZW1vdmVkIGR1ZSB0byB2LWh0bWwgLyB2LXRleHRcbiAgICBpZiAocGFyZW50KSB7XG4gICAgICBub2RlT3BzLnJlbW92ZUNoaWxkKHBhcmVudCwgZWwpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBpblByZSA9IDA7XG4gIGZ1bmN0aW9uIGNyZWF0ZUVsbSAodm5vZGUsIGluc2VydGVkVm5vZGVRdWV1ZSwgcGFyZW50RWxtLCByZWZFbG0sIG5lc3RlZCkge1xuICAgIHZub2RlLmlzUm9vdEluc2VydCA9ICFuZXN0ZWQ7IC8vIGZvciB0cmFuc2l0aW9uIGVudGVyIGNoZWNrXG4gICAgaWYgKGNyZWF0ZUNvbXBvbmVudCh2bm9kZSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlLCBwYXJlbnRFbG0sIHJlZkVsbSkpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHZhciBkYXRhID0gdm5vZGUuZGF0YTtcbiAgICB2YXIgY2hpbGRyZW4gPSB2bm9kZS5jaGlsZHJlbjtcbiAgICB2YXIgdGFnID0gdm5vZGUudGFnO1xuICAgIGlmIChpc0RlZih0YWcpKSB7XG4gICAgICB7XG4gICAgICAgIGlmIChkYXRhICYmIGRhdGEucHJlKSB7XG4gICAgICAgICAgaW5QcmUrKztcbiAgICAgICAgfVxuICAgICAgICBpZiAoXG4gICAgICAgICAgIWluUHJlICYmXG4gICAgICAgICAgIXZub2RlLm5zICYmXG4gICAgICAgICAgIShjb25maWcuaWdub3JlZEVsZW1lbnRzLmxlbmd0aCAmJiBjb25maWcuaWdub3JlZEVsZW1lbnRzLmluZGV4T2YodGFnKSA+IC0xKSAmJlxuICAgICAgICAgIGNvbmZpZy5pc1Vua25vd25FbGVtZW50KHRhZylcbiAgICAgICAgKSB7XG4gICAgICAgICAgd2FybihcbiAgICAgICAgICAgICdVbmtub3duIGN1c3RvbSBlbGVtZW50OiA8JyArIHRhZyArICc+IC0gZGlkIHlvdSAnICtcbiAgICAgICAgICAgICdyZWdpc3RlciB0aGUgY29tcG9uZW50IGNvcnJlY3RseT8gRm9yIHJlY3Vyc2l2ZSBjb21wb25lbnRzLCAnICtcbiAgICAgICAgICAgICdtYWtlIHN1cmUgdG8gcHJvdmlkZSB0aGUgXCJuYW1lXCIgb3B0aW9uLicsXG4gICAgICAgICAgICB2bm9kZS5jb250ZXh0XG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdm5vZGUuZWxtID0gdm5vZGUubnNcbiAgICAgICAgPyBub2RlT3BzLmNyZWF0ZUVsZW1lbnROUyh2bm9kZS5ucywgdGFnKVxuICAgICAgICA6IG5vZGVPcHMuY3JlYXRlRWxlbWVudCh0YWcsIHZub2RlKTtcbiAgICAgIHNldFNjb3BlKHZub2RlKTtcblxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICB7XG4gICAgICAgIGNyZWF0ZUNoaWxkcmVuKHZub2RlLCBjaGlsZHJlbiwgaW5zZXJ0ZWRWbm9kZVF1ZXVlKTtcbiAgICAgICAgaWYgKGlzRGVmKGRhdGEpKSB7XG4gICAgICAgICAgaW52b2tlQ3JlYXRlSG9va3Modm5vZGUsIGluc2VydGVkVm5vZGVRdWV1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgaW5zZXJ0KHBhcmVudEVsbSwgdm5vZGUuZWxtLCByZWZFbG0pO1xuICAgICAgfVxuXG4gICAgICBpZiAoXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiYgZGF0YSAmJiBkYXRhLnByZSkge1xuICAgICAgICBpblByZS0tO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodm5vZGUuaXNDb21tZW50KSB7XG4gICAgICB2bm9kZS5lbG0gPSBub2RlT3BzLmNyZWF0ZUNvbW1lbnQodm5vZGUudGV4dCk7XG4gICAgICBpbnNlcnQocGFyZW50RWxtLCB2bm9kZS5lbG0sIHJlZkVsbSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZub2RlLmVsbSA9IG5vZGVPcHMuY3JlYXRlVGV4dE5vZGUodm5vZGUudGV4dCk7XG4gICAgICBpbnNlcnQocGFyZW50RWxtLCB2bm9kZS5lbG0sIHJlZkVsbSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlQ29tcG9uZW50ICh2bm9kZSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlLCBwYXJlbnRFbG0sIHJlZkVsbSkge1xuICAgIHZhciBpID0gdm5vZGUuZGF0YTtcbiAgICBpZiAoaXNEZWYoaSkpIHtcbiAgICAgIHZhciBpc1JlYWN0aXZhdGVkID0gaXNEZWYodm5vZGUuY29tcG9uZW50SW5zdGFuY2UpICYmIGkua2VlcEFsaXZlO1xuICAgICAgaWYgKGlzRGVmKGkgPSBpLmhvb2spICYmIGlzRGVmKGkgPSBpLmluaXQpKSB7XG4gICAgICAgIGkodm5vZGUsIGZhbHNlIC8qIGh5ZHJhdGluZyAqLywgcGFyZW50RWxtLCByZWZFbG0pO1xuICAgICAgfVxuICAgICAgLy8gYWZ0ZXIgY2FsbGluZyB0aGUgaW5pdCBob29rLCBpZiB0aGUgdm5vZGUgaXMgYSBjaGlsZCBjb21wb25lbnRcbiAgICAgIC8vIGl0IHNob3VsZCd2ZSBjcmVhdGVkIGEgY2hpbGQgaW5zdGFuY2UgYW5kIG1vdW50ZWQgaXQuIHRoZSBjaGlsZFxuICAgICAgLy8gY29tcG9uZW50IGFsc28gaGFzIHNldCB0aGUgcGxhY2Vob2xkZXIgdm5vZGUncyBlbG0uXG4gICAgICAvLyBpbiB0aGF0IGNhc2Ugd2UgY2FuIGp1c3QgcmV0dXJuIHRoZSBlbGVtZW50IGFuZCBiZSBkb25lLlxuICAgICAgaWYgKGlzRGVmKHZub2RlLmNvbXBvbmVudEluc3RhbmNlKSkge1xuICAgICAgICBpbml0Q29tcG9uZW50KHZub2RlLCBpbnNlcnRlZFZub2RlUXVldWUpO1xuICAgICAgICBpZiAoaXNSZWFjdGl2YXRlZCkge1xuICAgICAgICAgIHJlYWN0aXZhdGVDb21wb25lbnQodm5vZGUsIGluc2VydGVkVm5vZGVRdWV1ZSwgcGFyZW50RWxtLCByZWZFbG0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaW5pdENvbXBvbmVudCAodm5vZGUsIGluc2VydGVkVm5vZGVRdWV1ZSkge1xuICAgIGlmICh2bm9kZS5kYXRhLnBlbmRpbmdJbnNlcnQpIHtcbiAgICAgIGluc2VydGVkVm5vZGVRdWV1ZS5wdXNoLmFwcGx5KGluc2VydGVkVm5vZGVRdWV1ZSwgdm5vZGUuZGF0YS5wZW5kaW5nSW5zZXJ0KTtcbiAgICB9XG4gICAgdm5vZGUuZWxtID0gdm5vZGUuY29tcG9uZW50SW5zdGFuY2UuJGVsO1xuICAgIGlmIChpc1BhdGNoYWJsZSh2bm9kZSkpIHtcbiAgICAgIGludm9rZUNyZWF0ZUhvb2tzKHZub2RlLCBpbnNlcnRlZFZub2RlUXVldWUpO1xuICAgICAgc2V0U2NvcGUodm5vZGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBlbXB0eSBjb21wb25lbnQgcm9vdC5cbiAgICAgIC8vIHNraXAgYWxsIGVsZW1lbnQtcmVsYXRlZCBtb2R1bGVzIGV4Y2VwdCBmb3IgcmVmICgjMzQ1NSlcbiAgICAgIHJlZ2lzdGVyUmVmKHZub2RlKTtcbiAgICAgIC8vIG1ha2Ugc3VyZSB0byBpbnZva2UgdGhlIGluc2VydCBob29rXG4gICAgICBpbnNlcnRlZFZub2RlUXVldWUucHVzaCh2bm9kZSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcmVhY3RpdmF0ZUNvbXBvbmVudCAodm5vZGUsIGluc2VydGVkVm5vZGVRdWV1ZSwgcGFyZW50RWxtLCByZWZFbG0pIHtcbiAgICB2YXIgaTtcbiAgICAvLyBoYWNrIGZvciAjNDMzOTogYSByZWFjdGl2YXRlZCBjb21wb25lbnQgd2l0aCBpbm5lciB0cmFuc2l0aW9uXG4gICAgLy8gZG9lcyBub3QgdHJpZ2dlciBiZWNhdXNlIHRoZSBpbm5lciBub2RlJ3MgY3JlYXRlZCBob29rcyBhcmUgbm90IGNhbGxlZFxuICAgIC8vIGFnYWluLiBJdCdzIG5vdCBpZGVhbCB0byBpbnZvbHZlIG1vZHVsZS1zcGVjaWZpYyBsb2dpYyBpbiBoZXJlIGJ1dFxuICAgIC8vIHRoZXJlIGRvZXNuJ3Qgc2VlbSB0byBiZSBhIGJldHRlciB3YXkgdG8gZG8gaXQuXG4gICAgdmFyIGlubmVyTm9kZSA9IHZub2RlO1xuICAgIHdoaWxlIChpbm5lck5vZGUuY29tcG9uZW50SW5zdGFuY2UpIHtcbiAgICAgIGlubmVyTm9kZSA9IGlubmVyTm9kZS5jb21wb25lbnRJbnN0YW5jZS5fdm5vZGU7XG4gICAgICBpZiAoaXNEZWYoaSA9IGlubmVyTm9kZS5kYXRhKSAmJiBpc0RlZihpID0gaS50cmFuc2l0aW9uKSkge1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY2JzLmFjdGl2YXRlLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgY2JzLmFjdGl2YXRlW2ldKGVtcHR5Tm9kZSwgaW5uZXJOb2RlKTtcbiAgICAgICAgfVxuICAgICAgICBpbnNlcnRlZFZub2RlUXVldWUucHVzaChpbm5lck5vZGUpO1xuICAgICAgICBicmVha1xuICAgICAgfVxuICAgIH1cbiAgICAvLyB1bmxpa2UgYSBuZXdseSBjcmVhdGVkIGNvbXBvbmVudCxcbiAgICAvLyBhIHJlYWN0aXZhdGVkIGtlZXAtYWxpdmUgY29tcG9uZW50IGRvZXNuJ3QgaW5zZXJ0IGl0c2VsZlxuICAgIGluc2VydChwYXJlbnRFbG0sIHZub2RlLmVsbSwgcmVmRWxtKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluc2VydCAocGFyZW50LCBlbG0sIHJlZikge1xuICAgIGlmIChwYXJlbnQpIHtcbiAgICAgIGlmIChyZWYpIHtcbiAgICAgICAgbm9kZU9wcy5pbnNlcnRCZWZvcmUocGFyZW50LCBlbG0sIHJlZik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBub2RlT3BzLmFwcGVuZENoaWxkKHBhcmVudCwgZWxtKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVDaGlsZHJlbiAodm5vZGUsIGNoaWxkcmVuLCBpbnNlcnRlZFZub2RlUXVldWUpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShjaGlsZHJlbikpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgY3JlYXRlRWxtKGNoaWxkcmVuW2ldLCBpbnNlcnRlZFZub2RlUXVldWUsIHZub2RlLmVsbSwgbnVsbCwgdHJ1ZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChpc1ByaW1pdGl2ZSh2bm9kZS50ZXh0KSkge1xuICAgICAgbm9kZU9wcy5hcHBlbmRDaGlsZCh2bm9kZS5lbG0sIG5vZGVPcHMuY3JlYXRlVGV4dE5vZGUodm5vZGUudGV4dCkpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGlzUGF0Y2hhYmxlICh2bm9kZSkge1xuICAgIHdoaWxlICh2bm9kZS5jb21wb25lbnRJbnN0YW5jZSkge1xuICAgICAgdm5vZGUgPSB2bm9kZS5jb21wb25lbnRJbnN0YW5jZS5fdm5vZGU7XG4gICAgfVxuICAgIHJldHVybiBpc0RlZih2bm9kZS50YWcpXG4gIH1cblxuICBmdW5jdGlvbiBpbnZva2VDcmVhdGVIb29rcyAodm5vZGUsIGluc2VydGVkVm5vZGVRdWV1ZSkge1xuICAgIGZvciAodmFyIGkkMSA9IDA7IGkkMSA8IGNicy5jcmVhdGUubGVuZ3RoOyArK2kkMSkge1xuICAgICAgY2JzLmNyZWF0ZVtpJDFdKGVtcHR5Tm9kZSwgdm5vZGUpO1xuICAgIH1cbiAgICBpID0gdm5vZGUuZGF0YS5ob29rOyAvLyBSZXVzZSB2YXJpYWJsZVxuICAgIGlmIChpc0RlZihpKSkge1xuICAgICAgaWYgKGkuY3JlYXRlKSB7IGkuY3JlYXRlKGVtcHR5Tm9kZSwgdm5vZGUpOyB9XG4gICAgICBpZiAoaS5pbnNlcnQpIHsgaW5zZXJ0ZWRWbm9kZVF1ZXVlLnB1c2godm5vZGUpOyB9XG4gICAgfVxuICB9XG5cbiAgLy8gc2V0IHNjb3BlIGlkIGF0dHJpYnV0ZSBmb3Igc2NvcGVkIENTUy5cbiAgLy8gdGhpcyBpcyBpbXBsZW1lbnRlZCBhcyBhIHNwZWNpYWwgY2FzZSB0byBhdm9pZCB0aGUgb3ZlcmhlYWRcbiAgLy8gb2YgZ29pbmcgdGhyb3VnaCB0aGUgbm9ybWFsIGF0dHJpYnV0ZSBwYXRjaGluZyBwcm9jZXNzLlxuICBmdW5jdGlvbiBzZXRTY29wZSAodm5vZGUpIHtcbiAgICB2YXIgaTtcbiAgICB2YXIgYW5jZXN0b3IgPSB2bm9kZTtcbiAgICB3aGlsZSAoYW5jZXN0b3IpIHtcbiAgICAgIGlmIChpc0RlZihpID0gYW5jZXN0b3IuY29udGV4dCkgJiYgaXNEZWYoaSA9IGkuJG9wdGlvbnMuX3Njb3BlSWQpKSB7XG4gICAgICAgIG5vZGVPcHMuc2V0QXR0cmlidXRlKHZub2RlLmVsbSwgaSwgJycpO1xuICAgICAgfVxuICAgICAgYW5jZXN0b3IgPSBhbmNlc3Rvci5wYXJlbnQ7XG4gICAgfVxuICAgIC8vIGZvciBzbG90IGNvbnRlbnQgdGhleSBzaG91bGQgYWxzbyBnZXQgdGhlIHNjb3BlSWQgZnJvbSB0aGUgaG9zdCBpbnN0YW5jZS5cbiAgICBpZiAoaXNEZWYoaSA9IGFjdGl2ZUluc3RhbmNlKSAmJlxuICAgICAgICBpICE9PSB2bm9kZS5jb250ZXh0ICYmXG4gICAgICAgIGlzRGVmKGkgPSBpLiRvcHRpb25zLl9zY29wZUlkKSkge1xuICAgICAgbm9kZU9wcy5zZXRBdHRyaWJ1dGUodm5vZGUuZWxtLCBpLCAnJyk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gYWRkVm5vZGVzIChwYXJlbnRFbG0sIHJlZkVsbSwgdm5vZGVzLCBzdGFydElkeCwgZW5kSWR4LCBpbnNlcnRlZFZub2RlUXVldWUpIHtcbiAgICBmb3IgKDsgc3RhcnRJZHggPD0gZW5kSWR4OyArK3N0YXJ0SWR4KSB7XG4gICAgICBjcmVhdGVFbG0odm5vZGVzW3N0YXJ0SWR4XSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlLCBwYXJlbnRFbG0sIHJlZkVsbSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaW52b2tlRGVzdHJveUhvb2sgKHZub2RlKSB7XG4gICAgdmFyIGksIGo7XG4gICAgdmFyIGRhdGEgPSB2bm9kZS5kYXRhO1xuICAgIGlmIChpc0RlZihkYXRhKSkge1xuICAgICAgaWYgKGlzRGVmKGkgPSBkYXRhLmhvb2spICYmIGlzRGVmKGkgPSBpLmRlc3Ryb3kpKSB7IGkodm5vZGUpOyB9XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgY2JzLmRlc3Ryb3kubGVuZ3RoOyArK2kpIHsgY2JzLmRlc3Ryb3lbaV0odm5vZGUpOyB9XG4gICAgfVxuICAgIGlmIChpc0RlZihpID0gdm5vZGUuY2hpbGRyZW4pKSB7XG4gICAgICBmb3IgKGogPSAwOyBqIDwgdm5vZGUuY2hpbGRyZW4ubGVuZ3RoOyArK2opIHtcbiAgICAgICAgaW52b2tlRGVzdHJveUhvb2sodm5vZGUuY2hpbGRyZW5bal0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbW92ZVZub2RlcyAocGFyZW50RWxtLCB2bm9kZXMsIHN0YXJ0SWR4LCBlbmRJZHgpIHtcbiAgICBmb3IgKDsgc3RhcnRJZHggPD0gZW5kSWR4OyArK3N0YXJ0SWR4KSB7XG4gICAgICB2YXIgY2ggPSB2bm9kZXNbc3RhcnRJZHhdO1xuICAgICAgaWYgKGlzRGVmKGNoKSkge1xuICAgICAgICBpZiAoaXNEZWYoY2gudGFnKSkge1xuICAgICAgICAgIHJlbW92ZUFuZEludm9rZVJlbW92ZUhvb2soY2gpO1xuICAgICAgICAgIGludm9rZURlc3Ryb3lIb29rKGNoKTtcbiAgICAgICAgfSBlbHNlIHsgLy8gVGV4dCBub2RlXG4gICAgICAgICAgcmVtb3ZlTm9kZShjaC5lbG0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcmVtb3ZlQW5kSW52b2tlUmVtb3ZlSG9vayAodm5vZGUsIHJtKSB7XG4gICAgaWYgKHJtIHx8IGlzRGVmKHZub2RlLmRhdGEpKSB7XG4gICAgICB2YXIgbGlzdGVuZXJzID0gY2JzLnJlbW92ZS5sZW5ndGggKyAxO1xuICAgICAgaWYgKCFybSkge1xuICAgICAgICAvLyBkaXJlY3RseSByZW1vdmluZ1xuICAgICAgICBybSA9IGNyZWF0ZVJtQ2Iodm5vZGUuZWxtLCBsaXN0ZW5lcnMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gd2UgaGF2ZSBhIHJlY3Vyc2l2ZWx5IHBhc3NlZCBkb3duIHJtIGNhbGxiYWNrXG4gICAgICAgIC8vIGluY3JlYXNlIHRoZSBsaXN0ZW5lcnMgY291bnRcbiAgICAgICAgcm0ubGlzdGVuZXJzICs9IGxpc3RlbmVycztcbiAgICAgIH1cbiAgICAgIC8vIHJlY3Vyc2l2ZWx5IGludm9rZSBob29rcyBvbiBjaGlsZCBjb21wb25lbnQgcm9vdCBub2RlXG4gICAgICBpZiAoaXNEZWYoaSA9IHZub2RlLmNvbXBvbmVudEluc3RhbmNlKSAmJiBpc0RlZihpID0gaS5fdm5vZGUpICYmIGlzRGVmKGkuZGF0YSkpIHtcbiAgICAgICAgcmVtb3ZlQW5kSW52b2tlUmVtb3ZlSG9vayhpLCBybSk7XG4gICAgICB9XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgY2JzLnJlbW92ZS5sZW5ndGg7ICsraSkge1xuICAgICAgICBjYnMucmVtb3ZlW2ldKHZub2RlLCBybSk7XG4gICAgICB9XG4gICAgICBpZiAoaXNEZWYoaSA9IHZub2RlLmRhdGEuaG9vaykgJiYgaXNEZWYoaSA9IGkucmVtb3ZlKSkge1xuICAgICAgICBpKHZub2RlLCBybSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBybSgpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZW1vdmVOb2RlKHZub2RlLmVsbSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlQ2hpbGRyZW4gKHBhcmVudEVsbSwgb2xkQ2gsIG5ld0NoLCBpbnNlcnRlZFZub2RlUXVldWUsIHJlbW92ZU9ubHkpIHtcbiAgICB2YXIgb2xkU3RhcnRJZHggPSAwO1xuICAgIHZhciBuZXdTdGFydElkeCA9IDA7XG4gICAgdmFyIG9sZEVuZElkeCA9IG9sZENoLmxlbmd0aCAtIDE7XG4gICAgdmFyIG9sZFN0YXJ0Vm5vZGUgPSBvbGRDaFswXTtcbiAgICB2YXIgb2xkRW5kVm5vZGUgPSBvbGRDaFtvbGRFbmRJZHhdO1xuICAgIHZhciBuZXdFbmRJZHggPSBuZXdDaC5sZW5ndGggLSAxO1xuICAgIHZhciBuZXdTdGFydFZub2RlID0gbmV3Q2hbMF07XG4gICAgdmFyIG5ld0VuZFZub2RlID0gbmV3Q2hbbmV3RW5kSWR4XTtcbiAgICB2YXIgb2xkS2V5VG9JZHgsIGlkeEluT2xkLCBlbG1Ub01vdmUsIHJlZkVsbTtcblxuICAgIC8vIHJlbW92ZU9ubHkgaXMgYSBzcGVjaWFsIGZsYWcgdXNlZCBvbmx5IGJ5IDx0cmFuc2l0aW9uLWdyb3VwPlxuICAgIC8vIHRvIGVuc3VyZSByZW1vdmVkIGVsZW1lbnRzIHN0YXkgaW4gY29ycmVjdCByZWxhdGl2ZSBwb3NpdGlvbnNcbiAgICAvLyBkdXJpbmcgbGVhdmluZyB0cmFuc2l0aW9uc1xuICAgIHZhciBjYW5Nb3ZlID0gIXJlbW92ZU9ubHk7XG5cbiAgICB3aGlsZSAob2xkU3RhcnRJZHggPD0gb2xkRW5kSWR4ICYmIG5ld1N0YXJ0SWR4IDw9IG5ld0VuZElkeCkge1xuICAgICAgaWYgKGlzVW5kZWYob2xkU3RhcnRWbm9kZSkpIHtcbiAgICAgICAgb2xkU3RhcnRWbm9kZSA9IG9sZENoWysrb2xkU3RhcnRJZHhdOyAvLyBWbm9kZSBoYXMgYmVlbiBtb3ZlZCBsZWZ0XG4gICAgICB9IGVsc2UgaWYgKGlzVW5kZWYob2xkRW5kVm5vZGUpKSB7XG4gICAgICAgIG9sZEVuZFZub2RlID0gb2xkQ2hbLS1vbGRFbmRJZHhdO1xuICAgICAgfSBlbHNlIGlmIChzYW1lVm5vZGUob2xkU3RhcnRWbm9kZSwgbmV3U3RhcnRWbm9kZSkpIHtcbiAgICAgICAgcGF0Y2hWbm9kZShvbGRTdGFydFZub2RlLCBuZXdTdGFydFZub2RlLCBpbnNlcnRlZFZub2RlUXVldWUpO1xuICAgICAgICBvbGRTdGFydFZub2RlID0gb2xkQ2hbKytvbGRTdGFydElkeF07XG4gICAgICAgIG5ld1N0YXJ0Vm5vZGUgPSBuZXdDaFsrK25ld1N0YXJ0SWR4XTtcbiAgICAgIH0gZWxzZSBpZiAoc2FtZVZub2RlKG9sZEVuZFZub2RlLCBuZXdFbmRWbm9kZSkpIHtcbiAgICAgICAgcGF0Y2hWbm9kZShvbGRFbmRWbm9kZSwgbmV3RW5kVm5vZGUsIGluc2VydGVkVm5vZGVRdWV1ZSk7XG4gICAgICAgIG9sZEVuZFZub2RlID0gb2xkQ2hbLS1vbGRFbmRJZHhdO1xuICAgICAgICBuZXdFbmRWbm9kZSA9IG5ld0NoWy0tbmV3RW5kSWR4XTtcbiAgICAgIH0gZWxzZSBpZiAoc2FtZVZub2RlKG9sZFN0YXJ0Vm5vZGUsIG5ld0VuZFZub2RlKSkgeyAvLyBWbm9kZSBtb3ZlZCByaWdodFxuICAgICAgICBwYXRjaFZub2RlKG9sZFN0YXJ0Vm5vZGUsIG5ld0VuZFZub2RlLCBpbnNlcnRlZFZub2RlUXVldWUpO1xuICAgICAgICBjYW5Nb3ZlICYmIG5vZGVPcHMuaW5zZXJ0QmVmb3JlKHBhcmVudEVsbSwgb2xkU3RhcnRWbm9kZS5lbG0sIG5vZGVPcHMubmV4dFNpYmxpbmcob2xkRW5kVm5vZGUuZWxtKSk7XG4gICAgICAgIG9sZFN0YXJ0Vm5vZGUgPSBvbGRDaFsrK29sZFN0YXJ0SWR4XTtcbiAgICAgICAgbmV3RW5kVm5vZGUgPSBuZXdDaFstLW5ld0VuZElkeF07XG4gICAgICB9IGVsc2UgaWYgKHNhbWVWbm9kZShvbGRFbmRWbm9kZSwgbmV3U3RhcnRWbm9kZSkpIHsgLy8gVm5vZGUgbW92ZWQgbGVmdFxuICAgICAgICBwYXRjaFZub2RlKG9sZEVuZFZub2RlLCBuZXdTdGFydFZub2RlLCBpbnNlcnRlZFZub2RlUXVldWUpO1xuICAgICAgICBjYW5Nb3ZlICYmIG5vZGVPcHMuaW5zZXJ0QmVmb3JlKHBhcmVudEVsbSwgb2xkRW5kVm5vZGUuZWxtLCBvbGRTdGFydFZub2RlLmVsbSk7XG4gICAgICAgIG9sZEVuZFZub2RlID0gb2xkQ2hbLS1vbGRFbmRJZHhdO1xuICAgICAgICBuZXdTdGFydFZub2RlID0gbmV3Q2hbKytuZXdTdGFydElkeF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoaXNVbmRlZihvbGRLZXlUb0lkeCkpIHsgb2xkS2V5VG9JZHggPSBjcmVhdGVLZXlUb09sZElkeChvbGRDaCwgb2xkU3RhcnRJZHgsIG9sZEVuZElkeCk7IH1cbiAgICAgICAgaWR4SW5PbGQgPSBpc0RlZihuZXdTdGFydFZub2RlLmtleSkgPyBvbGRLZXlUb0lkeFtuZXdTdGFydFZub2RlLmtleV0gOiBudWxsO1xuICAgICAgICBpZiAoaXNVbmRlZihpZHhJbk9sZCkpIHsgLy8gTmV3IGVsZW1lbnRcbiAgICAgICAgICBjcmVhdGVFbG0obmV3U3RhcnRWbm9kZSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlLCBwYXJlbnRFbG0sIG9sZFN0YXJ0Vm5vZGUuZWxtKTtcbiAgICAgICAgICBuZXdTdGFydFZub2RlID0gbmV3Q2hbKytuZXdTdGFydElkeF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZWxtVG9Nb3ZlID0gb2xkQ2hbaWR4SW5PbGRdO1xuICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgICAgIGlmIChcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiAhZWxtVG9Nb3ZlKSB7XG4gICAgICAgICAgICB3YXJuKFxuICAgICAgICAgICAgICAnSXQgc2VlbXMgdGhlcmUgYXJlIGR1cGxpY2F0ZSBrZXlzIHRoYXQgaXMgY2F1c2luZyBhbiB1cGRhdGUgZXJyb3IuICcgK1xuICAgICAgICAgICAgICAnTWFrZSBzdXJlIGVhY2ggdi1mb3IgaXRlbSBoYXMgYSB1bmlxdWUga2V5LidcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChzYW1lVm5vZGUoZWxtVG9Nb3ZlLCBuZXdTdGFydFZub2RlKSkge1xuICAgICAgICAgICAgcGF0Y2hWbm9kZShlbG1Ub01vdmUsIG5ld1N0YXJ0Vm5vZGUsIGluc2VydGVkVm5vZGVRdWV1ZSk7XG4gICAgICAgICAgICBvbGRDaFtpZHhJbk9sZF0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjYW5Nb3ZlICYmIG5vZGVPcHMuaW5zZXJ0QmVmb3JlKHBhcmVudEVsbSwgbmV3U3RhcnRWbm9kZS5lbG0sIG9sZFN0YXJ0Vm5vZGUuZWxtKTtcbiAgICAgICAgICAgIG5ld1N0YXJ0Vm5vZGUgPSBuZXdDaFsrK25ld1N0YXJ0SWR4XTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gc2FtZSBrZXkgYnV0IGRpZmZlcmVudCBlbGVtZW50LiB0cmVhdCBhcyBuZXcgZWxlbWVudFxuICAgICAgICAgICAgY3JlYXRlRWxtKG5ld1N0YXJ0Vm5vZGUsIGluc2VydGVkVm5vZGVRdWV1ZSwgcGFyZW50RWxtLCBvbGRTdGFydFZub2RlLmVsbSk7XG4gICAgICAgICAgICBuZXdTdGFydFZub2RlID0gbmV3Q2hbKytuZXdTdGFydElkeF07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChvbGRTdGFydElkeCA+IG9sZEVuZElkeCkge1xuICAgICAgcmVmRWxtID0gaXNVbmRlZihuZXdDaFtuZXdFbmRJZHggKyAxXSkgPyBudWxsIDogbmV3Q2hbbmV3RW5kSWR4ICsgMV0uZWxtO1xuICAgICAgYWRkVm5vZGVzKHBhcmVudEVsbSwgcmVmRWxtLCBuZXdDaCwgbmV3U3RhcnRJZHgsIG5ld0VuZElkeCwgaW5zZXJ0ZWRWbm9kZVF1ZXVlKTtcbiAgICB9IGVsc2UgaWYgKG5ld1N0YXJ0SWR4ID4gbmV3RW5kSWR4KSB7XG4gICAgICByZW1vdmVWbm9kZXMocGFyZW50RWxtLCBvbGRDaCwgb2xkU3RhcnRJZHgsIG9sZEVuZElkeCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcGF0Y2hWbm9kZSAob2xkVm5vZGUsIHZub2RlLCBpbnNlcnRlZFZub2RlUXVldWUsIHJlbW92ZU9ubHkpIHtcbiAgICBpZiAob2xkVm5vZGUgPT09IHZub2RlKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgLy8gcmV1c2UgZWxlbWVudCBmb3Igc3RhdGljIHRyZWVzLlxuICAgIC8vIG5vdGUgd2Ugb25seSBkbyB0aGlzIGlmIHRoZSB2bm9kZSBpcyBjbG9uZWQgLVxuICAgIC8vIGlmIHRoZSBuZXcgbm9kZSBpcyBub3QgY2xvbmVkIGl0IG1lYW5zIHRoZSByZW5kZXIgZnVuY3Rpb25zIGhhdmUgYmVlblxuICAgIC8vIHJlc2V0IGJ5IHRoZSBob3QtcmVsb2FkLWFwaSBhbmQgd2UgbmVlZCB0byBkbyBhIHByb3BlciByZS1yZW5kZXIuXG4gICAgaWYgKHZub2RlLmlzU3RhdGljICYmXG4gICAgICAgIG9sZFZub2RlLmlzU3RhdGljICYmXG4gICAgICAgIHZub2RlLmtleSA9PT0gb2xkVm5vZGUua2V5ICYmXG4gICAgICAgICh2bm9kZS5pc0Nsb25lZCB8fCB2bm9kZS5pc09uY2UpKSB7XG4gICAgICB2bm9kZS5lbG0gPSBvbGRWbm9kZS5lbG07XG4gICAgICB2bm9kZS5jb21wb25lbnRJbnN0YW5jZSA9IG9sZFZub2RlLmNvbXBvbmVudEluc3RhbmNlO1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHZhciBpO1xuICAgIHZhciBkYXRhID0gdm5vZGUuZGF0YTtcbiAgICB2YXIgaGFzRGF0YSA9IGlzRGVmKGRhdGEpO1xuICAgIGlmIChoYXNEYXRhICYmIGlzRGVmKGkgPSBkYXRhLmhvb2spICYmIGlzRGVmKGkgPSBpLnByZXBhdGNoKSkge1xuICAgICAgaShvbGRWbm9kZSwgdm5vZGUpO1xuICAgIH1cbiAgICB2YXIgZWxtID0gdm5vZGUuZWxtID0gb2xkVm5vZGUuZWxtO1xuICAgIHZhciBvbGRDaCA9IG9sZFZub2RlLmNoaWxkcmVuO1xuICAgIHZhciBjaCA9IHZub2RlLmNoaWxkcmVuO1xuICAgIGlmIChoYXNEYXRhICYmIGlzUGF0Y2hhYmxlKHZub2RlKSkge1xuICAgICAgZm9yIChpID0gMDsgaSA8IGNicy51cGRhdGUubGVuZ3RoOyArK2kpIHsgY2JzLnVwZGF0ZVtpXShvbGRWbm9kZSwgdm5vZGUpOyB9XG4gICAgICBpZiAoaXNEZWYoaSA9IGRhdGEuaG9vaykgJiYgaXNEZWYoaSA9IGkudXBkYXRlKSkgeyBpKG9sZFZub2RlLCB2bm9kZSk7IH1cbiAgICB9XG4gICAgaWYgKGlzVW5kZWYodm5vZGUudGV4dCkpIHtcbiAgICAgIGlmIChpc0RlZihvbGRDaCkgJiYgaXNEZWYoY2gpKSB7XG4gICAgICAgIGlmIChvbGRDaCAhPT0gY2gpIHsgdXBkYXRlQ2hpbGRyZW4oZWxtLCBvbGRDaCwgY2gsIGluc2VydGVkVm5vZGVRdWV1ZSwgcmVtb3ZlT25seSk7IH1cbiAgICAgIH0gZWxzZSBpZiAoaXNEZWYoY2gpKSB7XG4gICAgICAgIGlmIChpc0RlZihvbGRWbm9kZS50ZXh0KSkgeyBub2RlT3BzLnNldFRleHRDb250ZW50KGVsbSwgJycpOyB9XG4gICAgICAgIGFkZFZub2RlcyhlbG0sIG51bGwsIGNoLCAwLCBjaC5sZW5ndGggLSAxLCBpbnNlcnRlZFZub2RlUXVldWUpO1xuICAgICAgfSBlbHNlIGlmIChpc0RlZihvbGRDaCkpIHtcbiAgICAgICAgcmVtb3ZlVm5vZGVzKGVsbSwgb2xkQ2gsIDAsIG9sZENoLmxlbmd0aCAtIDEpO1xuICAgICAgfSBlbHNlIGlmIChpc0RlZihvbGRWbm9kZS50ZXh0KSkge1xuICAgICAgICBub2RlT3BzLnNldFRleHRDb250ZW50KGVsbSwgJycpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAob2xkVm5vZGUudGV4dCAhPT0gdm5vZGUudGV4dCkge1xuICAgICAgbm9kZU9wcy5zZXRUZXh0Q29udGVudChlbG0sIHZub2RlLnRleHQpO1xuICAgIH1cbiAgICBpZiAoaGFzRGF0YSkge1xuICAgICAgaWYgKGlzRGVmKGkgPSBkYXRhLmhvb2spICYmIGlzRGVmKGkgPSBpLnBvc3RwYXRjaCkpIHsgaShvbGRWbm9kZSwgdm5vZGUpOyB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaW52b2tlSW5zZXJ0SG9vayAodm5vZGUsIHF1ZXVlLCBpbml0aWFsKSB7XG4gICAgLy8gZGVsYXkgaW5zZXJ0IGhvb2tzIGZvciBjb21wb25lbnQgcm9vdCBub2RlcywgaW52b2tlIHRoZW0gYWZ0ZXIgdGhlXG4gICAgLy8gZWxlbWVudCBpcyByZWFsbHkgaW5zZXJ0ZWRcbiAgICBpZiAoaW5pdGlhbCAmJiB2bm9kZS5wYXJlbnQpIHtcbiAgICAgIHZub2RlLnBhcmVudC5kYXRhLnBlbmRpbmdJbnNlcnQgPSBxdWV1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBxdWV1ZS5sZW5ndGg7ICsraSkge1xuICAgICAgICBxdWV1ZVtpXS5kYXRhLmhvb2suaW5zZXJ0KHF1ZXVlW2ldKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB2YXIgYmFpbGVkID0gZmFsc2U7XG4gIC8vIGxpc3Qgb2YgbW9kdWxlcyB0aGF0IGNhbiBza2lwIGNyZWF0ZSBob29rIGR1cmluZyBoeWRyYXRpb24gYmVjYXVzZSB0aGV5XG4gIC8vIGFyZSBhbHJlYWR5IHJlbmRlcmVkIG9uIHRoZSBjbGllbnQgb3IgaGFzIG5vIG5lZWQgZm9yIGluaXRpYWxpemF0aW9uXG4gIHZhciBpc1JlbmRlcmVkTW9kdWxlID0gbWFrZU1hcCgnYXR0cnMsc3R5bGUsY2xhc3Msc3RhdGljQ2xhc3Msc3RhdGljU3R5bGUsa2V5Jyk7XG5cbiAgLy8gTm90ZTogdGhpcyBpcyBhIGJyb3dzZXItb25seSBmdW5jdGlvbiBzbyB3ZSBjYW4gYXNzdW1lIGVsbXMgYXJlIERPTSBub2Rlcy5cbiAgZnVuY3Rpb24gaHlkcmF0ZSAoZWxtLCB2bm9kZSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlKSB7XG4gICAge1xuICAgICAgaWYgKCFhc3NlcnROb2RlTWF0Y2goZWxtLCB2bm9kZSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgfVxuICAgIHZub2RlLmVsbSA9IGVsbTtcbiAgICB2YXIgdGFnID0gdm5vZGUudGFnO1xuICAgIHZhciBkYXRhID0gdm5vZGUuZGF0YTtcbiAgICB2YXIgY2hpbGRyZW4gPSB2bm9kZS5jaGlsZHJlbjtcbiAgICBpZiAoaXNEZWYoZGF0YSkpIHtcbiAgICAgIGlmIChpc0RlZihpID0gZGF0YS5ob29rKSAmJiBpc0RlZihpID0gaS5pbml0KSkgeyBpKHZub2RlLCB0cnVlIC8qIGh5ZHJhdGluZyAqLyk7IH1cbiAgICAgIGlmIChpc0RlZihpID0gdm5vZGUuY29tcG9uZW50SW5zdGFuY2UpKSB7XG4gICAgICAgIC8vIGNoaWxkIGNvbXBvbmVudC4gaXQgc2hvdWxkIGhhdmUgaHlkcmF0ZWQgaXRzIG93biB0cmVlLlxuICAgICAgICBpbml0Q29tcG9uZW50KHZub2RlLCBpbnNlcnRlZFZub2RlUXVldWUpO1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoaXNEZWYodGFnKSkge1xuICAgICAgaWYgKGlzRGVmKGNoaWxkcmVuKSkge1xuICAgICAgICAvLyBlbXB0eSBlbGVtZW50LCBhbGxvdyBjbGllbnQgdG8gcGljayB1cCBhbmQgcG9wdWxhdGUgY2hpbGRyZW5cbiAgICAgICAgaWYgKCFlbG0uaGFzQ2hpbGROb2RlcygpKSB7XG4gICAgICAgICAgY3JlYXRlQ2hpbGRyZW4odm5vZGUsIGNoaWxkcmVuLCBpbnNlcnRlZFZub2RlUXVldWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBjaGlsZHJlbk1hdGNoID0gdHJ1ZTtcbiAgICAgICAgICB2YXIgY2hpbGROb2RlID0gZWxtLmZpcnN0Q2hpbGQ7XG4gICAgICAgICAgZm9yICh2YXIgaSQxID0gMDsgaSQxIDwgY2hpbGRyZW4ubGVuZ3RoOyBpJDErKykge1xuICAgICAgICAgICAgaWYgKCFjaGlsZE5vZGUgfHwgIWh5ZHJhdGUoY2hpbGROb2RlLCBjaGlsZHJlbltpJDFdLCBpbnNlcnRlZFZub2RlUXVldWUpKSB7XG4gICAgICAgICAgICAgIGNoaWxkcmVuTWF0Y2ggPSBmYWxzZTtcbiAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNoaWxkTm9kZSA9IGNoaWxkTm9kZS5uZXh0U2libGluZztcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gaWYgY2hpbGROb2RlIGlzIG5vdCBudWxsLCBpdCBtZWFucyB0aGUgYWN0dWFsIGNoaWxkTm9kZXMgbGlzdCBpc1xuICAgICAgICAgIC8vIGxvbmdlciB0aGFuIHRoZSB2aXJ0dWFsIGNoaWxkcmVuIGxpc3QuXG4gICAgICAgICAgaWYgKCFjaGlsZHJlbk1hdGNoIHx8IGNoaWxkTm9kZSkge1xuICAgICAgICAgICAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmXG4gICAgICAgICAgICAgICAgdHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnICYmXG4gICAgICAgICAgICAgICAgIWJhaWxlZCkge1xuICAgICAgICAgICAgICBiYWlsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ1BhcmVudDogJywgZWxtKTtcbiAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdNaXNtYXRjaGluZyBjaGlsZE5vZGVzIHZzLiBWTm9kZXM6ICcsIGVsbS5jaGlsZE5vZGVzLCBjaGlsZHJlbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChpc0RlZihkYXRhKSkge1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gZGF0YSkge1xuICAgICAgICAgIGlmICghaXNSZW5kZXJlZE1vZHVsZShrZXkpKSB7XG4gICAgICAgICAgICBpbnZva2VDcmVhdGVIb29rcyh2bm9kZSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlKTtcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChlbG0uZGF0YSAhPT0gdm5vZGUudGV4dCkge1xuICAgICAgZWxtLmRhdGEgPSB2bm9kZS50ZXh0O1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgZnVuY3Rpb24gYXNzZXJ0Tm9kZU1hdGNoIChub2RlLCB2bm9kZSkge1xuICAgIGlmICh2bm9kZS50YWcpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIHZub2RlLnRhZy5pbmRleE9mKCd2dWUtY29tcG9uZW50JykgPT09IDAgfHxcbiAgICAgICAgdm5vZGUudGFnLnRvTG93ZXJDYXNlKCkgPT09IChub2RlLnRhZ05hbWUgJiYgbm9kZS50YWdOYW1lLnRvTG93ZXJDYXNlKCkpXG4gICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBub2RlLm5vZGVUeXBlID09PSAodm5vZGUuaXNDb21tZW50ID8gOCA6IDMpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIHBhdGNoIChvbGRWbm9kZSwgdm5vZGUsIGh5ZHJhdGluZywgcmVtb3ZlT25seSwgcGFyZW50RWxtLCByZWZFbG0pIHtcbiAgICBpZiAoIXZub2RlKSB7XG4gICAgICBpZiAob2xkVm5vZGUpIHsgaW52b2tlRGVzdHJveUhvb2sob2xkVm5vZGUpOyB9XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB2YXIgaXNJbml0aWFsUGF0Y2ggPSBmYWxzZTtcbiAgICB2YXIgaW5zZXJ0ZWRWbm9kZVF1ZXVlID0gW107XG5cbiAgICBpZiAoIW9sZFZub2RlKSB7XG4gICAgICAvLyBlbXB0eSBtb3VudCAobGlrZWx5IGFzIGNvbXBvbmVudCksIGNyZWF0ZSBuZXcgcm9vdCBlbGVtZW50XG4gICAgICBpc0luaXRpYWxQYXRjaCA9IHRydWU7XG4gICAgICBjcmVhdGVFbG0odm5vZGUsIGluc2VydGVkVm5vZGVRdWV1ZSwgcGFyZW50RWxtLCByZWZFbG0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgaXNSZWFsRWxlbWVudCA9IGlzRGVmKG9sZFZub2RlLm5vZGVUeXBlKTtcbiAgICAgIGlmICghaXNSZWFsRWxlbWVudCAmJiBzYW1lVm5vZGUob2xkVm5vZGUsIHZub2RlKSkge1xuICAgICAgICAvLyBwYXRjaCBleGlzdGluZyByb290IG5vZGVcbiAgICAgICAgcGF0Y2hWbm9kZShvbGRWbm9kZSwgdm5vZGUsIGluc2VydGVkVm5vZGVRdWV1ZSwgcmVtb3ZlT25seSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoaXNSZWFsRWxlbWVudCkge1xuICAgICAgICAgIC8vIG1vdW50aW5nIHRvIGEgcmVhbCBlbGVtZW50XG4gICAgICAgICAgLy8gY2hlY2sgaWYgdGhpcyBpcyBzZXJ2ZXItcmVuZGVyZWQgY29udGVudCBhbmQgaWYgd2UgY2FuIHBlcmZvcm1cbiAgICAgICAgICAvLyBhIHN1Y2Nlc3NmdWwgaHlkcmF0aW9uLlxuICAgICAgICAgIGlmIChvbGRWbm9kZS5ub2RlVHlwZSA9PT0gMSAmJiBvbGRWbm9kZS5oYXNBdHRyaWJ1dGUoJ3NlcnZlci1yZW5kZXJlZCcpKSB7XG4gICAgICAgICAgICBvbGRWbm9kZS5yZW1vdmVBdHRyaWJ1dGUoJ3NlcnZlci1yZW5kZXJlZCcpO1xuICAgICAgICAgICAgaHlkcmF0aW5nID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGh5ZHJhdGluZykge1xuICAgICAgICAgICAgaWYgKGh5ZHJhdGUob2xkVm5vZGUsIHZub2RlLCBpbnNlcnRlZFZub2RlUXVldWUpKSB7XG4gICAgICAgICAgICAgIGludm9rZUluc2VydEhvb2sodm5vZGUsIGluc2VydGVkVm5vZGVRdWV1ZSwgdHJ1ZSk7XG4gICAgICAgICAgICAgIHJldHVybiBvbGRWbm9kZVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgd2FybihcbiAgICAgICAgICAgICAgICAnVGhlIGNsaWVudC1zaWRlIHJlbmRlcmVkIHZpcnR1YWwgRE9NIHRyZWUgaXMgbm90IG1hdGNoaW5nICcgK1xuICAgICAgICAgICAgICAgICdzZXJ2ZXItcmVuZGVyZWQgY29udGVudC4gVGhpcyBpcyBsaWtlbHkgY2F1c2VkIGJ5IGluY29ycmVjdCAnICtcbiAgICAgICAgICAgICAgICAnSFRNTCBtYXJrdXAsIGZvciBleGFtcGxlIG5lc3RpbmcgYmxvY2stbGV2ZWwgZWxlbWVudHMgaW5zaWRlICcgK1xuICAgICAgICAgICAgICAgICc8cD4sIG9yIG1pc3NpbmcgPHRib2R5Pi4gQmFpbGluZyBoeWRyYXRpb24gYW5kIHBlcmZvcm1pbmcgJyArXG4gICAgICAgICAgICAgICAgJ2Z1bGwgY2xpZW50LXNpZGUgcmVuZGVyLidcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gZWl0aGVyIG5vdCBzZXJ2ZXItcmVuZGVyZWQsIG9yIGh5ZHJhdGlvbiBmYWlsZWQuXG4gICAgICAgICAgLy8gY3JlYXRlIGFuIGVtcHR5IG5vZGUgYW5kIHJlcGxhY2UgaXRcbiAgICAgICAgICBvbGRWbm9kZSA9IGVtcHR5Tm9kZUF0KG9sZFZub2RlKTtcbiAgICAgICAgfVxuICAgICAgICAvLyByZXBsYWNpbmcgZXhpc3RpbmcgZWxlbWVudFxuICAgICAgICB2YXIgb2xkRWxtID0gb2xkVm5vZGUuZWxtO1xuICAgICAgICB2YXIgcGFyZW50RWxtJDEgPSBub2RlT3BzLnBhcmVudE5vZGUob2xkRWxtKTtcbiAgICAgICAgY3JlYXRlRWxtKFxuICAgICAgICAgIHZub2RlLFxuICAgICAgICAgIGluc2VydGVkVm5vZGVRdWV1ZSxcbiAgICAgICAgICAvLyBleHRyZW1lbHkgcmFyZSBlZGdlIGNhc2U6IGRvIG5vdCBpbnNlcnQgaWYgb2xkIGVsZW1lbnQgaXMgaW4gYVxuICAgICAgICAgIC8vIGxlYXZpbmcgdHJhbnNpdGlvbi4gT25seSBoYXBwZW5zIHdoZW4gY29tYmluaW5nIHRyYW5zaXRpb24gK1xuICAgICAgICAgIC8vIGtlZXAtYWxpdmUgKyBIT0NzLiAoIzQ1OTApXG4gICAgICAgICAgb2xkRWxtLl9sZWF2ZUNiID8gbnVsbCA6IHBhcmVudEVsbSQxLFxuICAgICAgICAgIG5vZGVPcHMubmV4dFNpYmxpbmcob2xkRWxtKVxuICAgICAgICApO1xuXG4gICAgICAgIGlmICh2bm9kZS5wYXJlbnQpIHtcbiAgICAgICAgICAvLyBjb21wb25lbnQgcm9vdCBlbGVtZW50IHJlcGxhY2VkLlxuICAgICAgICAgIC8vIHVwZGF0ZSBwYXJlbnQgcGxhY2Vob2xkZXIgbm9kZSBlbGVtZW50LCByZWN1cnNpdmVseVxuICAgICAgICAgIHZhciBhbmNlc3RvciA9IHZub2RlLnBhcmVudDtcbiAgICAgICAgICB3aGlsZSAoYW5jZXN0b3IpIHtcbiAgICAgICAgICAgIGFuY2VzdG9yLmVsbSA9IHZub2RlLmVsbTtcbiAgICAgICAgICAgIGFuY2VzdG9yID0gYW5jZXN0b3IucGFyZW50O1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaXNQYXRjaGFibGUodm5vZGUpKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNicy5jcmVhdGUubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgY2JzLmNyZWF0ZVtpXShlbXB0eU5vZGUsIHZub2RlLnBhcmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBhcmVudEVsbSQxICE9PSBudWxsKSB7XG4gICAgICAgICAgcmVtb3ZlVm5vZGVzKHBhcmVudEVsbSQxLCBbb2xkVm5vZGVdLCAwLCAwKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc0RlZihvbGRWbm9kZS50YWcpKSB7XG4gICAgICAgICAgaW52b2tlRGVzdHJveUhvb2sob2xkVm5vZGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaW52b2tlSW5zZXJ0SG9vayh2bm9kZSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlLCBpc0luaXRpYWxQYXRjaCk7XG4gICAgcmV0dXJuIHZub2RlLmVsbVxuICB9XG59XG5cbi8qICAqL1xuXG52YXIgZGlyZWN0aXZlcyA9IHtcbiAgY3JlYXRlOiB1cGRhdGVEaXJlY3RpdmVzLFxuICB1cGRhdGU6IHVwZGF0ZURpcmVjdGl2ZXMsXG4gIGRlc3Ryb3k6IGZ1bmN0aW9uIHVuYmluZERpcmVjdGl2ZXMgKHZub2RlKSB7XG4gICAgdXBkYXRlRGlyZWN0aXZlcyh2bm9kZSwgZW1wdHlOb2RlKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gdXBkYXRlRGlyZWN0aXZlcyAob2xkVm5vZGUsIHZub2RlKSB7XG4gIGlmIChvbGRWbm9kZS5kYXRhLmRpcmVjdGl2ZXMgfHwgdm5vZGUuZGF0YS5kaXJlY3RpdmVzKSB7XG4gICAgX3VwZGF0ZShvbGRWbm9kZSwgdm5vZGUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIF91cGRhdGUgKG9sZFZub2RlLCB2bm9kZSkge1xuICB2YXIgaXNDcmVhdGUgPSBvbGRWbm9kZSA9PT0gZW1wdHlOb2RlO1xuICB2YXIgaXNEZXN0cm95ID0gdm5vZGUgPT09IGVtcHR5Tm9kZTtcbiAgdmFyIG9sZERpcnMgPSBub3JtYWxpemVEaXJlY3RpdmVzJDEob2xkVm5vZGUuZGF0YS5kaXJlY3RpdmVzLCBvbGRWbm9kZS5jb250ZXh0KTtcbiAgdmFyIG5ld0RpcnMgPSBub3JtYWxpemVEaXJlY3RpdmVzJDEodm5vZGUuZGF0YS5kaXJlY3RpdmVzLCB2bm9kZS5jb250ZXh0KTtcblxuICB2YXIgZGlyc1dpdGhJbnNlcnQgPSBbXTtcbiAgdmFyIGRpcnNXaXRoUG9zdHBhdGNoID0gW107XG5cbiAgdmFyIGtleSwgb2xkRGlyLCBkaXI7XG4gIGZvciAoa2V5IGluIG5ld0RpcnMpIHtcbiAgICBvbGREaXIgPSBvbGREaXJzW2tleV07XG4gICAgZGlyID0gbmV3RGlyc1trZXldO1xuICAgIGlmICghb2xkRGlyKSB7XG4gICAgICAvLyBuZXcgZGlyZWN0aXZlLCBiaW5kXG4gICAgICBjYWxsSG9vayQxKGRpciwgJ2JpbmQnLCB2bm9kZSwgb2xkVm5vZGUpO1xuICAgICAgaWYgKGRpci5kZWYgJiYgZGlyLmRlZi5pbnNlcnRlZCkge1xuICAgICAgICBkaXJzV2l0aEluc2VydC5wdXNoKGRpcik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGV4aXN0aW5nIGRpcmVjdGl2ZSwgdXBkYXRlXG4gICAgICBkaXIub2xkVmFsdWUgPSBvbGREaXIudmFsdWU7XG4gICAgICBjYWxsSG9vayQxKGRpciwgJ3VwZGF0ZScsIHZub2RlLCBvbGRWbm9kZSk7XG4gICAgICBpZiAoZGlyLmRlZiAmJiBkaXIuZGVmLmNvbXBvbmVudFVwZGF0ZWQpIHtcbiAgICAgICAgZGlyc1dpdGhQb3N0cGF0Y2gucHVzaChkaXIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChkaXJzV2l0aEluc2VydC5sZW5ndGgpIHtcbiAgICB2YXIgY2FsbEluc2VydCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGlyc1dpdGhJbnNlcnQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY2FsbEhvb2skMShkaXJzV2l0aEluc2VydFtpXSwgJ2luc2VydGVkJywgdm5vZGUsIG9sZFZub2RlKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGlmIChpc0NyZWF0ZSkge1xuICAgICAgbWVyZ2VWTm9kZUhvb2sodm5vZGUuZGF0YS5ob29rIHx8ICh2bm9kZS5kYXRhLmhvb2sgPSB7fSksICdpbnNlcnQnLCBjYWxsSW5zZXJ0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2FsbEluc2VydCgpO1xuICAgIH1cbiAgfVxuXG4gIGlmIChkaXJzV2l0aFBvc3RwYXRjaC5sZW5ndGgpIHtcbiAgICBtZXJnZVZOb2RlSG9vayh2bm9kZS5kYXRhLmhvb2sgfHwgKHZub2RlLmRhdGEuaG9vayA9IHt9KSwgJ3Bvc3RwYXRjaCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGlyc1dpdGhQb3N0cGF0Y2gubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY2FsbEhvb2skMShkaXJzV2l0aFBvc3RwYXRjaFtpXSwgJ2NvbXBvbmVudFVwZGF0ZWQnLCB2bm9kZSwgb2xkVm5vZGUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgaWYgKCFpc0NyZWF0ZSkge1xuICAgIGZvciAoa2V5IGluIG9sZERpcnMpIHtcbiAgICAgIGlmICghbmV3RGlyc1trZXldKSB7XG4gICAgICAgIC8vIG5vIGxvbmdlciBwcmVzZW50LCB1bmJpbmRcbiAgICAgICAgY2FsbEhvb2skMShvbGREaXJzW2tleV0sICd1bmJpbmQnLCBvbGRWbm9kZSwgb2xkVm5vZGUsIGlzRGVzdHJveSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbnZhciBlbXB0eU1vZGlmaWVycyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZURpcmVjdGl2ZXMkMSAoXG4gIGRpcnMsXG4gIHZtXG4pIHtcbiAgdmFyIHJlcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIGlmICghZGlycykge1xuICAgIHJldHVybiByZXNcbiAgfVxuICB2YXIgaSwgZGlyO1xuICBmb3IgKGkgPSAwOyBpIDwgZGlycy5sZW5ndGg7IGkrKykge1xuICAgIGRpciA9IGRpcnNbaV07XG4gICAgaWYgKCFkaXIubW9kaWZpZXJzKSB7XG4gICAgICBkaXIubW9kaWZpZXJzID0gZW1wdHlNb2RpZmllcnM7XG4gICAgfVxuICAgIHJlc1tnZXRSYXdEaXJOYW1lKGRpcildID0gZGlyO1xuICAgIGRpci5kZWYgPSByZXNvbHZlQXNzZXQodm0uJG9wdGlvbnMsICdkaXJlY3RpdmVzJywgZGlyLm5hbWUsIHRydWUpO1xuICB9XG4gIHJldHVybiByZXNcbn1cblxuZnVuY3Rpb24gZ2V0UmF3RGlyTmFtZSAoZGlyKSB7XG4gIHJldHVybiBkaXIucmF3TmFtZSB8fCAoKGRpci5uYW1lKSArIFwiLlwiICsgKE9iamVjdC5rZXlzKGRpci5tb2RpZmllcnMgfHwge30pLmpvaW4oJy4nKSkpXG59XG5cbmZ1bmN0aW9uIGNhbGxIb29rJDEgKGRpciwgaG9vaywgdm5vZGUsIG9sZFZub2RlLCBpc0Rlc3Ryb3kpIHtcbiAgdmFyIGZuID0gZGlyLmRlZiAmJiBkaXIuZGVmW2hvb2tdO1xuICBpZiAoZm4pIHtcbiAgICBmbih2bm9kZS5lbG0sIGRpciwgdm5vZGUsIG9sZFZub2RlLCBpc0Rlc3Ryb3kpO1xuICB9XG59XG5cbnZhciBiYXNlTW9kdWxlcyA9IFtcbiAgcmVmLFxuICBkaXJlY3RpdmVzXG5dO1xuXG4vKiAgKi9cblxuZnVuY3Rpb24gdXBkYXRlQXR0cnMgKG9sZFZub2RlLCB2bm9kZSkge1xuICBpZiAoIW9sZFZub2RlLmRhdGEuYXR0cnMgJiYgIXZub2RlLmRhdGEuYXR0cnMpIHtcbiAgICByZXR1cm5cbiAgfVxuICB2YXIga2V5LCBjdXIsIG9sZDtcbiAgdmFyIGVsbSA9IHZub2RlLmVsbTtcbiAgdmFyIG9sZEF0dHJzID0gb2xkVm5vZGUuZGF0YS5hdHRycyB8fCB7fTtcbiAgdmFyIGF0dHJzID0gdm5vZGUuZGF0YS5hdHRycyB8fCB7fTtcbiAgLy8gY2xvbmUgb2JzZXJ2ZWQgb2JqZWN0cywgYXMgdGhlIHVzZXIgcHJvYmFibHkgd2FudHMgdG8gbXV0YXRlIGl0XG4gIGlmIChhdHRycy5fX29iX18pIHtcbiAgICBhdHRycyA9IHZub2RlLmRhdGEuYXR0cnMgPSBleHRlbmQoe30sIGF0dHJzKTtcbiAgfVxuXG4gIGZvciAoa2V5IGluIGF0dHJzKSB7XG4gICAgY3VyID0gYXR0cnNba2V5XTtcbiAgICBvbGQgPSBvbGRBdHRyc1trZXldO1xuICAgIGlmIChvbGQgIT09IGN1cikge1xuICAgICAgc2V0QXR0cihlbG0sIGtleSwgY3VyKTtcbiAgICB9XG4gIH1cbiAgLy8gIzQzOTE6IGluIElFOSwgc2V0dGluZyB0eXBlIGNhbiByZXNldCB2YWx1ZSBmb3IgaW5wdXRbdHlwZT1yYWRpb11cbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gIGlmIChpc0lFOSAmJiBhdHRycy52YWx1ZSAhPT0gb2xkQXR0cnMudmFsdWUpIHtcbiAgICBzZXRBdHRyKGVsbSwgJ3ZhbHVlJywgYXR0cnMudmFsdWUpO1xuICB9XG4gIGZvciAoa2V5IGluIG9sZEF0dHJzKSB7XG4gICAgaWYgKGF0dHJzW2tleV0gPT0gbnVsbCkge1xuICAgICAgaWYgKGlzWGxpbmsoa2V5KSkge1xuICAgICAgICBlbG0ucmVtb3ZlQXR0cmlidXRlTlMoeGxpbmtOUywgZ2V0WGxpbmtQcm9wKGtleSkpO1xuICAgICAgfSBlbHNlIGlmICghaXNFbnVtZXJhdGVkQXR0cihrZXkpKSB7XG4gICAgICAgIGVsbS5yZW1vdmVBdHRyaWJ1dGUoa2V5KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0QXR0ciAoZWwsIGtleSwgdmFsdWUpIHtcbiAgaWYgKGlzQm9vbGVhbkF0dHIoa2V5KSkge1xuICAgIC8vIHNldCBhdHRyaWJ1dGUgZm9yIGJsYW5rIHZhbHVlXG4gICAgLy8gZS5nLiA8b3B0aW9uIGRpc2FibGVkPlNlbGVjdCBvbmU8L29wdGlvbj5cbiAgICBpZiAoaXNGYWxzeUF0dHJWYWx1ZSh2YWx1ZSkpIHtcbiAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShrZXkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbC5zZXRBdHRyaWJ1dGUoa2V5LCBrZXkpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc0VudW1lcmF0ZWRBdHRyKGtleSkpIHtcbiAgICBlbC5zZXRBdHRyaWJ1dGUoa2V5LCBpc0ZhbHN5QXR0clZhbHVlKHZhbHVlKSB8fCB2YWx1ZSA9PT0gJ2ZhbHNlJyA/ICdmYWxzZScgOiAndHJ1ZScpO1xuICB9IGVsc2UgaWYgKGlzWGxpbmsoa2V5KSkge1xuICAgIGlmIChpc0ZhbHN5QXR0clZhbHVlKHZhbHVlKSkge1xuICAgICAgZWwucmVtb3ZlQXR0cmlidXRlTlMoeGxpbmtOUywgZ2V0WGxpbmtQcm9wKGtleSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbC5zZXRBdHRyaWJ1dGVOUyh4bGlua05TLCBrZXksIHZhbHVlKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGlzRmFsc3lBdHRyVmFsdWUodmFsdWUpKSB7XG4gICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoa2V5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWwuc2V0QXR0cmlidXRlKGtleSwgdmFsdWUpO1xuICAgIH1cbiAgfVxufVxuXG52YXIgYXR0cnMgPSB7XG4gIGNyZWF0ZTogdXBkYXRlQXR0cnMsXG4gIHVwZGF0ZTogdXBkYXRlQXR0cnNcbn07XG5cbi8qICAqL1xuXG5mdW5jdGlvbiB1cGRhdGVDbGFzcyAob2xkVm5vZGUsIHZub2RlKSB7XG4gIHZhciBlbCA9IHZub2RlLmVsbTtcbiAgdmFyIGRhdGEgPSB2bm9kZS5kYXRhO1xuICB2YXIgb2xkRGF0YSA9IG9sZFZub2RlLmRhdGE7XG4gIGlmICghZGF0YS5zdGF0aWNDbGFzcyAmJiAhZGF0YS5jbGFzcyAmJlxuICAgICAgKCFvbGREYXRhIHx8ICghb2xkRGF0YS5zdGF0aWNDbGFzcyAmJiAhb2xkRGF0YS5jbGFzcykpKSB7XG4gICAgcmV0dXJuXG4gIH1cblxuICB2YXIgY2xzID0gZ2VuQ2xhc3NGb3JWbm9kZSh2bm9kZSk7XG5cbiAgLy8gaGFuZGxlIHRyYW5zaXRpb24gY2xhc3Nlc1xuICB2YXIgdHJhbnNpdGlvbkNsYXNzID0gZWwuX3RyYW5zaXRpb25DbGFzc2VzO1xuICBpZiAodHJhbnNpdGlvbkNsYXNzKSB7XG4gICAgY2xzID0gY29uY2F0KGNscywgc3RyaW5naWZ5Q2xhc3ModHJhbnNpdGlvbkNsYXNzKSk7XG4gIH1cblxuICAvLyBzZXQgdGhlIGNsYXNzXG4gIGlmIChjbHMgIT09IGVsLl9wcmV2Q2xhc3MpIHtcbiAgICBlbC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgY2xzKTtcbiAgICBlbC5fcHJldkNsYXNzID0gY2xzO1xuICB9XG59XG5cbnZhciBrbGFzcyA9IHtcbiAgY3JlYXRlOiB1cGRhdGVDbGFzcyxcbiAgdXBkYXRlOiB1cGRhdGVDbGFzc1xufTtcblxuLyogICovXG5cbnZhciB2YWxpZERpdmlzaW9uQ2hhclJFID0gL1tcXHcpLitcXC1fJFxcXV0vO1xuXG5mdW5jdGlvbiBwYXJzZUZpbHRlcnMgKGV4cCkge1xuICB2YXIgaW5TaW5nbGUgPSBmYWxzZTtcbiAgdmFyIGluRG91YmxlID0gZmFsc2U7XG4gIHZhciBpblRlbXBsYXRlU3RyaW5nID0gZmFsc2U7XG4gIHZhciBpblJlZ2V4ID0gZmFsc2U7XG4gIHZhciBjdXJseSA9IDA7XG4gIHZhciBzcXVhcmUgPSAwO1xuICB2YXIgcGFyZW4gPSAwO1xuICB2YXIgbGFzdEZpbHRlckluZGV4ID0gMDtcbiAgdmFyIGMsIHByZXYsIGksIGV4cHJlc3Npb24sIGZpbHRlcnM7XG5cbiAgZm9yIChpID0gMDsgaSA8IGV4cC5sZW5ndGg7IGkrKykge1xuICAgIHByZXYgPSBjO1xuICAgIGMgPSBleHAuY2hhckNvZGVBdChpKTtcbiAgICBpZiAoaW5TaW5nbGUpIHtcbiAgICAgIGlmIChjID09PSAweDI3ICYmIHByZXYgIT09IDB4NUMpIHsgaW5TaW5nbGUgPSBmYWxzZTsgfVxuICAgIH0gZWxzZSBpZiAoaW5Eb3VibGUpIHtcbiAgICAgIGlmIChjID09PSAweDIyICYmIHByZXYgIT09IDB4NUMpIHsgaW5Eb3VibGUgPSBmYWxzZTsgfVxuICAgIH0gZWxzZSBpZiAoaW5UZW1wbGF0ZVN0cmluZykge1xuICAgICAgaWYgKGMgPT09IDB4NjAgJiYgcHJldiAhPT0gMHg1QykgeyBpblRlbXBsYXRlU3RyaW5nID0gZmFsc2U7IH1cbiAgICB9IGVsc2UgaWYgKGluUmVnZXgpIHtcbiAgICAgIGlmIChjID09PSAweDJmICYmIHByZXYgIT09IDB4NUMpIHsgaW5SZWdleCA9IGZhbHNlOyB9XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGMgPT09IDB4N0MgJiYgLy8gcGlwZVxuICAgICAgZXhwLmNoYXJDb2RlQXQoaSArIDEpICE9PSAweDdDICYmXG4gICAgICBleHAuY2hhckNvZGVBdChpIC0gMSkgIT09IDB4N0MgJiZcbiAgICAgICFjdXJseSAmJiAhc3F1YXJlICYmICFwYXJlblxuICAgICkge1xuICAgICAgaWYgKGV4cHJlc3Npb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAvLyBmaXJzdCBmaWx0ZXIsIGVuZCBvZiBleHByZXNzaW9uXG4gICAgICAgIGxhc3RGaWx0ZXJJbmRleCA9IGkgKyAxO1xuICAgICAgICBleHByZXNzaW9uID0gZXhwLnNsaWNlKDAsIGkpLnRyaW0oKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHB1c2hGaWx0ZXIoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3dpdGNoIChjKSB7XG4gICAgICAgIGNhc2UgMHgyMjogaW5Eb3VibGUgPSB0cnVlOyBicmVhayAgICAgICAgIC8vIFwiXG4gICAgICAgIGNhc2UgMHgyNzogaW5TaW5nbGUgPSB0cnVlOyBicmVhayAgICAgICAgIC8vICdcbiAgICAgICAgY2FzZSAweDYwOiBpblRlbXBsYXRlU3RyaW5nID0gdHJ1ZTsgYnJlYWsgLy8gYFxuICAgICAgICBjYXNlIDB4Mjg6IHBhcmVuKys7IGJyZWFrICAgICAgICAgICAgICAgICAvLyAoXG4gICAgICAgIGNhc2UgMHgyOTogcGFyZW4tLTsgYnJlYWsgICAgICAgICAgICAgICAgIC8vIClcbiAgICAgICAgY2FzZSAweDVCOiBzcXVhcmUrKzsgYnJlYWsgICAgICAgICAgICAgICAgLy8gW1xuICAgICAgICBjYXNlIDB4NUQ6IHNxdWFyZS0tOyBicmVhayAgICAgICAgICAgICAgICAvLyBdXG4gICAgICAgIGNhc2UgMHg3QjogY3VybHkrKzsgYnJlYWsgICAgICAgICAgICAgICAgIC8vIHtcbiAgICAgICAgY2FzZSAweDdEOiBjdXJseS0tOyBicmVhayAgICAgICAgICAgICAgICAgLy8gfVxuICAgICAgfVxuICAgICAgaWYgKGMgPT09IDB4MmYpIHsgLy8gL1xuICAgICAgICB2YXIgaiA9IGkgLSAxO1xuICAgICAgICB2YXIgcCA9ICh2b2lkIDApO1xuICAgICAgICAvLyBmaW5kIGZpcnN0IG5vbi13aGl0ZXNwYWNlIHByZXYgY2hhclxuICAgICAgICBmb3IgKDsgaiA+PSAwOyBqLS0pIHtcbiAgICAgICAgICBwID0gZXhwLmNoYXJBdChqKTtcbiAgICAgICAgICBpZiAocCAhPT0gJyAnKSB7IGJyZWFrIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoIXAgfHwgIXZhbGlkRGl2aXNpb25DaGFyUkUudGVzdChwKSkge1xuICAgICAgICAgIGluUmVnZXggPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaWYgKGV4cHJlc3Npb24gPT09IHVuZGVmaW5lZCkge1xuICAgIGV4cHJlc3Npb24gPSBleHAuc2xpY2UoMCwgaSkudHJpbSgpO1xuICB9IGVsc2UgaWYgKGxhc3RGaWx0ZXJJbmRleCAhPT0gMCkge1xuICAgIHB1c2hGaWx0ZXIoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHB1c2hGaWx0ZXIgKCkge1xuICAgIChmaWx0ZXJzIHx8IChmaWx0ZXJzID0gW10pKS5wdXNoKGV4cC5zbGljZShsYXN0RmlsdGVySW5kZXgsIGkpLnRyaW0oKSk7XG4gICAgbGFzdEZpbHRlckluZGV4ID0gaSArIDE7XG4gIH1cblxuICBpZiAoZmlsdGVycykge1xuICAgIGZvciAoaSA9IDA7IGkgPCBmaWx0ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBleHByZXNzaW9uID0gd3JhcEZpbHRlcihleHByZXNzaW9uLCBmaWx0ZXJzW2ldKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZXhwcmVzc2lvblxufVxuXG5mdW5jdGlvbiB3cmFwRmlsdGVyIChleHAsIGZpbHRlcikge1xuICB2YXIgaSA9IGZpbHRlci5pbmRleE9mKCcoJyk7XG4gIGlmIChpIDwgMCkge1xuICAgIC8vIF9mOiByZXNvbHZlRmlsdGVyXG4gICAgcmV0dXJuIChcIl9mKFxcXCJcIiArIGZpbHRlciArIFwiXFxcIikoXCIgKyBleHAgKyBcIilcIilcbiAgfSBlbHNlIHtcbiAgICB2YXIgbmFtZSA9IGZpbHRlci5zbGljZSgwLCBpKTtcbiAgICB2YXIgYXJncyA9IGZpbHRlci5zbGljZShpICsgMSk7XG4gICAgcmV0dXJuIChcIl9mKFxcXCJcIiArIG5hbWUgKyBcIlxcXCIpKFwiICsgZXhwICsgXCIsXCIgKyBhcmdzKVxuICB9XG59XG5cbi8qICAqL1xuXG5mdW5jdGlvbiBiYXNlV2FybiAobXNnKSB7XG4gIGNvbnNvbGUuZXJyb3IoKFwiW1Z1ZSBjb21waWxlcl06IFwiICsgbXNnKSk7XG59XG5cbmZ1bmN0aW9uIHBsdWNrTW9kdWxlRnVuY3Rpb24gKFxuICBtb2R1bGVzLFxuICBrZXlcbikge1xuICByZXR1cm4gbW9kdWxlc1xuICAgID8gbW9kdWxlcy5tYXAoZnVuY3Rpb24gKG0pIHsgcmV0dXJuIG1ba2V5XTsgfSkuZmlsdGVyKGZ1bmN0aW9uIChfKSB7IHJldHVybiBfOyB9KVxuICAgIDogW11cbn1cblxuZnVuY3Rpb24gYWRkUHJvcCAoZWwsIG5hbWUsIHZhbHVlKSB7XG4gIChlbC5wcm9wcyB8fCAoZWwucHJvcHMgPSBbXSkpLnB1c2goeyBuYW1lOiBuYW1lLCB2YWx1ZTogdmFsdWUgfSk7XG59XG5cbmZ1bmN0aW9uIGFkZEF0dHIgKGVsLCBuYW1lLCB2YWx1ZSkge1xuICAoZWwuYXR0cnMgfHwgKGVsLmF0dHJzID0gW10pKS5wdXNoKHsgbmFtZTogbmFtZSwgdmFsdWU6IHZhbHVlIH0pO1xufVxuXG5mdW5jdGlvbiBhZGREaXJlY3RpdmUgKFxuICBlbCxcbiAgbmFtZSxcbiAgcmF3TmFtZSxcbiAgdmFsdWUsXG4gIGFyZyxcbiAgbW9kaWZpZXJzXG4pIHtcbiAgKGVsLmRpcmVjdGl2ZXMgfHwgKGVsLmRpcmVjdGl2ZXMgPSBbXSkpLnB1c2goeyBuYW1lOiBuYW1lLCByYXdOYW1lOiByYXdOYW1lLCB2YWx1ZTogdmFsdWUsIGFyZzogYXJnLCBtb2RpZmllcnM6IG1vZGlmaWVycyB9KTtcbn1cblxuZnVuY3Rpb24gYWRkSGFuZGxlciAoXG4gIGVsLFxuICBuYW1lLFxuICB2YWx1ZSxcbiAgbW9kaWZpZXJzLFxuICBpbXBvcnRhbnRcbikge1xuICAvLyBjaGVjayBjYXB0dXJlIG1vZGlmaWVyXG4gIGlmIChtb2RpZmllcnMgJiYgbW9kaWZpZXJzLmNhcHR1cmUpIHtcbiAgICBkZWxldGUgbW9kaWZpZXJzLmNhcHR1cmU7XG4gICAgbmFtZSA9ICchJyArIG5hbWU7IC8vIG1hcmsgdGhlIGV2ZW50IGFzIGNhcHR1cmVkXG4gIH1cbiAgaWYgKG1vZGlmaWVycyAmJiBtb2RpZmllcnMub25jZSkge1xuICAgIGRlbGV0ZSBtb2RpZmllcnMub25jZTtcbiAgICBuYW1lID0gJ34nICsgbmFtZTsgLy8gbWFyayB0aGUgZXZlbnQgYXMgb25jZVxuICB9XG4gIHZhciBldmVudHM7XG4gIGlmIChtb2RpZmllcnMgJiYgbW9kaWZpZXJzLm5hdGl2ZSkge1xuICAgIGRlbGV0ZSBtb2RpZmllcnMubmF0aXZlO1xuICAgIGV2ZW50cyA9IGVsLm5hdGl2ZUV2ZW50cyB8fCAoZWwubmF0aXZlRXZlbnRzID0ge30pO1xuICB9IGVsc2Uge1xuICAgIGV2ZW50cyA9IGVsLmV2ZW50cyB8fCAoZWwuZXZlbnRzID0ge30pO1xuICB9XG4gIHZhciBuZXdIYW5kbGVyID0geyB2YWx1ZTogdmFsdWUsIG1vZGlmaWVyczogbW9kaWZpZXJzIH07XG4gIHZhciBoYW5kbGVycyA9IGV2ZW50c1tuYW1lXTtcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gIGlmIChBcnJheS5pc0FycmF5KGhhbmRsZXJzKSkge1xuICAgIGltcG9ydGFudCA/IGhhbmRsZXJzLnVuc2hpZnQobmV3SGFuZGxlcikgOiBoYW5kbGVycy5wdXNoKG5ld0hhbmRsZXIpO1xuICB9IGVsc2UgaWYgKGhhbmRsZXJzKSB7XG4gICAgZXZlbnRzW25hbWVdID0gaW1wb3J0YW50ID8gW25ld0hhbmRsZXIsIGhhbmRsZXJzXSA6IFtoYW5kbGVycywgbmV3SGFuZGxlcl07XG4gIH0gZWxzZSB7XG4gICAgZXZlbnRzW25hbWVdID0gbmV3SGFuZGxlcjtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRCaW5kaW5nQXR0ciAoXG4gIGVsLFxuICBuYW1lLFxuICBnZXRTdGF0aWNcbikge1xuICB2YXIgZHluYW1pY1ZhbHVlID1cbiAgICBnZXRBbmRSZW1vdmVBdHRyKGVsLCAnOicgKyBuYW1lKSB8fFxuICAgIGdldEFuZFJlbW92ZUF0dHIoZWwsICd2LWJpbmQ6JyArIG5hbWUpO1xuICBpZiAoZHluYW1pY1ZhbHVlICE9IG51bGwpIHtcbiAgICByZXR1cm4gcGFyc2VGaWx0ZXJzKGR5bmFtaWNWYWx1ZSlcbiAgfSBlbHNlIGlmIChnZXRTdGF0aWMgIT09IGZhbHNlKSB7XG4gICAgdmFyIHN0YXRpY1ZhbHVlID0gZ2V0QW5kUmVtb3ZlQXR0cihlbCwgbmFtZSk7XG4gICAgaWYgKHN0YXRpY1ZhbHVlICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShzdGF0aWNWYWx1ZSlcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0QW5kUmVtb3ZlQXR0ciAoZWwsIG5hbWUpIHtcbiAgdmFyIHZhbDtcbiAgaWYgKCh2YWwgPSBlbC5hdHRyc01hcFtuYW1lXSkgIT0gbnVsbCkge1xuICAgIHZhciBsaXN0ID0gZWwuYXR0cnNMaXN0O1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gbGlzdC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGlmIChsaXN0W2ldLm5hbWUgPT09IG5hbWUpIHtcbiAgICAgICAgbGlzdC5zcGxpY2UoaSwgMSk7XG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiB2YWxcbn1cblxuLyogICovXG5cbi8qKlxuICogQ3Jvc3MtcGxhdGZvcm0gY29kZSBnZW5lcmF0aW9uIGZvciBjb21wb25lbnQgdi1tb2RlbFxuICovXG5mdW5jdGlvbiBnZW5Db21wb25lbnRNb2RlbCAoXG4gIGVsLFxuICB2YWx1ZSxcbiAgbW9kaWZpZXJzXG4pIHtcbiAgdmFyIHJlZiA9IG1vZGlmaWVycyB8fCB7fTtcbiAgdmFyIG51bWJlciA9IHJlZi5udW1iZXI7XG4gIHZhciB0cmltID0gcmVmLnRyaW07XG5cbiAgdmFyIGJhc2VWYWx1ZUV4cHJlc3Npb24gPSAnJCR2JztcbiAgdmFyIHZhbHVlRXhwcmVzc2lvbiA9IGJhc2VWYWx1ZUV4cHJlc3Npb247XG4gIGlmICh0cmltKSB7XG4gICAgdmFsdWVFeHByZXNzaW9uID1cbiAgICAgIFwiKHR5cGVvZiBcIiArIGJhc2VWYWx1ZUV4cHJlc3Npb24gKyBcIiA9PT0gJ3N0cmluZydcIiArXG4gICAgICAgIFwiPyBcIiArIGJhc2VWYWx1ZUV4cHJlc3Npb24gKyBcIi50cmltKClcIiArXG4gICAgICAgIFwiOiBcIiArIGJhc2VWYWx1ZUV4cHJlc3Npb24gKyBcIilcIjtcbiAgfVxuICBpZiAobnVtYmVyKSB7XG4gICAgdmFsdWVFeHByZXNzaW9uID0gXCJfbihcIiArIHZhbHVlRXhwcmVzc2lvbiArIFwiKVwiO1xuICB9XG4gIHZhciBhc3NpZ25tZW50ID0gZ2VuQXNzaWdubWVudENvZGUodmFsdWUsIHZhbHVlRXhwcmVzc2lvbik7XG5cbiAgZWwubW9kZWwgPSB7XG4gICAgdmFsdWU6IChcIihcIiArIHZhbHVlICsgXCIpXCIpLFxuICAgIGV4cHJlc3Npb246IChcIlxcXCJcIiArIHZhbHVlICsgXCJcXFwiXCIpLFxuICAgIGNhbGxiYWNrOiAoXCJmdW5jdGlvbiAoXCIgKyBiYXNlVmFsdWVFeHByZXNzaW9uICsgXCIpIHtcIiArIGFzc2lnbm1lbnQgKyBcIn1cIilcbiAgfTtcbn1cblxuLyoqXG4gKiBDcm9zcy1wbGF0Zm9ybSBjb2RlZ2VuIGhlbHBlciBmb3IgZ2VuZXJhdGluZyB2LW1vZGVsIHZhbHVlIGFzc2lnbm1lbnQgY29kZS5cbiAqL1xuZnVuY3Rpb24gZ2VuQXNzaWdubWVudENvZGUgKFxuICB2YWx1ZSxcbiAgYXNzaWdubWVudFxuKSB7XG4gIHZhciBtb2RlbFJzID0gcGFyc2VNb2RlbCh2YWx1ZSk7XG4gIGlmIChtb2RlbFJzLmlkeCA9PT0gbnVsbCkge1xuICAgIHJldHVybiAodmFsdWUgKyBcIj1cIiArIGFzc2lnbm1lbnQpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIFwidmFyICQkZXhwID0gXCIgKyAobW9kZWxScy5leHApICsgXCIsICQkaWR4ID0gXCIgKyAobW9kZWxScy5pZHgpICsgXCI7XCIgK1xuICAgICAgXCJpZiAoIUFycmF5LmlzQXJyYXkoJCRleHApKXtcIiArXG4gICAgICAgIHZhbHVlICsgXCI9XCIgKyBhc3NpZ25tZW50ICsgXCJ9XCIgK1xuICAgICAgXCJlbHNleyQkZXhwLnNwbGljZSgkJGlkeCwgMSwgXCIgKyBhc3NpZ25tZW50ICsgXCIpfVwiXG4gIH1cbn1cblxuLyoqXG4gKiBwYXJzZSBkaXJlY3RpdmUgbW9kZWwgdG8gZG8gdGhlIGFycmF5IHVwZGF0ZSB0cmFuc2Zvcm0uIGFbaWR4XSA9IHZhbCA9PiAkJGEuc3BsaWNlKCQkaWR4LCAxLCB2YWwpXG4gKlxuICogZm9yIGxvb3AgcG9zc2libGUgY2FzZXM6XG4gKlxuICogLSB0ZXN0XG4gKiAtIHRlc3RbaWR4XVxuICogLSB0ZXN0W3Rlc3QxW2lkeF1dXG4gKiAtIHRlc3RbXCJhXCJdW2lkeF1cbiAqIC0geHh4LnRlc3RbYVthXS50ZXN0MVtpZHhdXVxuICogLSB0ZXN0Lnh4eC5hW1wiYXNhXCJdW3Rlc3QxW2lkeF1dXG4gKlxuICovXG5cbnZhciBsZW47XG52YXIgc3RyO1xudmFyIGNocjtcbnZhciBpbmRleCQxO1xudmFyIGV4cHJlc3Npb25Qb3M7XG52YXIgZXhwcmVzc2lvbkVuZFBvcztcblxuZnVuY3Rpb24gcGFyc2VNb2RlbCAodmFsKSB7XG4gIHN0ciA9IHZhbDtcbiAgbGVuID0gc3RyLmxlbmd0aDtcbiAgaW5kZXgkMSA9IGV4cHJlc3Npb25Qb3MgPSBleHByZXNzaW9uRW5kUG9zID0gMDtcblxuICBpZiAodmFsLmluZGV4T2YoJ1snKSA8IDAgfHwgdmFsLmxhc3RJbmRleE9mKCddJykgPCBsZW4gLSAxKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGV4cDogdmFsLFxuICAgICAgaWR4OiBudWxsXG4gICAgfVxuICB9XG5cbiAgd2hpbGUgKCFlb2YoKSkge1xuICAgIGNociA9IG5leHQoKTtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICBpZiAoaXNTdHJpbmdTdGFydChjaHIpKSB7XG4gICAgICBwYXJzZVN0cmluZyhjaHIpO1xuICAgIH0gZWxzZSBpZiAoY2hyID09PSAweDVCKSB7XG4gICAgICBwYXJzZUJyYWNrZXQoY2hyKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGV4cDogdmFsLnN1YnN0cmluZygwLCBleHByZXNzaW9uUG9zKSxcbiAgICBpZHg6IHZhbC5zdWJzdHJpbmcoZXhwcmVzc2lvblBvcyArIDEsIGV4cHJlc3Npb25FbmRQb3MpXG4gIH1cbn1cblxuZnVuY3Rpb24gbmV4dCAoKSB7XG4gIHJldHVybiBzdHIuY2hhckNvZGVBdCgrK2luZGV4JDEpXG59XG5cbmZ1bmN0aW9uIGVvZiAoKSB7XG4gIHJldHVybiBpbmRleCQxID49IGxlblxufVxuXG5mdW5jdGlvbiBpc1N0cmluZ1N0YXJ0IChjaHIpIHtcbiAgcmV0dXJuIGNociA9PT0gMHgyMiB8fCBjaHIgPT09IDB4Mjdcbn1cblxuZnVuY3Rpb24gcGFyc2VCcmFja2V0IChjaHIpIHtcbiAgdmFyIGluQnJhY2tldCA9IDE7XG4gIGV4cHJlc3Npb25Qb3MgPSBpbmRleCQxO1xuICB3aGlsZSAoIWVvZigpKSB7XG4gICAgY2hyID0gbmV4dCgpO1xuICAgIGlmIChpc1N0cmluZ1N0YXJ0KGNocikpIHtcbiAgICAgIHBhcnNlU3RyaW5nKGNocik7XG4gICAgICBjb250aW51ZVxuICAgIH1cbiAgICBpZiAoY2hyID09PSAweDVCKSB7IGluQnJhY2tldCsrOyB9XG4gICAgaWYgKGNociA9PT0gMHg1RCkgeyBpbkJyYWNrZXQtLTsgfVxuICAgIGlmIChpbkJyYWNrZXQgPT09IDApIHtcbiAgICAgIGV4cHJlc3Npb25FbmRQb3MgPSBpbmRleCQxO1xuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gcGFyc2VTdHJpbmcgKGNocikge1xuICB2YXIgc3RyaW5nUXVvdGUgPSBjaHI7XG4gIHdoaWxlICghZW9mKCkpIHtcbiAgICBjaHIgPSBuZXh0KCk7XG4gICAgaWYgKGNociA9PT0gc3RyaW5nUXVvdGUpIHtcbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG59XG5cbi8qICAqL1xuXG52YXIgd2FybiQxO1xuXG4vLyBpbiBzb21lIGNhc2VzLCB0aGUgZXZlbnQgdXNlZCBoYXMgdG8gYmUgZGV0ZXJtaW5lZCBhdCBydW50aW1lXG4vLyBzbyB3ZSB1c2VkIHNvbWUgcmVzZXJ2ZWQgdG9rZW5zIGR1cmluZyBjb21waWxlLlxudmFyIFJBTkdFX1RPS0VOID0gJ19fcic7XG52YXIgQ0hFQ0tCT1hfUkFESU9fVE9LRU4gPSAnX19jJztcblxuZnVuY3Rpb24gbW9kZWwgKFxuICBlbCxcbiAgZGlyLFxuICBfd2FyblxuKSB7XG4gIHdhcm4kMSA9IF93YXJuO1xuICB2YXIgdmFsdWUgPSBkaXIudmFsdWU7XG4gIHZhciBtb2RpZmllcnMgPSBkaXIubW9kaWZpZXJzO1xuICB2YXIgdGFnID0gZWwudGFnO1xuICB2YXIgdHlwZSA9IGVsLmF0dHJzTWFwLnR5cGU7XG5cbiAge1xuICAgIHZhciBkeW5hbWljVHlwZSA9IGVsLmF0dHJzTWFwWyd2LWJpbmQ6dHlwZSddIHx8IGVsLmF0dHJzTWFwWyc6dHlwZSddO1xuICAgIGlmICh0YWcgPT09ICdpbnB1dCcgJiYgZHluYW1pY1R5cGUpIHtcbiAgICAgIHdhcm4kMShcbiAgICAgICAgXCI8aW5wdXQgOnR5cGU9XFxcIlwiICsgZHluYW1pY1R5cGUgKyBcIlxcXCIgdi1tb2RlbD1cXFwiXCIgKyB2YWx1ZSArIFwiXFxcIj46XFxuXCIgK1xuICAgICAgICBcInYtbW9kZWwgZG9lcyBub3Qgc3VwcG9ydCBkeW5hbWljIGlucHV0IHR5cGVzLiBVc2Ugdi1pZiBicmFuY2hlcyBpbnN0ZWFkLlwiXG4gICAgICApO1xuICAgIH1cbiAgICAvLyBpbnB1dHMgd2l0aCB0eXBlPVwiZmlsZVwiIGFyZSByZWFkIG9ubHkgYW5kIHNldHRpbmcgdGhlIGlucHV0J3NcbiAgICAvLyB2YWx1ZSB3aWxsIHRocm93IGFuIGVycm9yLlxuICAgIGlmICh0YWcgPT09ICdpbnB1dCcgJiYgdHlwZSA9PT0gJ2ZpbGUnKSB7XG4gICAgICB3YXJuJDEoXG4gICAgICAgIFwiPFwiICsgKGVsLnRhZykgKyBcIiB2LW1vZGVsPVxcXCJcIiArIHZhbHVlICsgXCJcXFwiIHR5cGU9XFxcImZpbGVcXFwiPjpcXG5cIiArXG4gICAgICAgIFwiRmlsZSBpbnB1dHMgYXJlIHJlYWQgb25seS4gVXNlIGEgdi1vbjpjaGFuZ2UgbGlzdGVuZXIgaW5zdGVhZC5cIlxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBpZiAodGFnID09PSAnc2VsZWN0Jykge1xuICAgIGdlblNlbGVjdChlbCwgdmFsdWUsIG1vZGlmaWVycyk7XG4gIH0gZWxzZSBpZiAodGFnID09PSAnaW5wdXQnICYmIHR5cGUgPT09ICdjaGVja2JveCcpIHtcbiAgICBnZW5DaGVja2JveE1vZGVsKGVsLCB2YWx1ZSwgbW9kaWZpZXJzKTtcbiAgfSBlbHNlIGlmICh0YWcgPT09ICdpbnB1dCcgJiYgdHlwZSA9PT0gJ3JhZGlvJykge1xuICAgIGdlblJhZGlvTW9kZWwoZWwsIHZhbHVlLCBtb2RpZmllcnMpO1xuICB9IGVsc2UgaWYgKHRhZyA9PT0gJ2lucHV0JyB8fCB0YWcgPT09ICd0ZXh0YXJlYScpIHtcbiAgICBnZW5EZWZhdWx0TW9kZWwoZWwsIHZhbHVlLCBtb2RpZmllcnMpO1xuICB9IGVsc2UgaWYgKCFjb25maWcuaXNSZXNlcnZlZFRhZyh0YWcpKSB7XG4gICAgZ2VuQ29tcG9uZW50TW9kZWwoZWwsIHZhbHVlLCBtb2RpZmllcnMpO1xuICAgIC8vIGNvbXBvbmVudCB2LW1vZGVsIGRvZXNuJ3QgbmVlZCBleHRyYSBydW50aW1lXG4gICAgcmV0dXJuIGZhbHNlXG4gIH0gZWxzZSB7XG4gICAgd2FybiQxKFxuICAgICAgXCI8XCIgKyAoZWwudGFnKSArIFwiIHYtbW9kZWw9XFxcIlwiICsgdmFsdWUgKyBcIlxcXCI+OiBcIiArXG4gICAgICBcInYtbW9kZWwgaXMgbm90IHN1cHBvcnRlZCBvbiB0aGlzIGVsZW1lbnQgdHlwZS4gXCIgK1xuICAgICAgJ0lmIHlvdSBhcmUgd29ya2luZyB3aXRoIGNvbnRlbnRlZGl0YWJsZSwgaXRcXCdzIHJlY29tbWVuZGVkIHRvICcgK1xuICAgICAgJ3dyYXAgYSBsaWJyYXJ5IGRlZGljYXRlZCBmb3IgdGhhdCBwdXJwb3NlIGluc2lkZSBhIGN1c3RvbSBjb21wb25lbnQuJ1xuICAgICk7XG4gIH1cblxuICAvLyBlbnN1cmUgcnVudGltZSBkaXJlY3RpdmUgbWV0YWRhdGFcbiAgcmV0dXJuIHRydWVcbn1cblxuZnVuY3Rpb24gZ2VuQ2hlY2tib3hNb2RlbCAoXG4gIGVsLFxuICB2YWx1ZSxcbiAgbW9kaWZpZXJzXG4pIHtcbiAgdmFyIG51bWJlciA9IG1vZGlmaWVycyAmJiBtb2RpZmllcnMubnVtYmVyO1xuICB2YXIgdmFsdWVCaW5kaW5nID0gZ2V0QmluZGluZ0F0dHIoZWwsICd2YWx1ZScpIHx8ICdudWxsJztcbiAgdmFyIHRydWVWYWx1ZUJpbmRpbmcgPSBnZXRCaW5kaW5nQXR0cihlbCwgJ3RydWUtdmFsdWUnKSB8fCAndHJ1ZSc7XG4gIHZhciBmYWxzZVZhbHVlQmluZGluZyA9IGdldEJpbmRpbmdBdHRyKGVsLCAnZmFsc2UtdmFsdWUnKSB8fCAnZmFsc2UnO1xuICBhZGRQcm9wKGVsLCAnY2hlY2tlZCcsXG4gICAgXCJBcnJheS5pc0FycmF5KFwiICsgdmFsdWUgKyBcIilcIiArXG4gICAgICBcIj9faShcIiArIHZhbHVlICsgXCIsXCIgKyB2YWx1ZUJpbmRpbmcgKyBcIik+LTFcIiArIChcbiAgICAgICAgdHJ1ZVZhbHVlQmluZGluZyA9PT0gJ3RydWUnXG4gICAgICAgICAgPyAoXCI6KFwiICsgdmFsdWUgKyBcIilcIilcbiAgICAgICAgICA6IChcIjpfcShcIiArIHZhbHVlICsgXCIsXCIgKyB0cnVlVmFsdWVCaW5kaW5nICsgXCIpXCIpXG4gICAgICApXG4gICk7XG4gIGFkZEhhbmRsZXIoZWwsIENIRUNLQk9YX1JBRElPX1RPS0VOLFxuICAgIFwidmFyICQkYT1cIiArIHZhbHVlICsgXCIsXCIgK1xuICAgICAgICAnJCRlbD0kZXZlbnQudGFyZ2V0LCcgK1xuICAgICAgICBcIiQkYz0kJGVsLmNoZWNrZWQ/KFwiICsgdHJ1ZVZhbHVlQmluZGluZyArIFwiKTooXCIgKyBmYWxzZVZhbHVlQmluZGluZyArIFwiKTtcIiArXG4gICAgJ2lmKEFycmF5LmlzQXJyYXkoJCRhKSl7JyArXG4gICAgICBcInZhciAkJHY9XCIgKyAobnVtYmVyID8gJ19uKCcgKyB2YWx1ZUJpbmRpbmcgKyAnKScgOiB2YWx1ZUJpbmRpbmcpICsgXCIsXCIgK1xuICAgICAgICAgICckJGk9X2koJCRhLCQkdik7JyArXG4gICAgICBcImlmKCQkYyl7JCRpPDAmJihcIiArIHZhbHVlICsgXCI9JCRhLmNvbmNhdCgkJHYpKX1cIiArXG4gICAgICBcImVsc2V7JCRpPi0xJiYoXCIgKyB2YWx1ZSArIFwiPSQkYS5zbGljZSgwLCQkaSkuY29uY2F0KCQkYS5zbGljZSgkJGkrMSkpKX1cIiArXG4gICAgXCJ9ZWxzZXtcIiArIHZhbHVlICsgXCI9JCRjfVwiLFxuICAgIG51bGwsIHRydWVcbiAgKTtcbn1cblxuZnVuY3Rpb24gZ2VuUmFkaW9Nb2RlbCAoXG4gICAgZWwsXG4gICAgdmFsdWUsXG4gICAgbW9kaWZpZXJzXG4pIHtcbiAgdmFyIG51bWJlciA9IG1vZGlmaWVycyAmJiBtb2RpZmllcnMubnVtYmVyO1xuICB2YXIgdmFsdWVCaW5kaW5nID0gZ2V0QmluZGluZ0F0dHIoZWwsICd2YWx1ZScpIHx8ICdudWxsJztcbiAgdmFsdWVCaW5kaW5nID0gbnVtYmVyID8gKFwiX24oXCIgKyB2YWx1ZUJpbmRpbmcgKyBcIilcIikgOiB2YWx1ZUJpbmRpbmc7XG4gIGFkZFByb3AoZWwsICdjaGVja2VkJywgKFwiX3EoXCIgKyB2YWx1ZSArIFwiLFwiICsgdmFsdWVCaW5kaW5nICsgXCIpXCIpKTtcbiAgYWRkSGFuZGxlcihlbCwgQ0hFQ0tCT1hfUkFESU9fVE9LRU4sIGdlbkFzc2lnbm1lbnRDb2RlKHZhbHVlLCB2YWx1ZUJpbmRpbmcpLCBudWxsLCB0cnVlKTtcbn1cblxuZnVuY3Rpb24gZ2VuU2VsZWN0IChcbiAgICBlbCxcbiAgICB2YWx1ZSxcbiAgICBtb2RpZmllcnNcbikge1xuICB2YXIgbnVtYmVyID0gbW9kaWZpZXJzICYmIG1vZGlmaWVycy5udW1iZXI7XG4gIHZhciBzZWxlY3RlZFZhbCA9IFwiQXJyYXkucHJvdG90eXBlLmZpbHRlclwiICtcbiAgICBcIi5jYWxsKCRldmVudC50YXJnZXQub3B0aW9ucyxmdW5jdGlvbihvKXtyZXR1cm4gby5zZWxlY3RlZH0pXCIgK1xuICAgIFwiLm1hcChmdW5jdGlvbihvKXt2YXIgdmFsID0gXFxcIl92YWx1ZVxcXCIgaW4gbyA/IG8uX3ZhbHVlIDogby52YWx1ZTtcIiArXG4gICAgXCJyZXR1cm4gXCIgKyAobnVtYmVyID8gJ19uKHZhbCknIDogJ3ZhbCcpICsgXCJ9KVwiO1xuXG4gIHZhciBhc3NpZ25tZW50ID0gJyRldmVudC50YXJnZXQubXVsdGlwbGUgPyAkJHNlbGVjdGVkVmFsIDogJCRzZWxlY3RlZFZhbFswXSc7XG4gIHZhciBjb2RlID0gXCJ2YXIgJCRzZWxlY3RlZFZhbCA9IFwiICsgc2VsZWN0ZWRWYWwgKyBcIjtcIjtcbiAgY29kZSA9IGNvZGUgKyBcIiBcIiArIChnZW5Bc3NpZ25tZW50Q29kZSh2YWx1ZSwgYXNzaWdubWVudCkpO1xuICBhZGRIYW5kbGVyKGVsLCAnY2hhbmdlJywgY29kZSwgbnVsbCwgdHJ1ZSk7XG59XG5cbmZ1bmN0aW9uIGdlbkRlZmF1bHRNb2RlbCAoXG4gIGVsLFxuICB2YWx1ZSxcbiAgbW9kaWZpZXJzXG4pIHtcbiAgdmFyIHR5cGUgPSBlbC5hdHRyc01hcC50eXBlO1xuICB2YXIgcmVmID0gbW9kaWZpZXJzIHx8IHt9O1xuICB2YXIgbGF6eSA9IHJlZi5sYXp5O1xuICB2YXIgbnVtYmVyID0gcmVmLm51bWJlcjtcbiAgdmFyIHRyaW0gPSByZWYudHJpbTtcbiAgdmFyIG5lZWRDb21wb3NpdGlvbkd1YXJkID0gIWxhenkgJiYgdHlwZSAhPT0gJ3JhbmdlJztcbiAgdmFyIGV2ZW50ID0gbGF6eVxuICAgID8gJ2NoYW5nZSdcbiAgICA6IHR5cGUgPT09ICdyYW5nZSdcbiAgICAgID8gUkFOR0VfVE9LRU5cbiAgICAgIDogJ2lucHV0JztcblxuICB2YXIgdmFsdWVFeHByZXNzaW9uID0gJyRldmVudC50YXJnZXQudmFsdWUnO1xuICBpZiAodHJpbSkge1xuICAgIHZhbHVlRXhwcmVzc2lvbiA9IFwiJGV2ZW50LnRhcmdldC52YWx1ZS50cmltKClcIjtcbiAgfVxuICBpZiAobnVtYmVyKSB7XG4gICAgdmFsdWVFeHByZXNzaW9uID0gXCJfbihcIiArIHZhbHVlRXhwcmVzc2lvbiArIFwiKVwiO1xuICB9XG5cbiAgdmFyIGNvZGUgPSBnZW5Bc3NpZ25tZW50Q29kZSh2YWx1ZSwgdmFsdWVFeHByZXNzaW9uKTtcbiAgaWYgKG5lZWRDb21wb3NpdGlvbkd1YXJkKSB7XG4gICAgY29kZSA9IFwiaWYoJGV2ZW50LnRhcmdldC5jb21wb3NpbmcpcmV0dXJuO1wiICsgY29kZTtcbiAgfVxuXG4gIGFkZFByb3AoZWwsICd2YWx1ZScsIChcIihcIiArIHZhbHVlICsgXCIpXCIpKTtcbiAgYWRkSGFuZGxlcihlbCwgZXZlbnQsIGNvZGUsIG51bGwsIHRydWUpO1xuICBpZiAodHJpbSB8fCBudW1iZXIgfHwgdHlwZSA9PT0gJ251bWJlcicpIHtcbiAgICBhZGRIYW5kbGVyKGVsLCAnYmx1cicsICckZm9yY2VVcGRhdGUoKScpO1xuICB9XG59XG5cbi8qICAqL1xuXG4vLyBub3JtYWxpemUgdi1tb2RlbCBldmVudCB0b2tlbnMgdGhhdCBjYW4gb25seSBiZSBkZXRlcm1pbmVkIGF0IHJ1bnRpbWUuXG4vLyBpdCdzIGltcG9ydGFudCB0byBwbGFjZSB0aGUgZXZlbnQgYXMgdGhlIGZpcnN0IGluIHRoZSBhcnJheSBiZWNhdXNlXG4vLyB0aGUgd2hvbGUgcG9pbnQgaXMgZW5zdXJpbmcgdGhlIHYtbW9kZWwgY2FsbGJhY2sgZ2V0cyBjYWxsZWQgYmVmb3JlXG4vLyB1c2VyLWF0dGFjaGVkIGhhbmRsZXJzLlxuZnVuY3Rpb24gbm9ybWFsaXplRXZlbnRzIChvbikge1xuICB2YXIgZXZlbnQ7XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICBpZiAob25bUkFOR0VfVE9LRU5dKSB7XG4gICAgLy8gSUUgaW5wdXRbdHlwZT1yYW5nZV0gb25seSBzdXBwb3J0cyBgY2hhbmdlYCBldmVudFxuICAgIGV2ZW50ID0gaXNJRSA/ICdjaGFuZ2UnIDogJ2lucHV0JztcbiAgICBvbltldmVudF0gPSBbXS5jb25jYXQob25bUkFOR0VfVE9LRU5dLCBvbltldmVudF0gfHwgW10pO1xuICAgIGRlbGV0ZSBvbltSQU5HRV9UT0tFTl07XG4gIH1cbiAgaWYgKG9uW0NIRUNLQk9YX1JBRElPX1RPS0VOXSkge1xuICAgIC8vIENocm9tZSBmaXJlcyBtaWNyb3Rhc2tzIGluIGJldHdlZW4gY2xpY2svY2hhbmdlLCBsZWFkcyB0byAjNDUyMVxuICAgIGV2ZW50ID0gaXNDaHJvbWUgPyAnY2xpY2snIDogJ2NoYW5nZSc7XG4gICAgb25bZXZlbnRdID0gW10uY29uY2F0KG9uW0NIRUNLQk9YX1JBRElPX1RPS0VOXSwgb25bZXZlbnRdIHx8IFtdKTtcbiAgICBkZWxldGUgb25bQ0hFQ0tCT1hfUkFESU9fVE9LRU5dO1xuICB9XG59XG5cbnZhciB0YXJnZXQkMTtcblxuZnVuY3Rpb24gYWRkJDEgKFxuICBldmVudCxcbiAgaGFuZGxlcixcbiAgb25jZSxcbiAgY2FwdHVyZVxuKSB7XG4gIGlmIChvbmNlKSB7XG4gICAgdmFyIG9sZEhhbmRsZXIgPSBoYW5kbGVyO1xuICAgIHZhciBfdGFyZ2V0ID0gdGFyZ2V0JDE7IC8vIHNhdmUgY3VycmVudCB0YXJnZXQgZWxlbWVudCBpbiBjbG9zdXJlXG4gICAgaGFuZGxlciA9IGZ1bmN0aW9uIChldikge1xuICAgICAgdmFyIHJlcyA9IGFyZ3VtZW50cy5sZW5ndGggPT09IDFcbiAgICAgICAgPyBvbGRIYW5kbGVyKGV2KVxuICAgICAgICA6IG9sZEhhbmRsZXIuYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgICAgIGlmIChyZXMgIT09IG51bGwpIHtcbiAgICAgICAgcmVtb3ZlJDIoZXZlbnQsIGhhbmRsZXIsIGNhcHR1cmUsIF90YXJnZXQpO1xuICAgICAgfVxuICAgIH07XG4gIH1cbiAgdGFyZ2V0JDEuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlciwgY2FwdHVyZSk7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZSQyIChcbiAgZXZlbnQsXG4gIGhhbmRsZXIsXG4gIGNhcHR1cmUsXG4gIF90YXJnZXRcbikge1xuICAoX3RhcmdldCB8fCB0YXJnZXQkMSkucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlciwgY2FwdHVyZSk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZURPTUxpc3RlbmVycyAob2xkVm5vZGUsIHZub2RlKSB7XG4gIGlmICghb2xkVm5vZGUuZGF0YS5vbiAmJiAhdm5vZGUuZGF0YS5vbikge1xuICAgIHJldHVyblxuICB9XG4gIHZhciBvbiA9IHZub2RlLmRhdGEub24gfHwge307XG4gIHZhciBvbGRPbiA9IG9sZFZub2RlLmRhdGEub24gfHwge307XG4gIHRhcmdldCQxID0gdm5vZGUuZWxtO1xuICBub3JtYWxpemVFdmVudHMob24pO1xuICB1cGRhdGVMaXN0ZW5lcnMob24sIG9sZE9uLCBhZGQkMSwgcmVtb3ZlJDIsIHZub2RlLmNvbnRleHQpO1xufVxuXG52YXIgZXZlbnRzID0ge1xuICBjcmVhdGU6IHVwZGF0ZURPTUxpc3RlbmVycyxcbiAgdXBkYXRlOiB1cGRhdGVET01MaXN0ZW5lcnNcbn07XG5cbi8qICAqL1xuXG5mdW5jdGlvbiB1cGRhdGVET01Qcm9wcyAob2xkVm5vZGUsIHZub2RlKSB7XG4gIGlmICghb2xkVm5vZGUuZGF0YS5kb21Qcm9wcyAmJiAhdm5vZGUuZGF0YS5kb21Qcm9wcykge1xuICAgIHJldHVyblxuICB9XG4gIHZhciBrZXksIGN1cjtcbiAgdmFyIGVsbSA9IHZub2RlLmVsbTtcbiAgdmFyIG9sZFByb3BzID0gb2xkVm5vZGUuZGF0YS5kb21Qcm9wcyB8fCB7fTtcbiAgdmFyIHByb3BzID0gdm5vZGUuZGF0YS5kb21Qcm9wcyB8fCB7fTtcbiAgLy8gY2xvbmUgb2JzZXJ2ZWQgb2JqZWN0cywgYXMgdGhlIHVzZXIgcHJvYmFibHkgd2FudHMgdG8gbXV0YXRlIGl0XG4gIGlmIChwcm9wcy5fX29iX18pIHtcbiAgICBwcm9wcyA9IHZub2RlLmRhdGEuZG9tUHJvcHMgPSBleHRlbmQoe30sIHByb3BzKTtcbiAgfVxuXG4gIGZvciAoa2V5IGluIG9sZFByb3BzKSB7XG4gICAgaWYgKHByb3BzW2tleV0gPT0gbnVsbCkge1xuICAgICAgZWxtW2tleV0gPSAnJztcbiAgICB9XG4gIH1cbiAgZm9yIChrZXkgaW4gcHJvcHMpIHtcbiAgICBjdXIgPSBwcm9wc1trZXldO1xuICAgIC8vIGlnbm9yZSBjaGlsZHJlbiBpZiB0aGUgbm9kZSBoYXMgdGV4dENvbnRlbnQgb3IgaW5uZXJIVE1MLFxuICAgIC8vIGFzIHRoZXNlIHdpbGwgdGhyb3cgYXdheSBleGlzdGluZyBET00gbm9kZXMgYW5kIGNhdXNlIHJlbW92YWwgZXJyb3JzXG4gICAgLy8gb24gc3Vic2VxdWVudCBwYXRjaGVzICgjMzM2MClcbiAgICBpZiAoa2V5ID09PSAndGV4dENvbnRlbnQnIHx8IGtleSA9PT0gJ2lubmVySFRNTCcpIHtcbiAgICAgIGlmICh2bm9kZS5jaGlsZHJlbikgeyB2bm9kZS5jaGlsZHJlbi5sZW5ndGggPSAwOyB9XG4gICAgICBpZiAoY3VyID09PSBvbGRQcm9wc1trZXldKSB7IGNvbnRpbnVlIH1cbiAgICB9XG5cbiAgICBpZiAoa2V5ID09PSAndmFsdWUnKSB7XG4gICAgICAvLyBzdG9yZSB2YWx1ZSBhcyBfdmFsdWUgYXMgd2VsbCBzaW5jZVxuICAgICAgLy8gbm9uLXN0cmluZyB2YWx1ZXMgd2lsbCBiZSBzdHJpbmdpZmllZFxuICAgICAgZWxtLl92YWx1ZSA9IGN1cjtcbiAgICAgIC8vIGF2b2lkIHJlc2V0dGluZyBjdXJzb3IgcG9zaXRpb24gd2hlbiB2YWx1ZSBpcyB0aGUgc2FtZVxuICAgICAgdmFyIHN0ckN1ciA9IGN1ciA9PSBudWxsID8gJycgOiBTdHJpbmcoY3VyKTtcbiAgICAgIGlmIChzaG91bGRVcGRhdGVWYWx1ZShlbG0sIHZub2RlLCBzdHJDdXIpKSB7XG4gICAgICAgIGVsbS52YWx1ZSA9IHN0ckN1cjtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZWxtW2tleV0gPSBjdXI7XG4gICAgfVxuICB9XG59XG5cbi8vIGNoZWNrIHBsYXRmb3Jtcy93ZWIvdXRpbC9hdHRycy5qcyBhY2NlcHRWYWx1ZVxuXG5cbmZ1bmN0aW9uIHNob3VsZFVwZGF0ZVZhbHVlIChcbiAgZWxtLFxuICB2bm9kZSxcbiAgY2hlY2tWYWxcbikge1xuICByZXR1cm4gKCFlbG0uY29tcG9zaW5nICYmIChcbiAgICB2bm9kZS50YWcgPT09ICdvcHRpb24nIHx8XG4gICAgaXNEaXJ0eShlbG0sIGNoZWNrVmFsKSB8fFxuICAgIGlzSW5wdXRDaGFuZ2VkKGVsbSwgY2hlY2tWYWwpXG4gICkpXG59XG5cbmZ1bmN0aW9uIGlzRGlydHkgKGVsbSwgY2hlY2tWYWwpIHtcbiAgLy8gcmV0dXJuIHRydWUgd2hlbiB0ZXh0Ym94ICgubnVtYmVyIGFuZCAudHJpbSkgbG9zZXMgZm9jdXMgYW5kIGl0cyB2YWx1ZSBpcyBub3QgZXF1YWwgdG8gdGhlIHVwZGF0ZWQgdmFsdWVcbiAgcmV0dXJuIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgIT09IGVsbSAmJiBlbG0udmFsdWUgIT09IGNoZWNrVmFsXG59XG5cbmZ1bmN0aW9uIGlzSW5wdXRDaGFuZ2VkIChlbG0sIG5ld1ZhbCkge1xuICB2YXIgdmFsdWUgPSBlbG0udmFsdWU7XG4gIHZhciBtb2RpZmllcnMgPSBlbG0uX3ZNb2RpZmllcnM7IC8vIGluamVjdGVkIGJ5IHYtbW9kZWwgcnVudGltZVxuICBpZiAoKG1vZGlmaWVycyAmJiBtb2RpZmllcnMubnVtYmVyKSB8fCBlbG0udHlwZSA9PT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gdG9OdW1iZXIodmFsdWUpICE9PSB0b051bWJlcihuZXdWYWwpXG4gIH1cbiAgaWYgKG1vZGlmaWVycyAmJiBtb2RpZmllcnMudHJpbSkge1xuICAgIHJldHVybiB2YWx1ZS50cmltKCkgIT09IG5ld1ZhbC50cmltKClcbiAgfVxuICByZXR1cm4gdmFsdWUgIT09IG5ld1ZhbFxufVxuXG52YXIgZG9tUHJvcHMgPSB7XG4gIGNyZWF0ZTogdXBkYXRlRE9NUHJvcHMsXG4gIHVwZGF0ZTogdXBkYXRlRE9NUHJvcHNcbn07XG5cbi8qICAqL1xuXG52YXIgcGFyc2VTdHlsZVRleHQgPSBjYWNoZWQoZnVuY3Rpb24gKGNzc1RleHQpIHtcbiAgdmFyIHJlcyA9IHt9O1xuICB2YXIgbGlzdERlbGltaXRlciA9IC87KD8hW14oXSpcXCkpL2c7XG4gIHZhciBwcm9wZXJ0eURlbGltaXRlciA9IC86KC4rKS87XG4gIGNzc1RleHQuc3BsaXQobGlzdERlbGltaXRlcikuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuICAgIGlmIChpdGVtKSB7XG4gICAgICB2YXIgdG1wID0gaXRlbS5zcGxpdChwcm9wZXJ0eURlbGltaXRlcik7XG4gICAgICB0bXAubGVuZ3RoID4gMSAmJiAocmVzW3RtcFswXS50cmltKCldID0gdG1wWzFdLnRyaW0oKSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHJlc1xufSk7XG5cbi8vIG1lcmdlIHN0YXRpYyBhbmQgZHluYW1pYyBzdHlsZSBkYXRhIG9uIHRoZSBzYW1lIHZub2RlXG5mdW5jdGlvbiBub3JtYWxpemVTdHlsZURhdGEgKGRhdGEpIHtcbiAgdmFyIHN0eWxlID0gbm9ybWFsaXplU3R5bGVCaW5kaW5nKGRhdGEuc3R5bGUpO1xuICAvLyBzdGF0aWMgc3R5bGUgaXMgcHJlLXByb2Nlc3NlZCBpbnRvIGFuIG9iamVjdCBkdXJpbmcgY29tcGlsYXRpb25cbiAgLy8gYW5kIGlzIGFsd2F5cyBhIGZyZXNoIG9iamVjdCwgc28gaXQncyBzYWZlIHRvIG1lcmdlIGludG8gaXRcbiAgcmV0dXJuIGRhdGEuc3RhdGljU3R5bGVcbiAgICA/IGV4dGVuZChkYXRhLnN0YXRpY1N0eWxlLCBzdHlsZSlcbiAgICA6IHN0eWxlXG59XG5cbi8vIG5vcm1hbGl6ZSBwb3NzaWJsZSBhcnJheSAvIHN0cmluZyB2YWx1ZXMgaW50byBPYmplY3RcbmZ1bmN0aW9uIG5vcm1hbGl6ZVN0eWxlQmluZGluZyAoYmluZGluZ1N0eWxlKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGJpbmRpbmdTdHlsZSkpIHtcbiAgICByZXR1cm4gdG9PYmplY3QoYmluZGluZ1N0eWxlKVxuICB9XG4gIGlmICh0eXBlb2YgYmluZGluZ1N0eWxlID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBwYXJzZVN0eWxlVGV4dChiaW5kaW5nU3R5bGUpXG4gIH1cbiAgcmV0dXJuIGJpbmRpbmdTdHlsZVxufVxuXG4vKipcbiAqIHBhcmVudCBjb21wb25lbnQgc3R5bGUgc2hvdWxkIGJlIGFmdGVyIGNoaWxkJ3NcbiAqIHNvIHRoYXQgcGFyZW50IGNvbXBvbmVudCdzIHN0eWxlIGNvdWxkIG92ZXJyaWRlIGl0XG4gKi9cbmZ1bmN0aW9uIGdldFN0eWxlICh2bm9kZSwgY2hlY2tDaGlsZCkge1xuICB2YXIgcmVzID0ge307XG4gIHZhciBzdHlsZURhdGE7XG5cbiAgaWYgKGNoZWNrQ2hpbGQpIHtcbiAgICB2YXIgY2hpbGROb2RlID0gdm5vZGU7XG4gICAgd2hpbGUgKGNoaWxkTm9kZS5jb21wb25lbnRJbnN0YW5jZSkge1xuICAgICAgY2hpbGROb2RlID0gY2hpbGROb2RlLmNvbXBvbmVudEluc3RhbmNlLl92bm9kZTtcbiAgICAgIGlmIChjaGlsZE5vZGUuZGF0YSAmJiAoc3R5bGVEYXRhID0gbm9ybWFsaXplU3R5bGVEYXRhKGNoaWxkTm9kZS5kYXRhKSkpIHtcbiAgICAgICAgZXh0ZW5kKHJlcywgc3R5bGVEYXRhKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAoKHN0eWxlRGF0YSA9IG5vcm1hbGl6ZVN0eWxlRGF0YSh2bm9kZS5kYXRhKSkpIHtcbiAgICBleHRlbmQocmVzLCBzdHlsZURhdGEpO1xuICB9XG5cbiAgdmFyIHBhcmVudE5vZGUgPSB2bm9kZTtcbiAgd2hpbGUgKChwYXJlbnROb2RlID0gcGFyZW50Tm9kZS5wYXJlbnQpKSB7XG4gICAgaWYgKHBhcmVudE5vZGUuZGF0YSAmJiAoc3R5bGVEYXRhID0gbm9ybWFsaXplU3R5bGVEYXRhKHBhcmVudE5vZGUuZGF0YSkpKSB7XG4gICAgICBleHRlbmQocmVzLCBzdHlsZURhdGEpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbi8qICAqL1xuXG52YXIgY3NzVmFyUkUgPSAvXi0tLztcbnZhciBpbXBvcnRhbnRSRSA9IC9cXHMqIWltcG9ydGFudCQvO1xudmFyIHNldFByb3AgPSBmdW5jdGlvbiAoZWwsIG5hbWUsIHZhbCkge1xuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgaWYgKGNzc1ZhclJFLnRlc3QobmFtZSkpIHtcbiAgICBlbC5zdHlsZS5zZXRQcm9wZXJ0eShuYW1lLCB2YWwpO1xuICB9IGVsc2UgaWYgKGltcG9ydGFudFJFLnRlc3QodmFsKSkge1xuICAgIGVsLnN0eWxlLnNldFByb3BlcnR5KG5hbWUsIHZhbC5yZXBsYWNlKGltcG9ydGFudFJFLCAnJyksICdpbXBvcnRhbnQnKTtcbiAgfSBlbHNlIHtcbiAgICBlbC5zdHlsZVtub3JtYWxpemUobmFtZSldID0gdmFsO1xuICB9XG59O1xuXG52YXIgcHJlZml4ZXMgPSBbJ1dlYmtpdCcsICdNb3onLCAnbXMnXTtcblxudmFyIHRlc3RFbDtcbnZhciBub3JtYWxpemUgPSBjYWNoZWQoZnVuY3Rpb24gKHByb3ApIHtcbiAgdGVzdEVsID0gdGVzdEVsIHx8IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBwcm9wID0gY2FtZWxpemUocHJvcCk7XG4gIGlmIChwcm9wICE9PSAnZmlsdGVyJyAmJiAocHJvcCBpbiB0ZXN0RWwuc3R5bGUpKSB7XG4gICAgcmV0dXJuIHByb3BcbiAgfVxuICB2YXIgdXBwZXIgPSBwcm9wLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcHJvcC5zbGljZSgxKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcmVmaXhlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBwcmVmaXhlZCA9IHByZWZpeGVzW2ldICsgdXBwZXI7XG4gICAgaWYgKHByZWZpeGVkIGluIHRlc3RFbC5zdHlsZSkge1xuICAgICAgcmV0dXJuIHByZWZpeGVkXG4gICAgfVxuICB9XG59KTtcblxuZnVuY3Rpb24gdXBkYXRlU3R5bGUgKG9sZFZub2RlLCB2bm9kZSkge1xuICB2YXIgZGF0YSA9IHZub2RlLmRhdGE7XG4gIHZhciBvbGREYXRhID0gb2xkVm5vZGUuZGF0YTtcblxuICBpZiAoIWRhdGEuc3RhdGljU3R5bGUgJiYgIWRhdGEuc3R5bGUgJiZcbiAgICAgICFvbGREYXRhLnN0YXRpY1N0eWxlICYmICFvbGREYXRhLnN0eWxlKSB7XG4gICAgcmV0dXJuXG4gIH1cblxuICB2YXIgY3VyLCBuYW1lO1xuICB2YXIgZWwgPSB2bm9kZS5lbG07XG4gIHZhciBvbGRTdGF0aWNTdHlsZSA9IG9sZFZub2RlLmRhdGEuc3RhdGljU3R5bGU7XG4gIHZhciBvbGRTdHlsZUJpbmRpbmcgPSBvbGRWbm9kZS5kYXRhLnN0eWxlIHx8IHt9O1xuXG4gIC8vIGlmIHN0YXRpYyBzdHlsZSBleGlzdHMsIHN0eWxlYmluZGluZyBhbHJlYWR5IG1lcmdlZCBpbnRvIGl0IHdoZW4gZG9pbmcgbm9ybWFsaXplU3R5bGVEYXRhXG4gIHZhciBvbGRTdHlsZSA9IG9sZFN0YXRpY1N0eWxlIHx8IG9sZFN0eWxlQmluZGluZztcblxuICB2YXIgc3R5bGUgPSBub3JtYWxpemVTdHlsZUJpbmRpbmcodm5vZGUuZGF0YS5zdHlsZSkgfHwge307XG5cbiAgdm5vZGUuZGF0YS5zdHlsZSA9IHN0eWxlLl9fb2JfXyA/IGV4dGVuZCh7fSwgc3R5bGUpIDogc3R5bGU7XG5cbiAgdmFyIG5ld1N0eWxlID0gZ2V0U3R5bGUodm5vZGUsIHRydWUpO1xuXG4gIGZvciAobmFtZSBpbiBvbGRTdHlsZSkge1xuICAgIGlmIChuZXdTdHlsZVtuYW1lXSA9PSBudWxsKSB7XG4gICAgICBzZXRQcm9wKGVsLCBuYW1lLCAnJyk7XG4gICAgfVxuICB9XG4gIGZvciAobmFtZSBpbiBuZXdTdHlsZSkge1xuICAgIGN1ciA9IG5ld1N0eWxlW25hbWVdO1xuICAgIGlmIChjdXIgIT09IG9sZFN0eWxlW25hbWVdKSB7XG4gICAgICAvLyBpZTkgc2V0dGluZyB0byBudWxsIGhhcyBubyBlZmZlY3QsIG11c3QgdXNlIGVtcHR5IHN0cmluZ1xuICAgICAgc2V0UHJvcChlbCwgbmFtZSwgY3VyID09IG51bGwgPyAnJyA6IGN1cik7XG4gICAgfVxuICB9XG59XG5cbnZhciBzdHlsZSA9IHtcbiAgY3JlYXRlOiB1cGRhdGVTdHlsZSxcbiAgdXBkYXRlOiB1cGRhdGVTdHlsZVxufTtcblxuLyogICovXG5cbi8qKlxuICogQWRkIGNsYXNzIHdpdGggY29tcGF0aWJpbGl0eSBmb3IgU1ZHIHNpbmNlIGNsYXNzTGlzdCBpcyBub3Qgc3VwcG9ydGVkIG9uXG4gKiBTVkcgZWxlbWVudHMgaW4gSUVcbiAqL1xuZnVuY3Rpb24gYWRkQ2xhc3MgKGVsLCBjbHMpIHtcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gIGlmICghY2xzIHx8ICEoY2xzID0gY2xzLnRyaW0oKSkpIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gIGlmIChlbC5jbGFzc0xpc3QpIHtcbiAgICBpZiAoY2xzLmluZGV4T2YoJyAnKSA+IC0xKSB7XG4gICAgICBjbHMuc3BsaXQoL1xccysvKS5mb3JFYWNoKGZ1bmN0aW9uIChjKSB7IHJldHVybiBlbC5jbGFzc0xpc3QuYWRkKGMpOyB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWwuY2xhc3NMaXN0LmFkZChjbHMpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YXIgY3VyID0gXCIgXCIgKyAoZWwuZ2V0QXR0cmlidXRlKCdjbGFzcycpIHx8ICcnKSArIFwiIFwiO1xuICAgIGlmIChjdXIuaW5kZXhPZignICcgKyBjbHMgKyAnICcpIDwgMCkge1xuICAgICAgZWwuc2V0QXR0cmlidXRlKCdjbGFzcycsIChjdXIgKyBjbHMpLnRyaW0oKSk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogUmVtb3ZlIGNsYXNzIHdpdGggY29tcGF0aWJpbGl0eSBmb3IgU1ZHIHNpbmNlIGNsYXNzTGlzdCBpcyBub3Qgc3VwcG9ydGVkIG9uXG4gKiBTVkcgZWxlbWVudHMgaW4gSUVcbiAqL1xuZnVuY3Rpb24gcmVtb3ZlQ2xhc3MgKGVsLCBjbHMpIHtcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gIGlmICghY2xzIHx8ICEoY2xzID0gY2xzLnRyaW0oKSkpIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gIGlmIChlbC5jbGFzc0xpc3QpIHtcbiAgICBpZiAoY2xzLmluZGV4T2YoJyAnKSA+IC0xKSB7XG4gICAgICBjbHMuc3BsaXQoL1xccysvKS5mb3JFYWNoKGZ1bmN0aW9uIChjKSB7IHJldHVybiBlbC5jbGFzc0xpc3QucmVtb3ZlKGMpOyB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZShjbHMpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YXIgY3VyID0gXCIgXCIgKyAoZWwuZ2V0QXR0cmlidXRlKCdjbGFzcycpIHx8ICcnKSArIFwiIFwiO1xuICAgIHZhciB0YXIgPSAnICcgKyBjbHMgKyAnICc7XG4gICAgd2hpbGUgKGN1ci5pbmRleE9mKHRhcikgPj0gMCkge1xuICAgICAgY3VyID0gY3VyLnJlcGxhY2UodGFyLCAnICcpO1xuICAgIH1cbiAgICBlbC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgY3VyLnRyaW0oKSk7XG4gIH1cbn1cblxuLyogICovXG5cbmZ1bmN0aW9uIHJlc29sdmVUcmFuc2l0aW9uIChkZWYkJDEpIHtcbiAgaWYgKCFkZWYkJDEpIHtcbiAgICByZXR1cm5cbiAgfVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICBpZiAodHlwZW9mIGRlZiQkMSA9PT0gJ29iamVjdCcpIHtcbiAgICB2YXIgcmVzID0ge307XG4gICAgaWYgKGRlZiQkMS5jc3MgIT09IGZhbHNlKSB7XG4gICAgICBleHRlbmQocmVzLCBhdXRvQ3NzVHJhbnNpdGlvbihkZWYkJDEubmFtZSB8fCAndicpKTtcbiAgICB9XG4gICAgZXh0ZW5kKHJlcywgZGVmJCQxKTtcbiAgICByZXR1cm4gcmVzXG4gIH0gZWxzZSBpZiAodHlwZW9mIGRlZiQkMSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gYXV0b0Nzc1RyYW5zaXRpb24oZGVmJCQxKVxuICB9XG59XG5cbnZhciBhdXRvQ3NzVHJhbnNpdGlvbiA9IGNhY2hlZChmdW5jdGlvbiAobmFtZSkge1xuICByZXR1cm4ge1xuICAgIGVudGVyQ2xhc3M6IChuYW1lICsgXCItZW50ZXJcIiksXG4gICAgZW50ZXJUb0NsYXNzOiAobmFtZSArIFwiLWVudGVyLXRvXCIpLFxuICAgIGVudGVyQWN0aXZlQ2xhc3M6IChuYW1lICsgXCItZW50ZXItYWN0aXZlXCIpLFxuICAgIGxlYXZlQ2xhc3M6IChuYW1lICsgXCItbGVhdmVcIiksXG4gICAgbGVhdmVUb0NsYXNzOiAobmFtZSArIFwiLWxlYXZlLXRvXCIpLFxuICAgIGxlYXZlQWN0aXZlQ2xhc3M6IChuYW1lICsgXCItbGVhdmUtYWN0aXZlXCIpXG4gIH1cbn0pO1xuXG52YXIgaGFzVHJhbnNpdGlvbiA9IGluQnJvd3NlciAmJiAhaXNJRTk7XG52YXIgVFJBTlNJVElPTiA9ICd0cmFuc2l0aW9uJztcbnZhciBBTklNQVRJT04gPSAnYW5pbWF0aW9uJztcblxuLy8gVHJhbnNpdGlvbiBwcm9wZXJ0eS9ldmVudCBzbmlmZmluZ1xudmFyIHRyYW5zaXRpb25Qcm9wID0gJ3RyYW5zaXRpb24nO1xudmFyIHRyYW5zaXRpb25FbmRFdmVudCA9ICd0cmFuc2l0aW9uZW5kJztcbnZhciBhbmltYXRpb25Qcm9wID0gJ2FuaW1hdGlvbic7XG52YXIgYW5pbWF0aW9uRW5kRXZlbnQgPSAnYW5pbWF0aW9uZW5kJztcbmlmIChoYXNUcmFuc2l0aW9uKSB7XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICBpZiAod2luZG93Lm9udHJhbnNpdGlvbmVuZCA9PT0gdW5kZWZpbmVkICYmXG4gICAgd2luZG93Lm9ud2Via2l0dHJhbnNpdGlvbmVuZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdHJhbnNpdGlvblByb3AgPSAnV2Via2l0VHJhbnNpdGlvbic7XG4gICAgdHJhbnNpdGlvbkVuZEV2ZW50ID0gJ3dlYmtpdFRyYW5zaXRpb25FbmQnO1xuICB9XG4gIGlmICh3aW5kb3cub25hbmltYXRpb25lbmQgPT09IHVuZGVmaW5lZCAmJlxuICAgIHdpbmRvdy5vbndlYmtpdGFuaW1hdGlvbmVuZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgYW5pbWF0aW9uUHJvcCA9ICdXZWJraXRBbmltYXRpb24nO1xuICAgIGFuaW1hdGlvbkVuZEV2ZW50ID0gJ3dlYmtpdEFuaW1hdGlvbkVuZCc7XG4gIH1cbn1cblxuLy8gYmluZGluZyB0byB3aW5kb3cgaXMgbmVjZXNzYXJ5IHRvIG1ha2UgaG90IHJlbG9hZCB3b3JrIGluIElFIGluIHN0cmljdCBtb2RlXG52YXIgcmFmID0gaW5Ccm93c2VyICYmIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbiAgPyB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lLmJpbmQod2luZG93KVxuICA6IHNldFRpbWVvdXQ7XG5cbmZ1bmN0aW9uIG5leHRGcmFtZSAoZm4pIHtcbiAgcmFmKGZ1bmN0aW9uICgpIHtcbiAgICByYWYoZm4pO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gYWRkVHJhbnNpdGlvbkNsYXNzIChlbCwgY2xzKSB7XG4gIChlbC5fdHJhbnNpdGlvbkNsYXNzZXMgfHwgKGVsLl90cmFuc2l0aW9uQ2xhc3NlcyA9IFtdKSkucHVzaChjbHMpO1xuICBhZGRDbGFzcyhlbCwgY2xzKTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlVHJhbnNpdGlvbkNsYXNzIChlbCwgY2xzKSB7XG4gIGlmIChlbC5fdHJhbnNpdGlvbkNsYXNzZXMpIHtcbiAgICByZW1vdmUoZWwuX3RyYW5zaXRpb25DbGFzc2VzLCBjbHMpO1xuICB9XG4gIHJlbW92ZUNsYXNzKGVsLCBjbHMpO1xufVxuXG5mdW5jdGlvbiB3aGVuVHJhbnNpdGlvbkVuZHMgKFxuICBlbCxcbiAgZXhwZWN0ZWRUeXBlLFxuICBjYlxuKSB7XG4gIHZhciByZWYgPSBnZXRUcmFuc2l0aW9uSW5mbyhlbCwgZXhwZWN0ZWRUeXBlKTtcbiAgdmFyIHR5cGUgPSByZWYudHlwZTtcbiAgdmFyIHRpbWVvdXQgPSByZWYudGltZW91dDtcbiAgdmFyIHByb3BDb3VudCA9IHJlZi5wcm9wQ291bnQ7XG4gIGlmICghdHlwZSkgeyByZXR1cm4gY2IoKSB9XG4gIHZhciBldmVudCA9IHR5cGUgPT09IFRSQU5TSVRJT04gPyB0cmFuc2l0aW9uRW5kRXZlbnQgOiBhbmltYXRpb25FbmRFdmVudDtcbiAgdmFyIGVuZGVkID0gMDtcbiAgdmFyIGVuZCA9IGZ1bmN0aW9uICgpIHtcbiAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBvbkVuZCk7XG4gICAgY2IoKTtcbiAgfTtcbiAgdmFyIG9uRW5kID0gZnVuY3Rpb24gKGUpIHtcbiAgICBpZiAoZS50YXJnZXQgPT09IGVsKSB7XG4gICAgICBpZiAoKytlbmRlZCA+PSBwcm9wQ291bnQpIHtcbiAgICAgICAgZW5kKCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoZW5kZWQgPCBwcm9wQ291bnQpIHtcbiAgICAgIGVuZCgpO1xuICAgIH1cbiAgfSwgdGltZW91dCArIDEpO1xuICBlbC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBvbkVuZCk7XG59XG5cbnZhciB0cmFuc2Zvcm1SRSA9IC9cXGIodHJhbnNmb3JtfGFsbCkoLHwkKS87XG5cbmZ1bmN0aW9uIGdldFRyYW5zaXRpb25JbmZvIChlbCwgZXhwZWN0ZWRUeXBlKSB7XG4gIHZhciBzdHlsZXMgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XG4gIHZhciB0cmFuc2l0aW9uRGVsYXlzID0gc3R5bGVzW3RyYW5zaXRpb25Qcm9wICsgJ0RlbGF5J10uc3BsaXQoJywgJyk7XG4gIHZhciB0cmFuc2l0aW9uRHVyYXRpb25zID0gc3R5bGVzW3RyYW5zaXRpb25Qcm9wICsgJ0R1cmF0aW9uJ10uc3BsaXQoJywgJyk7XG4gIHZhciB0cmFuc2l0aW9uVGltZW91dCA9IGdldFRpbWVvdXQodHJhbnNpdGlvbkRlbGF5cywgdHJhbnNpdGlvbkR1cmF0aW9ucyk7XG4gIHZhciBhbmltYXRpb25EZWxheXMgPSBzdHlsZXNbYW5pbWF0aW9uUHJvcCArICdEZWxheSddLnNwbGl0KCcsICcpO1xuICB2YXIgYW5pbWF0aW9uRHVyYXRpb25zID0gc3R5bGVzW2FuaW1hdGlvblByb3AgKyAnRHVyYXRpb24nXS5zcGxpdCgnLCAnKTtcbiAgdmFyIGFuaW1hdGlvblRpbWVvdXQgPSBnZXRUaW1lb3V0KGFuaW1hdGlvbkRlbGF5cywgYW5pbWF0aW9uRHVyYXRpb25zKTtcblxuICB2YXIgdHlwZTtcbiAgdmFyIHRpbWVvdXQgPSAwO1xuICB2YXIgcHJvcENvdW50ID0gMDtcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gIGlmIChleHBlY3RlZFR5cGUgPT09IFRSQU5TSVRJT04pIHtcbiAgICBpZiAodHJhbnNpdGlvblRpbWVvdXQgPiAwKSB7XG4gICAgICB0eXBlID0gVFJBTlNJVElPTjtcbiAgICAgIHRpbWVvdXQgPSB0cmFuc2l0aW9uVGltZW91dDtcbiAgICAgIHByb3BDb3VudCA9IHRyYW5zaXRpb25EdXJhdGlvbnMubGVuZ3RoO1xuICAgIH1cbiAgfSBlbHNlIGlmIChleHBlY3RlZFR5cGUgPT09IEFOSU1BVElPTikge1xuICAgIGlmIChhbmltYXRpb25UaW1lb3V0ID4gMCkge1xuICAgICAgdHlwZSA9IEFOSU1BVElPTjtcbiAgICAgIHRpbWVvdXQgPSBhbmltYXRpb25UaW1lb3V0O1xuICAgICAgcHJvcENvdW50ID0gYW5pbWF0aW9uRHVyYXRpb25zLmxlbmd0aDtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGltZW91dCA9IE1hdGgubWF4KHRyYW5zaXRpb25UaW1lb3V0LCBhbmltYXRpb25UaW1lb3V0KTtcbiAgICB0eXBlID0gdGltZW91dCA+IDBcbiAgICAgID8gdHJhbnNpdGlvblRpbWVvdXQgPiBhbmltYXRpb25UaW1lb3V0XG4gICAgICAgID8gVFJBTlNJVElPTlxuICAgICAgICA6IEFOSU1BVElPTlxuICAgICAgOiBudWxsO1xuICAgIHByb3BDb3VudCA9IHR5cGVcbiAgICAgID8gdHlwZSA9PT0gVFJBTlNJVElPTlxuICAgICAgICA/IHRyYW5zaXRpb25EdXJhdGlvbnMubGVuZ3RoXG4gICAgICAgIDogYW5pbWF0aW9uRHVyYXRpb25zLmxlbmd0aFxuICAgICAgOiAwO1xuICB9XG4gIHZhciBoYXNUcmFuc2Zvcm0gPVxuICAgIHR5cGUgPT09IFRSQU5TSVRJT04gJiZcbiAgICB0cmFuc2Zvcm1SRS50ZXN0KHN0eWxlc1t0cmFuc2l0aW9uUHJvcCArICdQcm9wZXJ0eSddKTtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiB0eXBlLFxuICAgIHRpbWVvdXQ6IHRpbWVvdXQsXG4gICAgcHJvcENvdW50OiBwcm9wQ291bnQsXG4gICAgaGFzVHJhbnNmb3JtOiBoYXNUcmFuc2Zvcm1cbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRUaW1lb3V0IChkZWxheXMsIGR1cmF0aW9ucykge1xuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICB3aGlsZSAoZGVsYXlzLmxlbmd0aCA8IGR1cmF0aW9ucy5sZW5ndGgpIHtcbiAgICBkZWxheXMgPSBkZWxheXMuY29uY2F0KGRlbGF5cyk7XG4gIH1cblxuICByZXR1cm4gTWF0aC5tYXguYXBwbHkobnVsbCwgZHVyYXRpb25zLm1hcChmdW5jdGlvbiAoZCwgaSkge1xuICAgIHJldHVybiB0b01zKGQpICsgdG9NcyhkZWxheXNbaV0pXG4gIH0pKVxufVxuXG5mdW5jdGlvbiB0b01zIChzKSB7XG4gIHJldHVybiBOdW1iZXIocy5zbGljZSgwLCAtMSkpICogMTAwMFxufVxuXG4vKiAgKi9cblxuZnVuY3Rpb24gZW50ZXIgKHZub2RlLCB0b2dnbGVEaXNwbGF5KSB7XG4gIHZhciBlbCA9IHZub2RlLmVsbTtcblxuICAvLyBjYWxsIGxlYXZlIGNhbGxiYWNrIG5vd1xuICBpZiAoZWwuX2xlYXZlQ2IpIHtcbiAgICBlbC5fbGVhdmVDYi5jYW5jZWxsZWQgPSB0cnVlO1xuICAgIGVsLl9sZWF2ZUNiKCk7XG4gIH1cblxuICB2YXIgZGF0YSA9IHJlc29sdmVUcmFuc2l0aW9uKHZub2RlLmRhdGEudHJhbnNpdGlvbik7XG4gIGlmICghZGF0YSkge1xuICAgIHJldHVyblxuICB9XG5cbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gIGlmIChlbC5fZW50ZXJDYiB8fCBlbC5ub2RlVHlwZSAhPT0gMSkge1xuICAgIHJldHVyblxuICB9XG5cbiAgdmFyIGNzcyA9IGRhdGEuY3NzO1xuICB2YXIgdHlwZSA9IGRhdGEudHlwZTtcbiAgdmFyIGVudGVyQ2xhc3MgPSBkYXRhLmVudGVyQ2xhc3M7XG4gIHZhciBlbnRlclRvQ2xhc3MgPSBkYXRhLmVudGVyVG9DbGFzcztcbiAgdmFyIGVudGVyQWN0aXZlQ2xhc3MgPSBkYXRhLmVudGVyQWN0aXZlQ2xhc3M7XG4gIHZhciBhcHBlYXJDbGFzcyA9IGRhdGEuYXBwZWFyQ2xhc3M7XG4gIHZhciBhcHBlYXJUb0NsYXNzID0gZGF0YS5hcHBlYXJUb0NsYXNzO1xuICB2YXIgYXBwZWFyQWN0aXZlQ2xhc3MgPSBkYXRhLmFwcGVhckFjdGl2ZUNsYXNzO1xuICB2YXIgYmVmb3JlRW50ZXIgPSBkYXRhLmJlZm9yZUVudGVyO1xuICB2YXIgZW50ZXIgPSBkYXRhLmVudGVyO1xuICB2YXIgYWZ0ZXJFbnRlciA9IGRhdGEuYWZ0ZXJFbnRlcjtcbiAgdmFyIGVudGVyQ2FuY2VsbGVkID0gZGF0YS5lbnRlckNhbmNlbGxlZDtcbiAgdmFyIGJlZm9yZUFwcGVhciA9IGRhdGEuYmVmb3JlQXBwZWFyO1xuICB2YXIgYXBwZWFyID0gZGF0YS5hcHBlYXI7XG4gIHZhciBhZnRlckFwcGVhciA9IGRhdGEuYWZ0ZXJBcHBlYXI7XG4gIHZhciBhcHBlYXJDYW5jZWxsZWQgPSBkYXRhLmFwcGVhckNhbmNlbGxlZDtcbiAgdmFyIGR1cmF0aW9uID0gZGF0YS5kdXJhdGlvbjtcblxuICAvLyBhY3RpdmVJbnN0YW5jZSB3aWxsIGFsd2F5cyBiZSB0aGUgPHRyYW5zaXRpb24+IGNvbXBvbmVudCBtYW5hZ2luZyB0aGlzXG4gIC8vIHRyYW5zaXRpb24uIE9uZSBlZGdlIGNhc2UgdG8gY2hlY2sgaXMgd2hlbiB0aGUgPHRyYW5zaXRpb24+IGlzIHBsYWNlZFxuICAvLyBhcyB0aGUgcm9vdCBub2RlIG9mIGEgY2hpbGQgY29tcG9uZW50LiBJbiB0aGF0IGNhc2Ugd2UgbmVlZCB0byBjaGVja1xuICAvLyA8dHJhbnNpdGlvbj4ncyBwYXJlbnQgZm9yIGFwcGVhciBjaGVjay5cbiAgdmFyIGNvbnRleHQgPSBhY3RpdmVJbnN0YW5jZTtcbiAgdmFyIHRyYW5zaXRpb25Ob2RlID0gYWN0aXZlSW5zdGFuY2UuJHZub2RlO1xuICB3aGlsZSAodHJhbnNpdGlvbk5vZGUgJiYgdHJhbnNpdGlvbk5vZGUucGFyZW50KSB7XG4gICAgdHJhbnNpdGlvbk5vZGUgPSB0cmFuc2l0aW9uTm9kZS5wYXJlbnQ7XG4gICAgY29udGV4dCA9IHRyYW5zaXRpb25Ob2RlLmNvbnRleHQ7XG4gIH1cblxuICB2YXIgaXNBcHBlYXIgPSAhY29udGV4dC5faXNNb3VudGVkIHx8ICF2bm9kZS5pc1Jvb3RJbnNlcnQ7XG5cbiAgaWYgKGlzQXBwZWFyICYmICFhcHBlYXIgJiYgYXBwZWFyICE9PSAnJykge1xuICAgIHJldHVyblxuICB9XG5cbiAgdmFyIHN0YXJ0Q2xhc3MgPSBpc0FwcGVhciAmJiBhcHBlYXJDbGFzc1xuICAgID8gYXBwZWFyQ2xhc3NcbiAgICA6IGVudGVyQ2xhc3M7XG4gIHZhciBhY3RpdmVDbGFzcyA9IGlzQXBwZWFyICYmIGFwcGVhckFjdGl2ZUNsYXNzXG4gICAgPyBhcHBlYXJBY3RpdmVDbGFzc1xuICAgIDogZW50ZXJBY3RpdmVDbGFzcztcbiAgdmFyIHRvQ2xhc3MgPSBpc0FwcGVhciAmJiBhcHBlYXJUb0NsYXNzXG4gICAgPyBhcHBlYXJUb0NsYXNzXG4gICAgOiBlbnRlclRvQ2xhc3M7XG5cbiAgdmFyIGJlZm9yZUVudGVySG9vayA9IGlzQXBwZWFyXG4gICAgPyAoYmVmb3JlQXBwZWFyIHx8IGJlZm9yZUVudGVyKVxuICAgIDogYmVmb3JlRW50ZXI7XG4gIHZhciBlbnRlckhvb2sgPSBpc0FwcGVhclxuICAgID8gKHR5cGVvZiBhcHBlYXIgPT09ICdmdW5jdGlvbicgPyBhcHBlYXIgOiBlbnRlcilcbiAgICA6IGVudGVyO1xuICB2YXIgYWZ0ZXJFbnRlckhvb2sgPSBpc0FwcGVhclxuICAgID8gKGFmdGVyQXBwZWFyIHx8IGFmdGVyRW50ZXIpXG4gICAgOiBhZnRlckVudGVyO1xuICB2YXIgZW50ZXJDYW5jZWxsZWRIb29rID0gaXNBcHBlYXJcbiAgICA/IChhcHBlYXJDYW5jZWxsZWQgfHwgZW50ZXJDYW5jZWxsZWQpXG4gICAgOiBlbnRlckNhbmNlbGxlZDtcblxuICB2YXIgZXhwbGljaXRFbnRlckR1cmF0aW9uID0gdG9OdW1iZXIoXG4gICAgaXNPYmplY3QoZHVyYXRpb24pXG4gICAgICA/IGR1cmF0aW9uLmVudGVyXG4gICAgICA6IGR1cmF0aW9uXG4gICk7XG5cbiAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmIGV4cGxpY2l0RW50ZXJEdXJhdGlvbiAhPSBudWxsKSB7XG4gICAgY2hlY2tEdXJhdGlvbihleHBsaWNpdEVudGVyRHVyYXRpb24sICdlbnRlcicsIHZub2RlKTtcbiAgfVxuXG4gIHZhciBleHBlY3RzQ1NTID0gY3NzICE9PSBmYWxzZSAmJiAhaXNJRTk7XG4gIHZhciB1c2VyV2FudHNDb250cm9sID0gZ2V0SG9va0FyZ3VtZW50c0xlbmd0aChlbnRlckhvb2spO1xuXG4gIHZhciBjYiA9IGVsLl9lbnRlckNiID0gb25jZShmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGV4cGVjdHNDU1MpIHtcbiAgICAgIHJlbW92ZVRyYW5zaXRpb25DbGFzcyhlbCwgdG9DbGFzcyk7XG4gICAgICByZW1vdmVUcmFuc2l0aW9uQ2xhc3MoZWwsIGFjdGl2ZUNsYXNzKTtcbiAgICB9XG4gICAgaWYgKGNiLmNhbmNlbGxlZCkge1xuICAgICAgaWYgKGV4cGVjdHNDU1MpIHtcbiAgICAgICAgcmVtb3ZlVHJhbnNpdGlvbkNsYXNzKGVsLCBzdGFydENsYXNzKTtcbiAgICAgIH1cbiAgICAgIGVudGVyQ2FuY2VsbGVkSG9vayAmJiBlbnRlckNhbmNlbGxlZEhvb2soZWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhZnRlckVudGVySG9vayAmJiBhZnRlckVudGVySG9vayhlbCk7XG4gICAgfVxuICAgIGVsLl9lbnRlckNiID0gbnVsbDtcbiAgfSk7XG5cbiAgaWYgKCF2bm9kZS5kYXRhLnNob3cpIHtcbiAgICAvLyByZW1vdmUgcGVuZGluZyBsZWF2ZSBlbGVtZW50IG9uIGVudGVyIGJ5IGluamVjdGluZyBhbiBpbnNlcnQgaG9va1xuICAgIG1lcmdlVk5vZGVIb29rKHZub2RlLmRhdGEuaG9vayB8fCAodm5vZGUuZGF0YS5ob29rID0ge30pLCAnaW5zZXJ0JywgZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHBhcmVudCA9IGVsLnBhcmVudE5vZGU7XG4gICAgICB2YXIgcGVuZGluZ05vZGUgPSBwYXJlbnQgJiYgcGFyZW50Ll9wZW5kaW5nICYmIHBhcmVudC5fcGVuZGluZ1t2bm9kZS5rZXldO1xuICAgICAgaWYgKHBlbmRpbmdOb2RlICYmXG4gICAgICAgICAgcGVuZGluZ05vZGUudGFnID09PSB2bm9kZS50YWcgJiZcbiAgICAgICAgICBwZW5kaW5nTm9kZS5lbG0uX2xlYXZlQ2IpIHtcbiAgICAgICAgcGVuZGluZ05vZGUuZWxtLl9sZWF2ZUNiKCk7XG4gICAgICB9XG4gICAgICBlbnRlckhvb2sgJiYgZW50ZXJIb29rKGVsLCBjYik7XG4gICAgfSk7XG4gIH1cblxuICAvLyBzdGFydCBlbnRlciB0cmFuc2l0aW9uXG4gIGJlZm9yZUVudGVySG9vayAmJiBiZWZvcmVFbnRlckhvb2soZWwpO1xuICBpZiAoZXhwZWN0c0NTUykge1xuICAgIGFkZFRyYW5zaXRpb25DbGFzcyhlbCwgc3RhcnRDbGFzcyk7XG4gICAgYWRkVHJhbnNpdGlvbkNsYXNzKGVsLCBhY3RpdmVDbGFzcyk7XG4gICAgbmV4dEZyYW1lKGZ1bmN0aW9uICgpIHtcbiAgICAgIGFkZFRyYW5zaXRpb25DbGFzcyhlbCwgdG9DbGFzcyk7XG4gICAgICByZW1vdmVUcmFuc2l0aW9uQ2xhc3MoZWwsIHN0YXJ0Q2xhc3MpO1xuICAgICAgaWYgKCFjYi5jYW5jZWxsZWQgJiYgIXVzZXJXYW50c0NvbnRyb2wpIHtcbiAgICAgICAgaWYgKGlzVmFsaWREdXJhdGlvbihleHBsaWNpdEVudGVyRHVyYXRpb24pKSB7XG4gICAgICAgICAgc2V0VGltZW91dChjYiwgZXhwbGljaXRFbnRlckR1cmF0aW9uKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB3aGVuVHJhbnNpdGlvbkVuZHMoZWwsIHR5cGUsIGNiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgaWYgKHZub2RlLmRhdGEuc2hvdykge1xuICAgIHRvZ2dsZURpc3BsYXkgJiYgdG9nZ2xlRGlzcGxheSgpO1xuICAgIGVudGVySG9vayAmJiBlbnRlckhvb2soZWwsIGNiKTtcbiAgfVxuXG4gIGlmICghZXhwZWN0c0NTUyAmJiAhdXNlcldhbnRzQ29udHJvbCkge1xuICAgIGNiKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gbGVhdmUgKHZub2RlLCBybSkge1xuICB2YXIgZWwgPSB2bm9kZS5lbG07XG5cbiAgLy8gY2FsbCBlbnRlciBjYWxsYmFjayBub3dcbiAgaWYgKGVsLl9lbnRlckNiKSB7XG4gICAgZWwuX2VudGVyQ2IuY2FuY2VsbGVkID0gdHJ1ZTtcbiAgICBlbC5fZW50ZXJDYigpO1xuICB9XG5cbiAgdmFyIGRhdGEgPSByZXNvbHZlVHJhbnNpdGlvbih2bm9kZS5kYXRhLnRyYW5zaXRpb24pO1xuICBpZiAoIWRhdGEpIHtcbiAgICByZXR1cm4gcm0oKVxuICB9XG5cbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gIGlmIChlbC5fbGVhdmVDYiB8fCBlbC5ub2RlVHlwZSAhPT0gMSkge1xuICAgIHJldHVyblxuICB9XG5cbiAgdmFyIGNzcyA9IGRhdGEuY3NzO1xuICB2YXIgdHlwZSA9IGRhdGEudHlwZTtcbiAgdmFyIGxlYXZlQ2xhc3MgPSBkYXRhLmxlYXZlQ2xhc3M7XG4gIHZhciBsZWF2ZVRvQ2xhc3MgPSBkYXRhLmxlYXZlVG9DbGFzcztcbiAgdmFyIGxlYXZlQWN0aXZlQ2xhc3MgPSBkYXRhLmxlYXZlQWN0aXZlQ2xhc3M7XG4gIHZhciBiZWZvcmVMZWF2ZSA9IGRhdGEuYmVmb3JlTGVhdmU7XG4gIHZhciBsZWF2ZSA9IGRhdGEubGVhdmU7XG4gIHZhciBhZnRlckxlYXZlID0gZGF0YS5hZnRlckxlYXZlO1xuICB2YXIgbGVhdmVDYW5jZWxsZWQgPSBkYXRhLmxlYXZlQ2FuY2VsbGVkO1xuICB2YXIgZGVsYXlMZWF2ZSA9IGRhdGEuZGVsYXlMZWF2ZTtcbiAgdmFyIGR1cmF0aW9uID0gZGF0YS5kdXJhdGlvbjtcblxuICB2YXIgZXhwZWN0c0NTUyA9IGNzcyAhPT0gZmFsc2UgJiYgIWlzSUU5O1xuICB2YXIgdXNlcldhbnRzQ29udHJvbCA9IGdldEhvb2tBcmd1bWVudHNMZW5ndGgobGVhdmUpO1xuXG4gIHZhciBleHBsaWNpdExlYXZlRHVyYXRpb24gPSB0b051bWJlcihcbiAgICBpc09iamVjdChkdXJhdGlvbilcbiAgICAgID8gZHVyYXRpb24ubGVhdmVcbiAgICAgIDogZHVyYXRpb25cbiAgKTtcblxuICBpZiAoXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiYgZXhwbGljaXRMZWF2ZUR1cmF0aW9uICE9IG51bGwpIHtcbiAgICBjaGVja0R1cmF0aW9uKGV4cGxpY2l0TGVhdmVEdXJhdGlvbiwgJ2xlYXZlJywgdm5vZGUpO1xuICB9XG5cbiAgdmFyIGNiID0gZWwuX2xlYXZlQ2IgPSBvbmNlKGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoZWwucGFyZW50Tm9kZSAmJiBlbC5wYXJlbnROb2RlLl9wZW5kaW5nKSB7XG4gICAgICBlbC5wYXJlbnROb2RlLl9wZW5kaW5nW3Zub2RlLmtleV0gPSBudWxsO1xuICAgIH1cbiAgICBpZiAoZXhwZWN0c0NTUykge1xuICAgICAgcmVtb3ZlVHJhbnNpdGlvbkNsYXNzKGVsLCBsZWF2ZVRvQ2xhc3MpO1xuICAgICAgcmVtb3ZlVHJhbnNpdGlvbkNsYXNzKGVsLCBsZWF2ZUFjdGl2ZUNsYXNzKTtcbiAgICB9XG4gICAgaWYgKGNiLmNhbmNlbGxlZCkge1xuICAgICAgaWYgKGV4cGVjdHNDU1MpIHtcbiAgICAgICAgcmVtb3ZlVHJhbnNpdGlvbkNsYXNzKGVsLCBsZWF2ZUNsYXNzKTtcbiAgICAgIH1cbiAgICAgIGxlYXZlQ2FuY2VsbGVkICYmIGxlYXZlQ2FuY2VsbGVkKGVsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcm0oKTtcbiAgICAgIGFmdGVyTGVhdmUgJiYgYWZ0ZXJMZWF2ZShlbCk7XG4gICAgfVxuICAgIGVsLl9sZWF2ZUNiID0gbnVsbDtcbiAgfSk7XG5cbiAgaWYgKGRlbGF5TGVhdmUpIHtcbiAgICBkZWxheUxlYXZlKHBlcmZvcm1MZWF2ZSk7XG4gIH0gZWxzZSB7XG4gICAgcGVyZm9ybUxlYXZlKCk7XG4gIH1cblxuICBmdW5jdGlvbiBwZXJmb3JtTGVhdmUgKCkge1xuICAgIC8vIHRoZSBkZWxheWVkIGxlYXZlIG1heSBoYXZlIGFscmVhZHkgYmVlbiBjYW5jZWxsZWRcbiAgICBpZiAoY2IuY2FuY2VsbGVkKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgLy8gcmVjb3JkIGxlYXZpbmcgZWxlbWVudFxuICAgIGlmICghdm5vZGUuZGF0YS5zaG93KSB7XG4gICAgICAoZWwucGFyZW50Tm9kZS5fcGVuZGluZyB8fCAoZWwucGFyZW50Tm9kZS5fcGVuZGluZyA9IHt9KSlbdm5vZGUua2V5XSA9IHZub2RlO1xuICAgIH1cbiAgICBiZWZvcmVMZWF2ZSAmJiBiZWZvcmVMZWF2ZShlbCk7XG4gICAgaWYgKGV4cGVjdHNDU1MpIHtcbiAgICAgIGFkZFRyYW5zaXRpb25DbGFzcyhlbCwgbGVhdmVDbGFzcyk7XG4gICAgICBhZGRUcmFuc2l0aW9uQ2xhc3MoZWwsIGxlYXZlQWN0aXZlQ2xhc3MpO1xuICAgICAgbmV4dEZyYW1lKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgYWRkVHJhbnNpdGlvbkNsYXNzKGVsLCBsZWF2ZVRvQ2xhc3MpO1xuICAgICAgICByZW1vdmVUcmFuc2l0aW9uQ2xhc3MoZWwsIGxlYXZlQ2xhc3MpO1xuICAgICAgICBpZiAoIWNiLmNhbmNlbGxlZCAmJiAhdXNlcldhbnRzQ29udHJvbCkge1xuICAgICAgICAgIGlmIChpc1ZhbGlkRHVyYXRpb24oZXhwbGljaXRMZWF2ZUR1cmF0aW9uKSkge1xuICAgICAgICAgICAgc2V0VGltZW91dChjYiwgZXhwbGljaXRMZWF2ZUR1cmF0aW9uKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgd2hlblRyYW5zaXRpb25FbmRzKGVsLCB0eXBlLCBjYik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgbGVhdmUgJiYgbGVhdmUoZWwsIGNiKTtcbiAgICBpZiAoIWV4cGVjdHNDU1MgJiYgIXVzZXJXYW50c0NvbnRyb2wpIHtcbiAgICAgIGNiKCk7XG4gICAgfVxuICB9XG59XG5cbi8vIG9ubHkgdXNlZCBpbiBkZXYgbW9kZVxuZnVuY3Rpb24gY2hlY2tEdXJhdGlvbiAodmFsLCBuYW1lLCB2bm9kZSkge1xuICBpZiAodHlwZW9mIHZhbCAhPT0gJ251bWJlcicpIHtcbiAgICB3YXJuKFxuICAgICAgXCI8dHJhbnNpdGlvbj4gZXhwbGljaXQgXCIgKyBuYW1lICsgXCIgZHVyYXRpb24gaXMgbm90IGEgdmFsaWQgbnVtYmVyIC0gXCIgK1xuICAgICAgXCJnb3QgXCIgKyAoSlNPTi5zdHJpbmdpZnkodmFsKSkgKyBcIi5cIixcbiAgICAgIHZub2RlLmNvbnRleHRcbiAgICApO1xuICB9IGVsc2UgaWYgKGlzTmFOKHZhbCkpIHtcbiAgICB3YXJuKFxuICAgICAgXCI8dHJhbnNpdGlvbj4gZXhwbGljaXQgXCIgKyBuYW1lICsgXCIgZHVyYXRpb24gaXMgTmFOIC0gXCIgK1xuICAgICAgJ3RoZSBkdXJhdGlvbiBleHByZXNzaW9uIG1pZ2h0IGJlIGluY29ycmVjdC4nLFxuICAgICAgdm5vZGUuY29udGV4dFxuICAgICk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaXNWYWxpZER1cmF0aW9uICh2YWwpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICdudW1iZXInICYmICFpc05hTih2YWwpXG59XG5cbi8qKlxuICogTm9ybWFsaXplIGEgdHJhbnNpdGlvbiBob29rJ3MgYXJndW1lbnQgbGVuZ3RoLiBUaGUgaG9vayBtYXkgYmU6XG4gKiAtIGEgbWVyZ2VkIGhvb2sgKGludm9rZXIpIHdpdGggdGhlIG9yaWdpbmFsIGluIC5mbnNcbiAqIC0gYSB3cmFwcGVkIGNvbXBvbmVudCBtZXRob2QgKGNoZWNrIC5fbGVuZ3RoKVxuICogLSBhIHBsYWluIGZ1bmN0aW9uICgubGVuZ3RoKVxuICovXG5mdW5jdGlvbiBnZXRIb29rQXJndW1lbnRzTGVuZ3RoIChmbikge1xuICBpZiAoIWZuKSB7IHJldHVybiBmYWxzZSB9XG4gIHZhciBpbnZva2VyRm5zID0gZm4uZm5zO1xuICBpZiAoaW52b2tlckZucykge1xuICAgIC8vIGludm9rZXJcbiAgICByZXR1cm4gZ2V0SG9va0FyZ3VtZW50c0xlbmd0aChcbiAgICAgIEFycmF5LmlzQXJyYXkoaW52b2tlckZucylcbiAgICAgICAgPyBpbnZva2VyRm5zWzBdXG4gICAgICAgIDogaW52b2tlckZuc1xuICAgIClcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gKGZuLl9sZW5ndGggfHwgZm4ubGVuZ3RoKSA+IDFcbiAgfVxufVxuXG5mdW5jdGlvbiBfZW50ZXIgKF8sIHZub2RlKSB7XG4gIGlmICghdm5vZGUuZGF0YS5zaG93KSB7XG4gICAgZW50ZXIodm5vZGUpO1xuICB9XG59XG5cbnZhciB0cmFuc2l0aW9uID0gaW5Ccm93c2VyID8ge1xuICBjcmVhdGU6IF9lbnRlcixcbiAgYWN0aXZhdGU6IF9lbnRlcixcbiAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUkJDEgKHZub2RlLCBybSkge1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgaWYgKCF2bm9kZS5kYXRhLnNob3cpIHtcbiAgICAgIGxlYXZlKHZub2RlLCBybSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJtKCk7XG4gICAgfVxuICB9XG59IDoge307XG5cbnZhciBwbGF0Zm9ybU1vZHVsZXMgPSBbXG4gIGF0dHJzLFxuICBrbGFzcyxcbiAgZXZlbnRzLFxuICBkb21Qcm9wcyxcbiAgc3R5bGUsXG4gIHRyYW5zaXRpb25cbl07XG5cbi8qICAqL1xuXG4vLyB0aGUgZGlyZWN0aXZlIG1vZHVsZSBzaG91bGQgYmUgYXBwbGllZCBsYXN0LCBhZnRlciBhbGxcbi8vIGJ1aWx0LWluIG1vZHVsZXMgaGF2ZSBiZWVuIGFwcGxpZWQuXG52YXIgbW9kdWxlcyA9IHBsYXRmb3JtTW9kdWxlcy5jb25jYXQoYmFzZU1vZHVsZXMpO1xuXG52YXIgcGF0Y2ggPSBjcmVhdGVQYXRjaEZ1bmN0aW9uKHsgbm9kZU9wczogbm9kZU9wcywgbW9kdWxlczogbW9kdWxlcyB9KTtcblxuLyoqXG4gKiBOb3QgdHlwZSBjaGVja2luZyB0aGlzIGZpbGUgYmVjYXVzZSBmbG93IGRvZXNuJ3QgbGlrZSBhdHRhY2hpbmdcbiAqIHByb3BlcnRpZXMgdG8gRWxlbWVudHMuXG4gKi9cblxuLyogaXN0YW5idWwgaWdub3JlIGlmICovXG5pZiAoaXNJRTkpIHtcbiAgLy8gaHR0cDovL3d3dy5tYXR0czQxMS5jb20vcG9zdC9pbnRlcm5ldC1leHBsb3Jlci05LW9uaW5wdXQvXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3NlbGVjdGlvbmNoYW5nZScsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZWwgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuICAgIGlmIChlbCAmJiBlbC52bW9kZWwpIHtcbiAgICAgIHRyaWdnZXIoZWwsICdpbnB1dCcpO1xuICAgIH1cbiAgfSk7XG59XG5cbnZhciBtb2RlbCQxID0ge1xuICBpbnNlcnRlZDogZnVuY3Rpb24gaW5zZXJ0ZWQgKGVsLCBiaW5kaW5nLCB2bm9kZSkge1xuICAgIGlmICh2bm9kZS50YWcgPT09ICdzZWxlY3QnKSB7XG4gICAgICB2YXIgY2IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNldFNlbGVjdGVkKGVsLCBiaW5kaW5nLCB2bm9kZS5jb250ZXh0KTtcbiAgICAgIH07XG4gICAgICBjYigpO1xuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICBpZiAoaXNJRSB8fCBpc0VkZ2UpIHtcbiAgICAgICAgc2V0VGltZW91dChjYiwgMCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh2bm9kZS50YWcgPT09ICd0ZXh0YXJlYScgfHwgZWwudHlwZSA9PT0gJ3RleHQnKSB7XG4gICAgICBlbC5fdk1vZGlmaWVycyA9IGJpbmRpbmcubW9kaWZpZXJzO1xuICAgICAgaWYgKCFiaW5kaW5nLm1vZGlmaWVycy5sYXp5KSB7XG4gICAgICAgIGlmICghaXNBbmRyb2lkKSB7XG4gICAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignY29tcG9zaXRpb25zdGFydCcsIG9uQ29tcG9zaXRpb25TdGFydCk7XG4gICAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignY29tcG9zaXRpb25lbmQnLCBvbkNvbXBvc2l0aW9uRW5kKTtcbiAgICAgICAgfVxuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgICAgaWYgKGlzSUU5KSB7XG4gICAgICAgICAgZWwudm1vZGVsID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgY29tcG9uZW50VXBkYXRlZDogZnVuY3Rpb24gY29tcG9uZW50VXBkYXRlZCAoZWwsIGJpbmRpbmcsIHZub2RlKSB7XG4gICAgaWYgKHZub2RlLnRhZyA9PT0gJ3NlbGVjdCcpIHtcbiAgICAgIHNldFNlbGVjdGVkKGVsLCBiaW5kaW5nLCB2bm9kZS5jb250ZXh0KTtcbiAgICAgIC8vIGluIGNhc2UgdGhlIG9wdGlvbnMgcmVuZGVyZWQgYnkgdi1mb3IgaGF2ZSBjaGFuZ2VkLFxuICAgICAgLy8gaXQncyBwb3NzaWJsZSB0aGF0IHRoZSB2YWx1ZSBpcyBvdXQtb2Ytc3luYyB3aXRoIHRoZSByZW5kZXJlZCBvcHRpb25zLlxuICAgICAgLy8gZGV0ZWN0IHN1Y2ggY2FzZXMgYW5kIGZpbHRlciBvdXQgdmFsdWVzIHRoYXQgbm8gbG9uZ2VyIGhhcyBhIG1hdGNoaW5nXG4gICAgICAvLyBvcHRpb24gaW4gdGhlIERPTS5cbiAgICAgIHZhciBuZWVkUmVzZXQgPSBlbC5tdWx0aXBsZVxuICAgICAgICA/IGJpbmRpbmcudmFsdWUuc29tZShmdW5jdGlvbiAodikgeyByZXR1cm4gaGFzTm9NYXRjaGluZ09wdGlvbih2LCBlbC5vcHRpb25zKTsgfSlcbiAgICAgICAgOiBiaW5kaW5nLnZhbHVlICE9PSBiaW5kaW5nLm9sZFZhbHVlICYmIGhhc05vTWF0Y2hpbmdPcHRpb24oYmluZGluZy52YWx1ZSwgZWwub3B0aW9ucyk7XG4gICAgICBpZiAobmVlZFJlc2V0KSB7XG4gICAgICAgIHRyaWdnZXIoZWwsICdjaGFuZ2UnKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbmZ1bmN0aW9uIHNldFNlbGVjdGVkIChlbCwgYmluZGluZywgdm0pIHtcbiAgdmFyIHZhbHVlID0gYmluZGluZy52YWx1ZTtcbiAgdmFyIGlzTXVsdGlwbGUgPSBlbC5tdWx0aXBsZTtcbiAgaWYgKGlzTXVsdGlwbGUgJiYgIUFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiYgd2FybihcbiAgICAgIFwiPHNlbGVjdCBtdWx0aXBsZSB2LW1vZGVsPVxcXCJcIiArIChiaW5kaW5nLmV4cHJlc3Npb24pICsgXCJcXFwiPiBcIiArXG4gICAgICBcImV4cGVjdHMgYW4gQXJyYXkgdmFsdWUgZm9yIGl0cyBiaW5kaW5nLCBidXQgZ290IFwiICsgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkuc2xpY2UoOCwgLTEpKSxcbiAgICAgIHZtXG4gICAgKTtcbiAgICByZXR1cm5cbiAgfVxuICB2YXIgc2VsZWN0ZWQsIG9wdGlvbjtcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBlbC5vcHRpb25zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIG9wdGlvbiA9IGVsLm9wdGlvbnNbaV07XG4gICAgaWYgKGlzTXVsdGlwbGUpIHtcbiAgICAgIHNlbGVjdGVkID0gbG9vc2VJbmRleE9mKHZhbHVlLCBnZXRWYWx1ZShvcHRpb24pKSA+IC0xO1xuICAgICAgaWYgKG9wdGlvbi5zZWxlY3RlZCAhPT0gc2VsZWN0ZWQpIHtcbiAgICAgICAgb3B0aW9uLnNlbGVjdGVkID0gc2VsZWN0ZWQ7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChsb29zZUVxdWFsKGdldFZhbHVlKG9wdGlvbiksIHZhbHVlKSkge1xuICAgICAgICBpZiAoZWwuc2VsZWN0ZWRJbmRleCAhPT0gaSkge1xuICAgICAgICAgIGVsLnNlbGVjdGVkSW5kZXggPSBpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAoIWlzTXVsdGlwbGUpIHtcbiAgICBlbC5zZWxlY3RlZEluZGV4ID0gLTE7XG4gIH1cbn1cblxuZnVuY3Rpb24gaGFzTm9NYXRjaGluZ09wdGlvbiAodmFsdWUsIG9wdGlvbnMpIHtcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBvcHRpb25zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGlmIChsb29zZUVxdWFsKGdldFZhbHVlKG9wdGlvbnNbaV0pLCB2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZVxufVxuXG5mdW5jdGlvbiBnZXRWYWx1ZSAob3B0aW9uKSB7XG4gIHJldHVybiAnX3ZhbHVlJyBpbiBvcHRpb25cbiAgICA/IG9wdGlvbi5fdmFsdWVcbiAgICA6IG9wdGlvbi52YWx1ZVxufVxuXG5mdW5jdGlvbiBvbkNvbXBvc2l0aW9uU3RhcnQgKGUpIHtcbiAgZS50YXJnZXQuY29tcG9zaW5nID0gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gb25Db21wb3NpdGlvbkVuZCAoZSkge1xuICBlLnRhcmdldC5jb21wb3NpbmcgPSBmYWxzZTtcbiAgdHJpZ2dlcihlLnRhcmdldCwgJ2lucHV0Jyk7XG59XG5cbmZ1bmN0aW9uIHRyaWdnZXIgKGVsLCB0eXBlKSB7XG4gIHZhciBlID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0hUTUxFdmVudHMnKTtcbiAgZS5pbml0RXZlbnQodHlwZSwgdHJ1ZSwgdHJ1ZSk7XG4gIGVsLmRpc3BhdGNoRXZlbnQoZSk7XG59XG5cbi8qICAqL1xuXG4vLyByZWN1cnNpdmVseSBzZWFyY2ggZm9yIHBvc3NpYmxlIHRyYW5zaXRpb24gZGVmaW5lZCBpbnNpZGUgdGhlIGNvbXBvbmVudCByb290XG5mdW5jdGlvbiBsb2NhdGVOb2RlICh2bm9kZSkge1xuICByZXR1cm4gdm5vZGUuY29tcG9uZW50SW5zdGFuY2UgJiYgKCF2bm9kZS5kYXRhIHx8ICF2bm9kZS5kYXRhLnRyYW5zaXRpb24pXG4gICAgPyBsb2NhdGVOb2RlKHZub2RlLmNvbXBvbmVudEluc3RhbmNlLl92bm9kZSlcbiAgICA6IHZub2RlXG59XG5cbnZhciBzaG93ID0ge1xuICBiaW5kOiBmdW5jdGlvbiBiaW5kIChlbCwgcmVmLCB2bm9kZSkge1xuICAgIHZhciB2YWx1ZSA9IHJlZi52YWx1ZTtcblxuICAgIHZub2RlID0gbG9jYXRlTm9kZSh2bm9kZSk7XG4gICAgdmFyIHRyYW5zaXRpb24gPSB2bm9kZS5kYXRhICYmIHZub2RlLmRhdGEudHJhbnNpdGlvbjtcbiAgICB2YXIgb3JpZ2luYWxEaXNwbGF5ID0gZWwuX192T3JpZ2luYWxEaXNwbGF5ID1cbiAgICAgIGVsLnN0eWxlLmRpc3BsYXkgPT09ICdub25lJyA/ICcnIDogZWwuc3R5bGUuZGlzcGxheTtcbiAgICBpZiAodmFsdWUgJiYgdHJhbnNpdGlvbiAmJiAhaXNJRTkpIHtcbiAgICAgIHZub2RlLmRhdGEuc2hvdyA9IHRydWU7XG4gICAgICBlbnRlcih2bm9kZSwgZnVuY3Rpb24gKCkge1xuICAgICAgICBlbC5zdHlsZS5kaXNwbGF5ID0gb3JpZ2luYWxEaXNwbGF5O1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsLnN0eWxlLmRpc3BsYXkgPSB2YWx1ZSA/IG9yaWdpbmFsRGlzcGxheSA6ICdub25lJztcbiAgICB9XG4gIH0sXG5cbiAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUgKGVsLCByZWYsIHZub2RlKSB7XG4gICAgdmFyIHZhbHVlID0gcmVmLnZhbHVlO1xuICAgIHZhciBvbGRWYWx1ZSA9IHJlZi5vbGRWYWx1ZTtcblxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgIGlmICh2YWx1ZSA9PT0gb2xkVmFsdWUpIHsgcmV0dXJuIH1cbiAgICB2bm9kZSA9IGxvY2F0ZU5vZGUodm5vZGUpO1xuICAgIHZhciB0cmFuc2l0aW9uID0gdm5vZGUuZGF0YSAmJiB2bm9kZS5kYXRhLnRyYW5zaXRpb247XG4gICAgaWYgKHRyYW5zaXRpb24gJiYgIWlzSUU5KSB7XG4gICAgICB2bm9kZS5kYXRhLnNob3cgPSB0cnVlO1xuICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgIGVudGVyKHZub2RlLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgZWwuc3R5bGUuZGlzcGxheSA9IGVsLl9fdk9yaWdpbmFsRGlzcGxheTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZWF2ZSh2bm9kZSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGVsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBlbC5zdHlsZS5kaXNwbGF5ID0gdmFsdWUgPyBlbC5fX3ZPcmlnaW5hbERpc3BsYXkgOiAnbm9uZSc7XG4gICAgfVxuICB9LFxuXG4gIHVuYmluZDogZnVuY3Rpb24gdW5iaW5kIChcbiAgICBlbCxcbiAgICBiaW5kaW5nLFxuICAgIHZub2RlLFxuICAgIG9sZFZub2RlLFxuICAgIGlzRGVzdHJveVxuICApIHtcbiAgICBpZiAoIWlzRGVzdHJveSkge1xuICAgICAgZWwuc3R5bGUuZGlzcGxheSA9IGVsLl9fdk9yaWdpbmFsRGlzcGxheTtcbiAgICB9XG4gIH1cbn07XG5cbnZhciBwbGF0Zm9ybURpcmVjdGl2ZXMgPSB7XG4gIG1vZGVsOiBtb2RlbCQxLFxuICBzaG93OiBzaG93XG59O1xuXG4vKiAgKi9cblxuLy8gUHJvdmlkZXMgdHJhbnNpdGlvbiBzdXBwb3J0IGZvciBhIHNpbmdsZSBlbGVtZW50L2NvbXBvbmVudC5cbi8vIHN1cHBvcnRzIHRyYW5zaXRpb24gbW9kZSAob3V0LWluIC8gaW4tb3V0KVxuXG52YXIgdHJhbnNpdGlvblByb3BzID0ge1xuICBuYW1lOiBTdHJpbmcsXG4gIGFwcGVhcjogQm9vbGVhbixcbiAgY3NzOiBCb29sZWFuLFxuICBtb2RlOiBTdHJpbmcsXG4gIHR5cGU6IFN0cmluZyxcbiAgZW50ZXJDbGFzczogU3RyaW5nLFxuICBsZWF2ZUNsYXNzOiBTdHJpbmcsXG4gIGVudGVyVG9DbGFzczogU3RyaW5nLFxuICBsZWF2ZVRvQ2xhc3M6IFN0cmluZyxcbiAgZW50ZXJBY3RpdmVDbGFzczogU3RyaW5nLFxuICBsZWF2ZUFjdGl2ZUNsYXNzOiBTdHJpbmcsXG4gIGFwcGVhckNsYXNzOiBTdHJpbmcsXG4gIGFwcGVhckFjdGl2ZUNsYXNzOiBTdHJpbmcsXG4gIGFwcGVhclRvQ2xhc3M6IFN0cmluZyxcbiAgZHVyYXRpb246IFtOdW1iZXIsIFN0cmluZywgT2JqZWN0XVxufTtcblxuLy8gaW4gY2FzZSB0aGUgY2hpbGQgaXMgYWxzbyBhbiBhYnN0cmFjdCBjb21wb25lbnQsIGUuZy4gPGtlZXAtYWxpdmU+XG4vLyB3ZSB3YW50IHRvIHJlY3Vyc2l2ZWx5IHJldHJpZXZlIHRoZSByZWFsIGNvbXBvbmVudCB0byBiZSByZW5kZXJlZFxuZnVuY3Rpb24gZ2V0UmVhbENoaWxkICh2bm9kZSkge1xuICB2YXIgY29tcE9wdGlvbnMgPSB2bm9kZSAmJiB2bm9kZS5jb21wb25lbnRPcHRpb25zO1xuICBpZiAoY29tcE9wdGlvbnMgJiYgY29tcE9wdGlvbnMuQ3Rvci5vcHRpb25zLmFic3RyYWN0KSB7XG4gICAgcmV0dXJuIGdldFJlYWxDaGlsZChnZXRGaXJzdENvbXBvbmVudENoaWxkKGNvbXBPcHRpb25zLmNoaWxkcmVuKSlcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdm5vZGVcbiAgfVxufVxuXG5mdW5jdGlvbiBleHRyYWN0VHJhbnNpdGlvbkRhdGEgKGNvbXApIHtcbiAgdmFyIGRhdGEgPSB7fTtcbiAgdmFyIG9wdGlvbnMgPSBjb21wLiRvcHRpb25zO1xuICAvLyBwcm9wc1xuICBmb3IgKHZhciBrZXkgaW4gb3B0aW9ucy5wcm9wc0RhdGEpIHtcbiAgICBkYXRhW2tleV0gPSBjb21wW2tleV07XG4gIH1cbiAgLy8gZXZlbnRzLlxuICAvLyBleHRyYWN0IGxpc3RlbmVycyBhbmQgcGFzcyB0aGVtIGRpcmVjdGx5IHRvIHRoZSB0cmFuc2l0aW9uIG1ldGhvZHNcbiAgdmFyIGxpc3RlbmVycyA9IG9wdGlvbnMuX3BhcmVudExpc3RlbmVycztcbiAgZm9yICh2YXIga2V5JDEgaW4gbGlzdGVuZXJzKSB7XG4gICAgZGF0YVtjYW1lbGl6ZShrZXkkMSldID0gbGlzdGVuZXJzW2tleSQxXTtcbiAgfVxuICByZXR1cm4gZGF0YVxufVxuXG5mdW5jdGlvbiBwbGFjZWhvbGRlciAoaCwgcmF3Q2hpbGQpIHtcbiAgcmV0dXJuIC9cXGQta2VlcC1hbGl2ZSQvLnRlc3QocmF3Q2hpbGQudGFnKVxuICAgID8gaCgna2VlcC1hbGl2ZScpXG4gICAgOiBudWxsXG59XG5cbmZ1bmN0aW9uIGhhc1BhcmVudFRyYW5zaXRpb24gKHZub2RlKSB7XG4gIHdoaWxlICgodm5vZGUgPSB2bm9kZS5wYXJlbnQpKSB7XG4gICAgaWYgKHZub2RlLmRhdGEudHJhbnNpdGlvbikge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gaXNTYW1lQ2hpbGQgKGNoaWxkLCBvbGRDaGlsZCkge1xuICByZXR1cm4gb2xkQ2hpbGQua2V5ID09PSBjaGlsZC5rZXkgJiYgb2xkQ2hpbGQudGFnID09PSBjaGlsZC50YWdcbn1cblxudmFyIFRyYW5zaXRpb24gPSB7XG4gIG5hbWU6ICd0cmFuc2l0aW9uJyxcbiAgcHJvcHM6IHRyYW5zaXRpb25Qcm9wcyxcbiAgYWJzdHJhY3Q6IHRydWUsXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIgKGgpIHtcbiAgICB2YXIgdGhpcyQxID0gdGhpcztcblxuICAgIHZhciBjaGlsZHJlbiA9IHRoaXMuJHNsb3RzLmRlZmF1bHQ7XG4gICAgaWYgKCFjaGlsZHJlbikge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gZmlsdGVyIG91dCB0ZXh0IG5vZGVzIChwb3NzaWJsZSB3aGl0ZXNwYWNlcylcbiAgICBjaGlsZHJlbiA9IGNoaWxkcmVuLmZpbHRlcihmdW5jdGlvbiAoYykgeyByZXR1cm4gYy50YWc7IH0pO1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgIGlmICghY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICAvLyB3YXJuIG11bHRpcGxlIGVsZW1lbnRzXG4gICAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmIGNoaWxkcmVuLmxlbmd0aCA+IDEpIHtcbiAgICAgIHdhcm4oXG4gICAgICAgICc8dHJhbnNpdGlvbj4gY2FuIG9ubHkgYmUgdXNlZCBvbiBhIHNpbmdsZSBlbGVtZW50LiBVc2UgJyArXG4gICAgICAgICc8dHJhbnNpdGlvbi1ncm91cD4gZm9yIGxpc3RzLicsXG4gICAgICAgIHRoaXMuJHBhcmVudFxuICAgICAgKTtcbiAgICB9XG5cbiAgICB2YXIgbW9kZSA9IHRoaXMubW9kZTtcblxuICAgIC8vIHdhcm4gaW52YWxpZCBtb2RlXG4gICAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmXG4gICAgICAgIG1vZGUgJiYgbW9kZSAhPT0gJ2luLW91dCcgJiYgbW9kZSAhPT0gJ291dC1pbicpIHtcbiAgICAgIHdhcm4oXG4gICAgICAgICdpbnZhbGlkIDx0cmFuc2l0aW9uPiBtb2RlOiAnICsgbW9kZSxcbiAgICAgICAgdGhpcy4kcGFyZW50XG4gICAgICApO1xuICAgIH1cblxuICAgIHZhciByYXdDaGlsZCA9IGNoaWxkcmVuWzBdO1xuXG4gICAgLy8gaWYgdGhpcyBpcyBhIGNvbXBvbmVudCByb290IG5vZGUgYW5kIHRoZSBjb21wb25lbnQnc1xuICAgIC8vIHBhcmVudCBjb250YWluZXIgbm9kZSBhbHNvIGhhcyB0cmFuc2l0aW9uLCBza2lwLlxuICAgIGlmIChoYXNQYXJlbnRUcmFuc2l0aW9uKHRoaXMuJHZub2RlKSkge1xuICAgICAgcmV0dXJuIHJhd0NoaWxkXG4gICAgfVxuXG4gICAgLy8gYXBwbHkgdHJhbnNpdGlvbiBkYXRhIHRvIGNoaWxkXG4gICAgLy8gdXNlIGdldFJlYWxDaGlsZCgpIHRvIGlnbm9yZSBhYnN0cmFjdCBjb21wb25lbnRzIGUuZy4ga2VlcC1hbGl2ZVxuICAgIHZhciBjaGlsZCA9IGdldFJlYWxDaGlsZChyYXdDaGlsZCk7XG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgaWYgKCFjaGlsZCkge1xuICAgICAgcmV0dXJuIHJhd0NoaWxkXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2xlYXZpbmcpIHtcbiAgICAgIHJldHVybiBwbGFjZWhvbGRlcihoLCByYXdDaGlsZClcbiAgICB9XG5cbiAgICAvLyBlbnN1cmUgYSBrZXkgdGhhdCBpcyB1bmlxdWUgdG8gdGhlIHZub2RlIHR5cGUgYW5kIHRvIHRoaXMgdHJhbnNpdGlvblxuICAgIC8vIGNvbXBvbmVudCBpbnN0YW5jZS4gVGhpcyBrZXkgd2lsbCBiZSB1c2VkIHRvIHJlbW92ZSBwZW5kaW5nIGxlYXZpbmcgbm9kZXNcbiAgICAvLyBkdXJpbmcgZW50ZXJpbmcuXG4gICAgdmFyIGlkID0gXCJfX3RyYW5zaXRpb24tXCIgKyAodGhpcy5fdWlkKSArIFwiLVwiO1xuICAgIGNoaWxkLmtleSA9IGNoaWxkLmtleSA9PSBudWxsXG4gICAgICA/IGlkICsgY2hpbGQudGFnXG4gICAgICA6IGlzUHJpbWl0aXZlKGNoaWxkLmtleSlcbiAgICAgICAgPyAoU3RyaW5nKGNoaWxkLmtleSkuaW5kZXhPZihpZCkgPT09IDAgPyBjaGlsZC5rZXkgOiBpZCArIGNoaWxkLmtleSlcbiAgICAgICAgOiBjaGlsZC5rZXk7XG5cbiAgICB2YXIgZGF0YSA9IChjaGlsZC5kYXRhIHx8IChjaGlsZC5kYXRhID0ge30pKS50cmFuc2l0aW9uID0gZXh0cmFjdFRyYW5zaXRpb25EYXRhKHRoaXMpO1xuICAgIHZhciBvbGRSYXdDaGlsZCA9IHRoaXMuX3Zub2RlO1xuICAgIHZhciBvbGRDaGlsZCA9IGdldFJlYWxDaGlsZChvbGRSYXdDaGlsZCk7XG5cbiAgICAvLyBtYXJrIHYtc2hvd1xuICAgIC8vIHNvIHRoYXQgdGhlIHRyYW5zaXRpb24gbW9kdWxlIGNhbiBoYW5kIG92ZXIgdGhlIGNvbnRyb2wgdG8gdGhlIGRpcmVjdGl2ZVxuICAgIGlmIChjaGlsZC5kYXRhLmRpcmVjdGl2ZXMgJiYgY2hpbGQuZGF0YS5kaXJlY3RpdmVzLnNvbWUoZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGQubmFtZSA9PT0gJ3Nob3cnOyB9KSkge1xuICAgICAgY2hpbGQuZGF0YS5zaG93ID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAob2xkQ2hpbGQgJiYgb2xkQ2hpbGQuZGF0YSAmJiAhaXNTYW1lQ2hpbGQoY2hpbGQsIG9sZENoaWxkKSkge1xuICAgICAgLy8gcmVwbGFjZSBvbGQgY2hpbGQgdHJhbnNpdGlvbiBkYXRhIHdpdGggZnJlc2ggb25lXG4gICAgICAvLyBpbXBvcnRhbnQgZm9yIGR5bmFtaWMgdHJhbnNpdGlvbnMhXG4gICAgICB2YXIgb2xkRGF0YSA9IG9sZENoaWxkICYmIChvbGRDaGlsZC5kYXRhLnRyYW5zaXRpb24gPSBleHRlbmQoe30sIGRhdGEpKTtcbiAgICAgIC8vIGhhbmRsZSB0cmFuc2l0aW9uIG1vZGVcbiAgICAgIGlmIChtb2RlID09PSAnb3V0LWluJykge1xuICAgICAgICAvLyByZXR1cm4gcGxhY2Vob2xkZXIgbm9kZSBhbmQgcXVldWUgdXBkYXRlIHdoZW4gbGVhdmUgZmluaXNoZXNcbiAgICAgICAgdGhpcy5fbGVhdmluZyA9IHRydWU7XG4gICAgICAgIG1lcmdlVk5vZGVIb29rKG9sZERhdGEsICdhZnRlckxlYXZlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHRoaXMkMS5fbGVhdmluZyA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMkMS4kZm9yY2VVcGRhdGUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwbGFjZWhvbGRlcihoLCByYXdDaGlsZClcbiAgICAgIH0gZWxzZSBpZiAobW9kZSA9PT0gJ2luLW91dCcpIHtcbiAgICAgICAgdmFyIGRlbGF5ZWRMZWF2ZTtcbiAgICAgICAgdmFyIHBlcmZvcm1MZWF2ZSA9IGZ1bmN0aW9uICgpIHsgZGVsYXllZExlYXZlKCk7IH07XG4gICAgICAgIG1lcmdlVk5vZGVIb29rKGRhdGEsICdhZnRlckVudGVyJywgcGVyZm9ybUxlYXZlKTtcbiAgICAgICAgbWVyZ2VWTm9kZUhvb2soZGF0YSwgJ2VudGVyQ2FuY2VsbGVkJywgcGVyZm9ybUxlYXZlKTtcbiAgICAgICAgbWVyZ2VWTm9kZUhvb2sob2xkRGF0YSwgJ2RlbGF5TGVhdmUnLCBmdW5jdGlvbiAobGVhdmUpIHsgZGVsYXllZExlYXZlID0gbGVhdmU7IH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByYXdDaGlsZFxuICB9XG59O1xuXG4vKiAgKi9cblxuLy8gUHJvdmlkZXMgdHJhbnNpdGlvbiBzdXBwb3J0IGZvciBsaXN0IGl0ZW1zLlxuLy8gc3VwcG9ydHMgbW92ZSB0cmFuc2l0aW9ucyB1c2luZyB0aGUgRkxJUCB0ZWNobmlxdWUuXG5cbi8vIEJlY2F1c2UgdGhlIHZkb20ncyBjaGlsZHJlbiB1cGRhdGUgYWxnb3JpdGhtIGlzIFwidW5zdGFibGVcIiAtIGkuZS5cbi8vIGl0IGRvZXNuJ3QgZ3VhcmFudGVlIHRoZSByZWxhdGl2ZSBwb3NpdGlvbmluZyBvZiByZW1vdmVkIGVsZW1lbnRzLFxuLy8gd2UgZm9yY2UgdHJhbnNpdGlvbi1ncm91cCB0byB1cGRhdGUgaXRzIGNoaWxkcmVuIGludG8gdHdvIHBhc3Nlczpcbi8vIGluIHRoZSBmaXJzdCBwYXNzLCB3ZSByZW1vdmUgYWxsIG5vZGVzIHRoYXQgbmVlZCB0byBiZSByZW1vdmVkLFxuLy8gdHJpZ2dlcmluZyB0aGVpciBsZWF2aW5nIHRyYW5zaXRpb247IGluIHRoZSBzZWNvbmQgcGFzcywgd2UgaW5zZXJ0L21vdmVcbi8vIGludG8gdGhlIGZpbmFsIGRlc2lyZWQgc3RhdGUuIFRoaXMgd2F5IGluIHRoZSBzZWNvbmQgcGFzcyByZW1vdmVkXG4vLyBub2RlcyB3aWxsIHJlbWFpbiB3aGVyZSB0aGV5IHNob3VsZCBiZS5cblxudmFyIHByb3BzID0gZXh0ZW5kKHtcbiAgdGFnOiBTdHJpbmcsXG4gIG1vdmVDbGFzczogU3RyaW5nXG59LCB0cmFuc2l0aW9uUHJvcHMpO1xuXG5kZWxldGUgcHJvcHMubW9kZTtcblxudmFyIFRyYW5zaXRpb25Hcm91cCA9IHtcbiAgcHJvcHM6IHByb3BzLFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyIChoKSB7XG4gICAgdmFyIHRhZyA9IHRoaXMudGFnIHx8IHRoaXMuJHZub2RlLmRhdGEudGFnIHx8ICdzcGFuJztcbiAgICB2YXIgbWFwID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICB2YXIgcHJldkNoaWxkcmVuID0gdGhpcy5wcmV2Q2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuO1xuICAgIHZhciByYXdDaGlsZHJlbiA9IHRoaXMuJHNsb3RzLmRlZmF1bHQgfHwgW107XG4gICAgdmFyIGNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbiA9IFtdO1xuICAgIHZhciB0cmFuc2l0aW9uRGF0YSA9IGV4dHJhY3RUcmFuc2l0aW9uRGF0YSh0aGlzKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmF3Q2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBjID0gcmF3Q2hpbGRyZW5baV07XG4gICAgICBpZiAoYy50YWcpIHtcbiAgICAgICAgaWYgKGMua2V5ICE9IG51bGwgJiYgU3RyaW5nKGMua2V5KS5pbmRleE9mKCdfX3ZsaXN0JykgIT09IDApIHtcbiAgICAgICAgICBjaGlsZHJlbi5wdXNoKGMpO1xuICAgICAgICAgIG1hcFtjLmtleV0gPSBjXG4gICAgICAgICAgOyhjLmRhdGEgfHwgKGMuZGF0YSA9IHt9KSkudHJhbnNpdGlvbiA9IHRyYW5zaXRpb25EYXRhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBvcHRzID0gYy5jb21wb25lbnRPcHRpb25zO1xuICAgICAgICAgIHZhciBuYW1lID0gb3B0cyA/IChvcHRzLkN0b3Iub3B0aW9ucy5uYW1lIHx8IG9wdHMudGFnIHx8ICcnKSA6IGMudGFnO1xuICAgICAgICAgIHdhcm4oKFwiPHRyYW5zaXRpb24tZ3JvdXA+IGNoaWxkcmVuIG11c3QgYmUga2V5ZWQ6IDxcIiArIG5hbWUgKyBcIj5cIikpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHByZXZDaGlsZHJlbikge1xuICAgICAgdmFyIGtlcHQgPSBbXTtcbiAgICAgIHZhciByZW1vdmVkID0gW107XG4gICAgICBmb3IgKHZhciBpJDEgPSAwOyBpJDEgPCBwcmV2Q2hpbGRyZW4ubGVuZ3RoOyBpJDErKykge1xuICAgICAgICB2YXIgYyQxID0gcHJldkNoaWxkcmVuW2kkMV07XG4gICAgICAgIGMkMS5kYXRhLnRyYW5zaXRpb24gPSB0cmFuc2l0aW9uRGF0YTtcbiAgICAgICAgYyQxLmRhdGEucG9zID0gYyQxLmVsbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgaWYgKG1hcFtjJDEua2V5XSkge1xuICAgICAgICAgIGtlcHQucHVzaChjJDEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlbW92ZWQucHVzaChjJDEpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLmtlcHQgPSBoKHRhZywgbnVsbCwga2VwdCk7XG4gICAgICB0aGlzLnJlbW92ZWQgPSByZW1vdmVkO1xuICAgIH1cblxuICAgIHJldHVybiBoKHRhZywgbnVsbCwgY2hpbGRyZW4pXG4gIH0sXG5cbiAgYmVmb3JlVXBkYXRlOiBmdW5jdGlvbiBiZWZvcmVVcGRhdGUgKCkge1xuICAgIC8vIGZvcmNlIHJlbW92aW5nIHBhc3NcbiAgICB0aGlzLl9fcGF0Y2hfXyhcbiAgICAgIHRoaXMuX3Zub2RlLFxuICAgICAgdGhpcy5rZXB0LFxuICAgICAgZmFsc2UsIC8vIGh5ZHJhdGluZ1xuICAgICAgdHJ1ZSAvLyByZW1vdmVPbmx5ICghaW1wb3J0YW50LCBhdm9pZHMgdW5uZWNlc3NhcnkgbW92ZXMpXG4gICAgKTtcbiAgICB0aGlzLl92bm9kZSA9IHRoaXMua2VwdDtcbiAgfSxcblxuICB1cGRhdGVkOiBmdW5jdGlvbiB1cGRhdGVkICgpIHtcbiAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLnByZXZDaGlsZHJlbjtcbiAgICB2YXIgbW92ZUNsYXNzID0gdGhpcy5tb3ZlQ2xhc3MgfHwgKCh0aGlzLm5hbWUgfHwgJ3YnKSArICctbW92ZScpO1xuICAgIGlmICghY2hpbGRyZW4ubGVuZ3RoIHx8ICF0aGlzLmhhc01vdmUoY2hpbGRyZW5bMF0uZWxtLCBtb3ZlQ2xhc3MpKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICAvLyB3ZSBkaXZpZGUgdGhlIHdvcmsgaW50byB0aHJlZSBsb29wcyB0byBhdm9pZCBtaXhpbmcgRE9NIHJlYWRzIGFuZCB3cml0ZXNcbiAgICAvLyBpbiBlYWNoIGl0ZXJhdGlvbiAtIHdoaWNoIGhlbHBzIHByZXZlbnQgbGF5b3V0IHRocmFzaGluZy5cbiAgICBjaGlsZHJlbi5mb3JFYWNoKGNhbGxQZW5kaW5nQ2JzKTtcbiAgICBjaGlsZHJlbi5mb3JFYWNoKHJlY29yZFBvc2l0aW9uKTtcbiAgICBjaGlsZHJlbi5mb3JFYWNoKGFwcGx5VHJhbnNsYXRpb24pO1xuXG4gICAgLy8gZm9yY2UgcmVmbG93IHRvIHB1dCBldmVyeXRoaW5nIGluIHBvc2l0aW9uXG4gICAgdmFyIGJvZHkgPSBkb2N1bWVudC5ib2R5O1xuICAgIHZhciBmID0gYm9keS5vZmZzZXRIZWlnaHQ7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcblxuICAgIGNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24gKGMpIHtcbiAgICAgIGlmIChjLmRhdGEubW92ZWQpIHtcbiAgICAgICAgdmFyIGVsID0gYy5lbG07XG4gICAgICAgIHZhciBzID0gZWwuc3R5bGU7XG4gICAgICAgIGFkZFRyYW5zaXRpb25DbGFzcyhlbCwgbW92ZUNsYXNzKTtcbiAgICAgICAgcy50cmFuc2Zvcm0gPSBzLldlYmtpdFRyYW5zZm9ybSA9IHMudHJhbnNpdGlvbkR1cmF0aW9uID0gJyc7XG4gICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIodHJhbnNpdGlvbkVuZEV2ZW50LCBlbC5fbW92ZUNiID0gZnVuY3Rpb24gY2IgKGUpIHtcbiAgICAgICAgICBpZiAoIWUgfHwgL3RyYW5zZm9ybSQvLnRlc3QoZS5wcm9wZXJ0eU5hbWUpKSB7XG4gICAgICAgICAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKHRyYW5zaXRpb25FbmRFdmVudCwgY2IpO1xuICAgICAgICAgICAgZWwuX21vdmVDYiA9IG51bGw7XG4gICAgICAgICAgICByZW1vdmVUcmFuc2l0aW9uQ2xhc3MoZWwsIG1vdmVDbGFzcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcblxuICBtZXRob2RzOiB7XG4gICAgaGFzTW92ZTogZnVuY3Rpb24gaGFzTW92ZSAoZWwsIG1vdmVDbGFzcykge1xuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICBpZiAoIWhhc1RyYW5zaXRpb24pIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgICBpZiAodGhpcy5faGFzTW92ZSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9oYXNNb3ZlXG4gICAgICB9XG4gICAgICAvLyBEZXRlY3Qgd2hldGhlciBhbiBlbGVtZW50IHdpdGggdGhlIG1vdmUgY2xhc3MgYXBwbGllZCBoYXNcbiAgICAgIC8vIENTUyB0cmFuc2l0aW9ucy4gU2luY2UgdGhlIGVsZW1lbnQgbWF5IGJlIGluc2lkZSBhbiBlbnRlcmluZ1xuICAgICAgLy8gdHJhbnNpdGlvbiBhdCB0aGlzIHZlcnkgbW9tZW50LCB3ZSBtYWtlIGEgY2xvbmUgb2YgaXQgYW5kIHJlbW92ZVxuICAgICAgLy8gYWxsIG90aGVyIHRyYW5zaXRpb24gY2xhc3NlcyBhcHBsaWVkIHRvIGVuc3VyZSBvbmx5IHRoZSBtb3ZlIGNsYXNzXG4gICAgICAvLyBpcyBhcHBsaWVkLlxuICAgICAgdmFyIGNsb25lID0gZWwuY2xvbmVOb2RlKCk7XG4gICAgICBpZiAoZWwuX3RyYW5zaXRpb25DbGFzc2VzKSB7XG4gICAgICAgIGVsLl90cmFuc2l0aW9uQ2xhc3Nlcy5mb3JFYWNoKGZ1bmN0aW9uIChjbHMpIHsgcmVtb3ZlQ2xhc3MoY2xvbmUsIGNscyk7IH0pO1xuICAgICAgfVxuICAgICAgYWRkQ2xhc3MoY2xvbmUsIG1vdmVDbGFzcyk7XG4gICAgICBjbG9uZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQoY2xvbmUpO1xuICAgICAgdmFyIGluZm8gPSBnZXRUcmFuc2l0aW9uSW5mbyhjbG9uZSk7XG4gICAgICB0aGlzLiRlbC5yZW1vdmVDaGlsZChjbG9uZSk7XG4gICAgICByZXR1cm4gKHRoaXMuX2hhc01vdmUgPSBpbmZvLmhhc1RyYW5zZm9ybSlcbiAgICB9XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGNhbGxQZW5kaW5nQ2JzIChjKSB7XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICBpZiAoYy5lbG0uX21vdmVDYikge1xuICAgIGMuZWxtLl9tb3ZlQ2IoKTtcbiAgfVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgaWYgKGMuZWxtLl9lbnRlckNiKSB7XG4gICAgYy5lbG0uX2VudGVyQ2IoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZWNvcmRQb3NpdGlvbiAoYykge1xuICBjLmRhdGEubmV3UG9zID0gYy5lbG0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG59XG5cbmZ1bmN0aW9uIGFwcGx5VHJhbnNsYXRpb24gKGMpIHtcbiAgdmFyIG9sZFBvcyA9IGMuZGF0YS5wb3M7XG4gIHZhciBuZXdQb3MgPSBjLmRhdGEubmV3UG9zO1xuICB2YXIgZHggPSBvbGRQb3MubGVmdCAtIG5ld1Bvcy5sZWZ0O1xuICB2YXIgZHkgPSBvbGRQb3MudG9wIC0gbmV3UG9zLnRvcDtcbiAgaWYgKGR4IHx8IGR5KSB7XG4gICAgYy5kYXRhLm1vdmVkID0gdHJ1ZTtcbiAgICB2YXIgcyA9IGMuZWxtLnN0eWxlO1xuICAgIHMudHJhbnNmb3JtID0gcy5XZWJraXRUcmFuc2Zvcm0gPSBcInRyYW5zbGF0ZShcIiArIGR4ICsgXCJweCxcIiArIGR5ICsgXCJweClcIjtcbiAgICBzLnRyYW5zaXRpb25EdXJhdGlvbiA9ICcwcyc7XG4gIH1cbn1cblxudmFyIHBsYXRmb3JtQ29tcG9uZW50cyA9IHtcbiAgVHJhbnNpdGlvbjogVHJhbnNpdGlvbixcbiAgVHJhbnNpdGlvbkdyb3VwOiBUcmFuc2l0aW9uR3JvdXBcbn07XG5cbi8qICAqL1xuXG4vLyBpbnN0YWxsIHBsYXRmb3JtIHNwZWNpZmljIHV0aWxzXG5WdWUkMy5jb25maWcubXVzdFVzZVByb3AgPSBtdXN0VXNlUHJvcDtcblZ1ZSQzLmNvbmZpZy5pc1Jlc2VydmVkVGFnID0gaXNSZXNlcnZlZFRhZztcblZ1ZSQzLmNvbmZpZy5nZXRUYWdOYW1lc3BhY2UgPSBnZXRUYWdOYW1lc3BhY2U7XG5WdWUkMy5jb25maWcuaXNVbmtub3duRWxlbWVudCA9IGlzVW5rbm93bkVsZW1lbnQ7XG5cbi8vIGluc3RhbGwgcGxhdGZvcm0gcnVudGltZSBkaXJlY3RpdmVzICYgY29tcG9uZW50c1xuZXh0ZW5kKFZ1ZSQzLm9wdGlvbnMuZGlyZWN0aXZlcywgcGxhdGZvcm1EaXJlY3RpdmVzKTtcbmV4dGVuZChWdWUkMy5vcHRpb25zLmNvbXBvbmVudHMsIHBsYXRmb3JtQ29tcG9uZW50cyk7XG5cbi8vIGluc3RhbGwgcGxhdGZvcm0gcGF0Y2ggZnVuY3Rpb25cblZ1ZSQzLnByb3RvdHlwZS5fX3BhdGNoX18gPSBpbkJyb3dzZXIgPyBwYXRjaCA6IG5vb3A7XG5cbi8vIHB1YmxpYyBtb3VudCBtZXRob2RcblZ1ZSQzLnByb3RvdHlwZS4kbW91bnQgPSBmdW5jdGlvbiAoXG4gIGVsLFxuICBoeWRyYXRpbmdcbikge1xuICBlbCA9IGVsICYmIGluQnJvd3NlciA/IHF1ZXJ5KGVsKSA6IHVuZGVmaW5lZDtcbiAgcmV0dXJuIG1vdW50Q29tcG9uZW50KHRoaXMsIGVsLCBoeWRyYXRpbmcpXG59O1xuXG4vLyBkZXZ0b29scyBnbG9iYWwgaG9va1xuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICBpZiAoY29uZmlnLmRldnRvb2xzKSB7XG4gICAgaWYgKGRldnRvb2xzKSB7XG4gICAgICBkZXZ0b29scy5lbWl0KCdpbml0JywgVnVlJDMpO1xuICAgIH0gZWxzZSBpZiAoXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiYgaXNDaHJvbWUpIHtcbiAgICAgIGNvbnNvbGVbY29uc29sZS5pbmZvID8gJ2luZm8nIDogJ2xvZyddKFxuICAgICAgICAnRG93bmxvYWQgdGhlIFZ1ZSBEZXZ0b29scyBleHRlbnNpb24gZm9yIGEgYmV0dGVyIGRldmVsb3BtZW50IGV4cGVyaWVuY2U6XFxuJyArXG4gICAgICAgICdodHRwczovL2dpdGh1Yi5jb20vdnVlanMvdnVlLWRldnRvb2xzJ1xuICAgICAgKTtcbiAgICB9XG4gIH1cbiAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmXG4gICAgICBjb25maWcucHJvZHVjdGlvblRpcCAhPT0gZmFsc2UgJiZcbiAgICAgIGluQnJvd3NlciAmJiB0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBjb25zb2xlW2NvbnNvbGUuaW5mbyA/ICdpbmZvJyA6ICdsb2cnXShcbiAgICAgIFwiWW91IGFyZSBydW5uaW5nIFZ1ZSBpbiBkZXZlbG9wbWVudCBtb2RlLlxcblwiICtcbiAgICAgIFwiTWFrZSBzdXJlIHRvIHR1cm4gb24gcHJvZHVjdGlvbiBtb2RlIHdoZW4gZGVwbG95aW5nIGZvciBwcm9kdWN0aW9uLlxcblwiICtcbiAgICAgIFwiU2VlIG1vcmUgdGlwcyBhdCBodHRwczovL3Z1ZWpzLm9yZy9ndWlkZS9kZXBsb3ltZW50Lmh0bWxcIlxuICAgICk7XG4gIH1cbn0sIDApO1xuXG4vKiAgKi9cblxuLy8gY2hlY2sgd2hldGhlciBjdXJyZW50IGJyb3dzZXIgZW5jb2RlcyBhIGNoYXIgaW5zaWRlIGF0dHJpYnV0ZSB2YWx1ZXNcbmZ1bmN0aW9uIHNob3VsZERlY29kZSAoY29udGVudCwgZW5jb2RlZCkge1xuICB2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGRpdi5pbm5lckhUTUwgPSBcIjxkaXYgYT1cXFwiXCIgKyBjb250ZW50ICsgXCJcXFwiPlwiO1xuICByZXR1cm4gZGl2LmlubmVySFRNTC5pbmRleE9mKGVuY29kZWQpID4gMFxufVxuXG4vLyAjMzY2M1xuLy8gSUUgZW5jb2RlcyBuZXdsaW5lcyBpbnNpZGUgYXR0cmlidXRlIHZhbHVlcyB3aGlsZSBvdGhlciBicm93c2VycyBkb24ndFxudmFyIHNob3VsZERlY29kZU5ld2xpbmVzID0gaW5Ccm93c2VyID8gc2hvdWxkRGVjb2RlKCdcXG4nLCAnJiMxMDsnKSA6IGZhbHNlO1xuXG4vKiAgKi9cblxudmFyIGlzVW5hcnlUYWcgPSBtYWtlTWFwKFxuICAnYXJlYSxiYXNlLGJyLGNvbCxlbWJlZCxmcmFtZSxocixpbWcsaW5wdXQsaXNpbmRleCxrZXlnZW4sJyArXG4gICdsaW5rLG1ldGEscGFyYW0sc291cmNlLHRyYWNrLHdicidcbik7XG5cbi8vIEVsZW1lbnRzIHRoYXQgeW91IGNhbiwgaW50ZW50aW9uYWxseSwgbGVhdmUgb3BlblxuLy8gKGFuZCB3aGljaCBjbG9zZSB0aGVtc2VsdmVzKVxudmFyIGNhbkJlTGVmdE9wZW5UYWcgPSBtYWtlTWFwKFxuICAnY29sZ3JvdXAsZGQsZHQsbGksb3B0aW9ucyxwLHRkLHRmb290LHRoLHRoZWFkLHRyLHNvdXJjZSdcbik7XG5cbi8vIEhUTUw1IHRhZ3MgaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2UvaW5kaWNlcy5odG1sI2VsZW1lbnRzLTNcbi8vIFBocmFzaW5nIENvbnRlbnQgaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2UvZG9tLmh0bWwjcGhyYXNpbmctY29udGVudFxudmFyIGlzTm9uUGhyYXNpbmdUYWcgPSBtYWtlTWFwKFxuICAnYWRkcmVzcyxhcnRpY2xlLGFzaWRlLGJhc2UsYmxvY2txdW90ZSxib2R5LGNhcHRpb24sY29sLGNvbGdyb3VwLGRkLCcgK1xuICAnZGV0YWlscyxkaWFsb2csZGl2LGRsLGR0LGZpZWxkc2V0LGZpZ2NhcHRpb24sZmlndXJlLGZvb3Rlcixmb3JtLCcgK1xuICAnaDEsaDIsaDMsaDQsaDUsaDYsaGVhZCxoZWFkZXIsaGdyb3VwLGhyLGh0bWwsbGVnZW5kLGxpLG1lbnVpdGVtLG1ldGEsJyArXG4gICdvcHRncm91cCxvcHRpb24scGFyYW0scnAscnQsc291cmNlLHN0eWxlLHN1bW1hcnksdGJvZHksdGQsdGZvb3QsdGgsdGhlYWQsJyArXG4gICd0aXRsZSx0cix0cmFjaydcbik7XG5cbi8qICAqL1xuXG52YXIgZGVjb2RlcjtcblxuZnVuY3Rpb24gZGVjb2RlIChodG1sKSB7XG4gIGRlY29kZXIgPSBkZWNvZGVyIHx8IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBkZWNvZGVyLmlubmVySFRNTCA9IGh0bWw7XG4gIHJldHVybiBkZWNvZGVyLnRleHRDb250ZW50XG59XG5cbi8qKlxuICogTm90IHR5cGUtY2hlY2tpbmcgdGhpcyBmaWxlIGJlY2F1c2UgaXQncyBtb3N0bHkgdmVuZG9yIGNvZGUuXG4gKi9cblxuLyohXG4gKiBIVE1MIFBhcnNlciBCeSBKb2huIFJlc2lnIChlam9obi5vcmcpXG4gKiBNb2RpZmllZCBieSBKdXJpeSBcImthbmdheFwiIFpheXRzZXZcbiAqIE9yaWdpbmFsIGNvZGUgYnkgRXJpayBBcnZpZHNzb24sIE1vemlsbGEgUHVibGljIExpY2Vuc2VcbiAqIGh0dHA6Ly9lcmlrLmVhZS5uZXQvc2ltcGxlaHRtbHBhcnNlci9zaW1wbGVodG1scGFyc2VyLmpzXG4gKi9cblxuLy8gUmVndWxhciBFeHByZXNzaW9ucyBmb3IgcGFyc2luZyB0YWdzIGFuZCBhdHRyaWJ1dGVzXG52YXIgc2luZ2xlQXR0cklkZW50aWZpZXIgPSAvKFteXFxzXCInPD4vPV0rKS87XG52YXIgc2luZ2xlQXR0ckFzc2lnbiA9IC8oPzo9KS87XG52YXIgc2luZ2xlQXR0clZhbHVlcyA9IFtcbiAgLy8gYXR0ciB2YWx1ZSBkb3VibGUgcXVvdGVzXG4gIC9cIihbXlwiXSopXCIrLy5zb3VyY2UsXG4gIC8vIGF0dHIgdmFsdWUsIHNpbmdsZSBxdW90ZXNcbiAgLycoW14nXSopJysvLnNvdXJjZSxcbiAgLy8gYXR0ciB2YWx1ZSwgbm8gcXVvdGVzXG4gIC8oW15cXHNcIic9PD5gXSspLy5zb3VyY2Vcbl07XG52YXIgYXR0cmlidXRlID0gbmV3IFJlZ0V4cChcbiAgJ15cXFxccyonICsgc2luZ2xlQXR0cklkZW50aWZpZXIuc291cmNlICtcbiAgJyg/OlxcXFxzKignICsgc2luZ2xlQXR0ckFzc2lnbi5zb3VyY2UgKyAnKScgK1xuICAnXFxcXHMqKD86JyArIHNpbmdsZUF0dHJWYWx1ZXMuam9pbignfCcpICsgJykpPydcbik7XG5cbi8vIGNvdWxkIHVzZSBodHRwczovL3d3dy53My5vcmcvVFIvMTk5OS9SRUMteG1sLW5hbWVzLTE5OTkwMTE0LyNOVC1RTmFtZVxuLy8gYnV0IGZvciBWdWUgdGVtcGxhdGVzIHdlIGNhbiBlbmZvcmNlIGEgc2ltcGxlIGNoYXJzZXRcbnZhciBuY25hbWUgPSAnW2EtekEtWl9dW1xcXFx3XFxcXC1cXFxcLl0qJztcbnZhciBxbmFtZUNhcHR1cmUgPSAnKCg/OicgKyBuY25hbWUgKyAnXFxcXDopPycgKyBuY25hbWUgKyAnKSc7XG52YXIgc3RhcnRUYWdPcGVuID0gbmV3IFJlZ0V4cCgnXjwnICsgcW5hbWVDYXB0dXJlKTtcbnZhciBzdGFydFRhZ0Nsb3NlID0gL15cXHMqKFxcLz8pPi87XG52YXIgZW5kVGFnID0gbmV3IFJlZ0V4cCgnXjxcXFxcLycgKyBxbmFtZUNhcHR1cmUgKyAnW14+XSo+Jyk7XG52YXIgZG9jdHlwZSA9IC9ePCFET0NUWVBFIFtePl0rPi9pO1xudmFyIGNvbW1lbnQgPSAvXjwhLS0vO1xudmFyIGNvbmRpdGlvbmFsQ29tbWVudCA9IC9ePCFcXFsvO1xuXG52YXIgSVNfUkVHRVhfQ0FQVFVSSU5HX0JST0tFTiA9IGZhbHNlO1xuJ3gnLnJlcGxhY2UoL3goLik/L2csIGZ1bmN0aW9uIChtLCBnKSB7XG4gIElTX1JFR0VYX0NBUFRVUklOR19CUk9LRU4gPSBnID09PSAnJztcbn0pO1xuXG4vLyBTcGVjaWFsIEVsZW1lbnRzIChjYW4gY29udGFpbiBhbnl0aGluZylcbnZhciBpc1NjcmlwdE9yU3R5bGUgPSBtYWtlTWFwKCdzY3JpcHQsc3R5bGUnLCB0cnVlKTtcbnZhciByZUNhY2hlID0ge307XG5cbnZhciBkZWNvZGluZ01hcCA9IHtcbiAgJyZsdDsnOiAnPCcsXG4gICcmZ3Q7JzogJz4nLFxuICAnJnF1b3Q7JzogJ1wiJyxcbiAgJyZhbXA7JzogJyYnLFxuICAnJiMxMDsnOiAnXFxuJ1xufTtcbnZhciBlbmNvZGVkQXR0ciA9IC8mKD86bHR8Z3R8cXVvdHxhbXApOy9nO1xudmFyIGVuY29kZWRBdHRyV2l0aE5ld0xpbmVzID0gLyYoPzpsdHxndHxxdW90fGFtcHwjMTApOy9nO1xuXG5mdW5jdGlvbiBkZWNvZGVBdHRyICh2YWx1ZSwgc2hvdWxkRGVjb2RlTmV3bGluZXMpIHtcbiAgdmFyIHJlID0gc2hvdWxkRGVjb2RlTmV3bGluZXMgPyBlbmNvZGVkQXR0cldpdGhOZXdMaW5lcyA6IGVuY29kZWRBdHRyO1xuICByZXR1cm4gdmFsdWUucmVwbGFjZShyZSwgZnVuY3Rpb24gKG1hdGNoKSB7IHJldHVybiBkZWNvZGluZ01hcFttYXRjaF07IH0pXG59XG5cbmZ1bmN0aW9uIHBhcnNlSFRNTCAoaHRtbCwgb3B0aW9ucykge1xuICB2YXIgc3RhY2sgPSBbXTtcbiAgdmFyIGV4cGVjdEhUTUwgPSBvcHRpb25zLmV4cGVjdEhUTUw7XG4gIHZhciBpc1VuYXJ5VGFnJCQxID0gb3B0aW9ucy5pc1VuYXJ5VGFnIHx8IG5vO1xuICB2YXIgaW5kZXggPSAwO1xuICB2YXIgbGFzdCwgbGFzdFRhZztcbiAgd2hpbGUgKGh0bWwpIHtcbiAgICBsYXN0ID0gaHRtbDtcbiAgICAvLyBNYWtlIHN1cmUgd2UncmUgbm90IGluIGEgc2NyaXB0IG9yIHN0eWxlIGVsZW1lbnRcbiAgICBpZiAoIWxhc3RUYWcgfHwgIWlzU2NyaXB0T3JTdHlsZShsYXN0VGFnKSkge1xuICAgICAgdmFyIHRleHRFbmQgPSBodG1sLmluZGV4T2YoJzwnKTtcbiAgICAgIGlmICh0ZXh0RW5kID09PSAwKSB7XG4gICAgICAgIC8vIENvbW1lbnQ6XG4gICAgICAgIGlmIChjb21tZW50LnRlc3QoaHRtbCkpIHtcbiAgICAgICAgICB2YXIgY29tbWVudEVuZCA9IGh0bWwuaW5kZXhPZignLS0+Jyk7XG5cbiAgICAgICAgICBpZiAoY29tbWVudEVuZCA+PSAwKSB7XG4gICAgICAgICAgICBhZHZhbmNlKGNvbW1lbnRFbmQgKyAzKTtcbiAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9Db25kaXRpb25hbF9jb21tZW50I0Rvd25sZXZlbC1yZXZlYWxlZF9jb25kaXRpb25hbF9jb21tZW50XG4gICAgICAgIGlmIChjb25kaXRpb25hbENvbW1lbnQudGVzdChodG1sKSkge1xuICAgICAgICAgIHZhciBjb25kaXRpb25hbEVuZCA9IGh0bWwuaW5kZXhPZignXT4nKTtcblxuICAgICAgICAgIGlmIChjb25kaXRpb25hbEVuZCA+PSAwKSB7XG4gICAgICAgICAgICBhZHZhbmNlKGNvbmRpdGlvbmFsRW5kICsgMik7XG4gICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIERvY3R5cGU6XG4gICAgICAgIHZhciBkb2N0eXBlTWF0Y2ggPSBodG1sLm1hdGNoKGRvY3R5cGUpO1xuICAgICAgICBpZiAoZG9jdHlwZU1hdGNoKSB7XG4gICAgICAgICAgYWR2YW5jZShkb2N0eXBlTWF0Y2hbMF0ubGVuZ3RoKTtcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gRW5kIHRhZzpcbiAgICAgICAgdmFyIGVuZFRhZ01hdGNoID0gaHRtbC5tYXRjaChlbmRUYWcpO1xuICAgICAgICBpZiAoZW5kVGFnTWF0Y2gpIHtcbiAgICAgICAgICB2YXIgY3VySW5kZXggPSBpbmRleDtcbiAgICAgICAgICBhZHZhbmNlKGVuZFRhZ01hdGNoWzBdLmxlbmd0aCk7XG4gICAgICAgICAgcGFyc2VFbmRUYWcoZW5kVGFnTWF0Y2hbMV0sIGN1ckluZGV4LCBpbmRleCk7XG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFN0YXJ0IHRhZzpcbiAgICAgICAgdmFyIHN0YXJ0VGFnTWF0Y2ggPSBwYXJzZVN0YXJ0VGFnKCk7XG4gICAgICAgIGlmIChzdGFydFRhZ01hdGNoKSB7XG4gICAgICAgICAgaGFuZGxlU3RhcnRUYWcoc3RhcnRUYWdNYXRjaCk7XG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgdGV4dCA9ICh2b2lkIDApLCByZXN0JDEgPSAodm9pZCAwKSwgbmV4dCA9ICh2b2lkIDApO1xuICAgICAgaWYgKHRleHRFbmQgPj0gMCkge1xuICAgICAgICByZXN0JDEgPSBodG1sLnNsaWNlKHRleHRFbmQpO1xuICAgICAgICB3aGlsZSAoXG4gICAgICAgICAgIWVuZFRhZy50ZXN0KHJlc3QkMSkgJiZcbiAgICAgICAgICAhc3RhcnRUYWdPcGVuLnRlc3QocmVzdCQxKSAmJlxuICAgICAgICAgICFjb21tZW50LnRlc3QocmVzdCQxKSAmJlxuICAgICAgICAgICFjb25kaXRpb25hbENvbW1lbnQudGVzdChyZXN0JDEpXG4gICAgICAgICkge1xuICAgICAgICAgIC8vIDwgaW4gcGxhaW4gdGV4dCwgYmUgZm9yZ2l2aW5nIGFuZCB0cmVhdCBpdCBhcyB0ZXh0XG4gICAgICAgICAgbmV4dCA9IHJlc3QkMS5pbmRleE9mKCc8JywgMSk7XG4gICAgICAgICAgaWYgKG5leHQgPCAwKSB7IGJyZWFrIH1cbiAgICAgICAgICB0ZXh0RW5kICs9IG5leHQ7XG4gICAgICAgICAgcmVzdCQxID0gaHRtbC5zbGljZSh0ZXh0RW5kKTtcbiAgICAgICAgfVxuICAgICAgICB0ZXh0ID0gaHRtbC5zdWJzdHJpbmcoMCwgdGV4dEVuZCk7XG4gICAgICAgIGFkdmFuY2UodGV4dEVuZCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0ZXh0RW5kIDwgMCkge1xuICAgICAgICB0ZXh0ID0gaHRtbDtcbiAgICAgICAgaHRtbCA9ICcnO1xuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9ucy5jaGFycyAmJiB0ZXh0KSB7XG4gICAgICAgIG9wdGlvbnMuY2hhcnModGV4dCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBzdGFja2VkVGFnID0gbGFzdFRhZy50b0xvd2VyQ2FzZSgpO1xuICAgICAgdmFyIHJlU3RhY2tlZFRhZyA9IHJlQ2FjaGVbc3RhY2tlZFRhZ10gfHwgKHJlQ2FjaGVbc3RhY2tlZFRhZ10gPSBuZXcgUmVnRXhwKCcoW1xcXFxzXFxcXFNdKj8pKDwvJyArIHN0YWNrZWRUYWcgKyAnW14+XSo+KScsICdpJykpO1xuICAgICAgdmFyIGVuZFRhZ0xlbmd0aCA9IDA7XG4gICAgICB2YXIgcmVzdCA9IGh0bWwucmVwbGFjZShyZVN0YWNrZWRUYWcsIGZ1bmN0aW9uIChhbGwsIHRleHQsIGVuZFRhZykge1xuICAgICAgICBlbmRUYWdMZW5ndGggPSBlbmRUYWcubGVuZ3RoO1xuICAgICAgICBpZiAoc3RhY2tlZFRhZyAhPT0gJ3NjcmlwdCcgJiYgc3RhY2tlZFRhZyAhPT0gJ3N0eWxlJyAmJiBzdGFja2VkVGFnICE9PSAnbm9zY3JpcHQnKSB7XG4gICAgICAgICAgdGV4dCA9IHRleHRcbiAgICAgICAgICAgIC5yZXBsYWNlKC88IS0tKFtcXHNcXFNdKj8pLS0+L2csICckMScpXG4gICAgICAgICAgICAucmVwbGFjZSgvPCFcXFtDREFUQVxcWyhbXFxzXFxTXSo/KV1dPi9nLCAnJDEnKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucy5jaGFycykge1xuICAgICAgICAgIG9wdGlvbnMuY2hhcnModGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICcnXG4gICAgICB9KTtcbiAgICAgIGluZGV4ICs9IGh0bWwubGVuZ3RoIC0gcmVzdC5sZW5ndGg7XG4gICAgICBodG1sID0gcmVzdDtcbiAgICAgIHBhcnNlRW5kVGFnKHN0YWNrZWRUYWcsIGluZGV4IC0gZW5kVGFnTGVuZ3RoLCBpbmRleCk7XG4gICAgfVxuXG4gICAgaWYgKGh0bWwgPT09IGxhc3QpIHtcbiAgICAgIG9wdGlvbnMuY2hhcnMgJiYgb3B0aW9ucy5jaGFycyhodG1sKTtcbiAgICAgIGlmIChcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiAhc3RhY2subGVuZ3RoICYmIG9wdGlvbnMud2Fybikge1xuICAgICAgICBvcHRpb25zLndhcm4oKFwiTWFsLWZvcm1hdHRlZCB0YWcgYXQgZW5kIG9mIHRlbXBsYXRlOiBcXFwiXCIgKyBodG1sICsgXCJcXFwiXCIpKTtcbiAgICAgIH1cbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG5cbiAgLy8gQ2xlYW4gdXAgYW55IHJlbWFpbmluZyB0YWdzXG4gIHBhcnNlRW5kVGFnKCk7XG5cbiAgZnVuY3Rpb24gYWR2YW5jZSAobikge1xuICAgIGluZGV4ICs9IG47XG4gICAgaHRtbCA9IGh0bWwuc3Vic3RyaW5nKG4pO1xuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VTdGFydFRhZyAoKSB7XG4gICAgdmFyIHN0YXJ0ID0gaHRtbC5tYXRjaChzdGFydFRhZ09wZW4pO1xuICAgIGlmIChzdGFydCkge1xuICAgICAgdmFyIG1hdGNoID0ge1xuICAgICAgICB0YWdOYW1lOiBzdGFydFsxXSxcbiAgICAgICAgYXR0cnM6IFtdLFxuICAgICAgICBzdGFydDogaW5kZXhcbiAgICAgIH07XG4gICAgICBhZHZhbmNlKHN0YXJ0WzBdLmxlbmd0aCk7XG4gICAgICB2YXIgZW5kLCBhdHRyO1xuICAgICAgd2hpbGUgKCEoZW5kID0gaHRtbC5tYXRjaChzdGFydFRhZ0Nsb3NlKSkgJiYgKGF0dHIgPSBodG1sLm1hdGNoKGF0dHJpYnV0ZSkpKSB7XG4gICAgICAgIGFkdmFuY2UoYXR0clswXS5sZW5ndGgpO1xuICAgICAgICBtYXRjaC5hdHRycy5wdXNoKGF0dHIpO1xuICAgICAgfVxuICAgICAgaWYgKGVuZCkge1xuICAgICAgICBtYXRjaC51bmFyeVNsYXNoID0gZW5kWzFdO1xuICAgICAgICBhZHZhbmNlKGVuZFswXS5sZW5ndGgpO1xuICAgICAgICBtYXRjaC5lbmQgPSBpbmRleDtcbiAgICAgICAgcmV0dXJuIG1hdGNoXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlU3RhcnRUYWcgKG1hdGNoKSB7XG4gICAgdmFyIHRhZ05hbWUgPSBtYXRjaC50YWdOYW1lO1xuICAgIHZhciB1bmFyeVNsYXNoID0gbWF0Y2gudW5hcnlTbGFzaDtcblxuICAgIGlmIChleHBlY3RIVE1MKSB7XG4gICAgICBpZiAobGFzdFRhZyA9PT0gJ3AnICYmIGlzTm9uUGhyYXNpbmdUYWcodGFnTmFtZSkpIHtcbiAgICAgICAgcGFyc2VFbmRUYWcobGFzdFRhZyk7XG4gICAgICB9XG4gICAgICBpZiAoY2FuQmVMZWZ0T3BlblRhZyh0YWdOYW1lKSAmJiBsYXN0VGFnID09PSB0YWdOYW1lKSB7XG4gICAgICAgIHBhcnNlRW5kVGFnKHRhZ05hbWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciB1bmFyeSA9IGlzVW5hcnlUYWckJDEodGFnTmFtZSkgfHwgdGFnTmFtZSA9PT0gJ2h0bWwnICYmIGxhc3RUYWcgPT09ICdoZWFkJyB8fCAhIXVuYXJ5U2xhc2g7XG5cbiAgICB2YXIgbCA9IG1hdGNoLmF0dHJzLmxlbmd0aDtcbiAgICB2YXIgYXR0cnMgPSBuZXcgQXJyYXkobCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICAgIHZhciBhcmdzID0gbWF0Y2guYXR0cnNbaV07XG4gICAgICAvLyBoYWNraXNoIHdvcmsgYXJvdW5kIEZGIGJ1ZyBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD0zNjk3NzhcbiAgICAgIGlmIChJU19SRUdFWF9DQVBUVVJJTkdfQlJPS0VOICYmIGFyZ3NbMF0uaW5kZXhPZignXCJcIicpID09PSAtMSkge1xuICAgICAgICBpZiAoYXJnc1szXSA9PT0gJycpIHsgZGVsZXRlIGFyZ3NbM107IH1cbiAgICAgICAgaWYgKGFyZ3NbNF0gPT09ICcnKSB7IGRlbGV0ZSBhcmdzWzRdOyB9XG4gICAgICAgIGlmIChhcmdzWzVdID09PSAnJykgeyBkZWxldGUgYXJnc1s1XTsgfVxuICAgICAgfVxuICAgICAgdmFyIHZhbHVlID0gYXJnc1szXSB8fCBhcmdzWzRdIHx8IGFyZ3NbNV0gfHwgJyc7XG4gICAgICBhdHRyc1tpXSA9IHtcbiAgICAgICAgbmFtZTogYXJnc1sxXSxcbiAgICAgICAgdmFsdWU6IGRlY29kZUF0dHIoXG4gICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgb3B0aW9ucy5zaG91bGREZWNvZGVOZXdsaW5lc1xuICAgICAgICApXG4gICAgICB9O1xuICAgIH1cblxuICAgIGlmICghdW5hcnkpIHtcbiAgICAgIHN0YWNrLnB1c2goeyB0YWc6IHRhZ05hbWUsIGxvd2VyQ2FzZWRUYWc6IHRhZ05hbWUudG9Mb3dlckNhc2UoKSwgYXR0cnM6IGF0dHJzIH0pO1xuICAgICAgbGFzdFRhZyA9IHRhZ05hbWU7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMuc3RhcnQpIHtcbiAgICAgIG9wdGlvbnMuc3RhcnQodGFnTmFtZSwgYXR0cnMsIHVuYXJ5LCBtYXRjaC5zdGFydCwgbWF0Y2guZW5kKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZUVuZFRhZyAodGFnTmFtZSwgc3RhcnQsIGVuZCkge1xuICAgIHZhciBwb3MsIGxvd2VyQ2FzZWRUYWdOYW1lO1xuICAgIGlmIChzdGFydCA9PSBudWxsKSB7IHN0YXJ0ID0gaW5kZXg7IH1cbiAgICBpZiAoZW5kID09IG51bGwpIHsgZW5kID0gaW5kZXg7IH1cblxuICAgIGlmICh0YWdOYW1lKSB7XG4gICAgICBsb3dlckNhc2VkVGFnTmFtZSA9IHRhZ05hbWUudG9Mb3dlckNhc2UoKTtcbiAgICB9XG5cbiAgICAvLyBGaW5kIHRoZSBjbG9zZXN0IG9wZW5lZCB0YWcgb2YgdGhlIHNhbWUgdHlwZVxuICAgIGlmICh0YWdOYW1lKSB7XG4gICAgICBmb3IgKHBvcyA9IHN0YWNrLmxlbmd0aCAtIDE7IHBvcyA+PSAwOyBwb3MtLSkge1xuICAgICAgICBpZiAoc3RhY2tbcG9zXS5sb3dlckNhc2VkVGFnID09PSBsb3dlckNhc2VkVGFnTmFtZSkge1xuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSWYgbm8gdGFnIG5hbWUgaXMgcHJvdmlkZWQsIGNsZWFuIHNob3BcbiAgICAgIHBvcyA9IDA7XG4gICAgfVxuXG4gICAgaWYgKHBvcyA+PSAwKSB7XG4gICAgICAvLyBDbG9zZSBhbGwgdGhlIG9wZW4gZWxlbWVudHMsIHVwIHRoZSBzdGFja1xuICAgICAgZm9yICh2YXIgaSA9IHN0YWNrLmxlbmd0aCAtIDE7IGkgPj0gcG9zOyBpLS0pIHtcbiAgICAgICAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmXG4gICAgICAgICAgICAoaSA+IHBvcyB8fCAhdGFnTmFtZSkgJiZcbiAgICAgICAgICAgIG9wdGlvbnMud2Fybikge1xuICAgICAgICAgIG9wdGlvbnMud2FybihcbiAgICAgICAgICAgIChcInRhZyA8XCIgKyAoc3RhY2tbaV0udGFnKSArIFwiPiBoYXMgbm8gbWF0Y2hpbmcgZW5kIHRhZy5cIilcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zLmVuZCkge1xuICAgICAgICAgIG9wdGlvbnMuZW5kKHN0YWNrW2ldLnRhZywgc3RhcnQsIGVuZCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gUmVtb3ZlIHRoZSBvcGVuIGVsZW1lbnRzIGZyb20gdGhlIHN0YWNrXG4gICAgICBzdGFjay5sZW5ndGggPSBwb3M7XG4gICAgICBsYXN0VGFnID0gcG9zICYmIHN0YWNrW3BvcyAtIDFdLnRhZztcbiAgICB9IGVsc2UgaWYgKGxvd2VyQ2FzZWRUYWdOYW1lID09PSAnYnInKSB7XG4gICAgICBpZiAob3B0aW9ucy5zdGFydCkge1xuICAgICAgICBvcHRpb25zLnN0YXJ0KHRhZ05hbWUsIFtdLCB0cnVlLCBzdGFydCwgZW5kKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGxvd2VyQ2FzZWRUYWdOYW1lID09PSAncCcpIHtcbiAgICAgIGlmIChvcHRpb25zLnN0YXJ0KSB7XG4gICAgICAgIG9wdGlvbnMuc3RhcnQodGFnTmFtZSwgW10sIGZhbHNlLCBzdGFydCwgZW5kKTtcbiAgICAgIH1cbiAgICAgIGlmIChvcHRpb25zLmVuZCkge1xuICAgICAgICBvcHRpb25zLmVuZCh0YWdOYW1lLCBzdGFydCwgZW5kKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyogICovXG5cbnZhciBkZWZhdWx0VGFnUkUgPSAvXFx7XFx7KCg/Oi58XFxuKSs/KVxcfVxcfS9nO1xudmFyIHJlZ2V4RXNjYXBlUkUgPSAvWy0uKis/XiR7fSgpfFtcXF1cXC9cXFxcXS9nO1xuXG52YXIgYnVpbGRSZWdleCA9IGNhY2hlZChmdW5jdGlvbiAoZGVsaW1pdGVycykge1xuICB2YXIgb3BlbiA9IGRlbGltaXRlcnNbMF0ucmVwbGFjZShyZWdleEVzY2FwZVJFLCAnXFxcXCQmJyk7XG4gIHZhciBjbG9zZSA9IGRlbGltaXRlcnNbMV0ucmVwbGFjZShyZWdleEVzY2FwZVJFLCAnXFxcXCQmJyk7XG4gIHJldHVybiBuZXcgUmVnRXhwKG9wZW4gKyAnKCg/Oi58XFxcXG4pKz8pJyArIGNsb3NlLCAnZycpXG59KTtcblxuZnVuY3Rpb24gcGFyc2VUZXh0IChcbiAgdGV4dCxcbiAgZGVsaW1pdGVyc1xuKSB7XG4gIHZhciB0YWdSRSA9IGRlbGltaXRlcnMgPyBidWlsZFJlZ2V4KGRlbGltaXRlcnMpIDogZGVmYXVsdFRhZ1JFO1xuICBpZiAoIXRhZ1JFLnRlc3QodGV4dCkpIHtcbiAgICByZXR1cm5cbiAgfVxuICB2YXIgdG9rZW5zID0gW107XG4gIHZhciBsYXN0SW5kZXggPSB0YWdSRS5sYXN0SW5kZXggPSAwO1xuICB2YXIgbWF0Y2gsIGluZGV4O1xuICB3aGlsZSAoKG1hdGNoID0gdGFnUkUuZXhlYyh0ZXh0KSkpIHtcbiAgICBpbmRleCA9IG1hdGNoLmluZGV4O1xuICAgIC8vIHB1c2ggdGV4dCB0b2tlblxuICAgIGlmIChpbmRleCA+IGxhc3RJbmRleCkge1xuICAgICAgdG9rZW5zLnB1c2goSlNPTi5zdHJpbmdpZnkodGV4dC5zbGljZShsYXN0SW5kZXgsIGluZGV4KSkpO1xuICAgIH1cbiAgICAvLyB0YWcgdG9rZW5cbiAgICB2YXIgZXhwID0gcGFyc2VGaWx0ZXJzKG1hdGNoWzFdLnRyaW0oKSk7XG4gICAgdG9rZW5zLnB1c2goKFwiX3MoXCIgKyBleHAgKyBcIilcIikpO1xuICAgIGxhc3RJbmRleCA9IGluZGV4ICsgbWF0Y2hbMF0ubGVuZ3RoO1xuICB9XG4gIGlmIChsYXN0SW5kZXggPCB0ZXh0Lmxlbmd0aCkge1xuICAgIHRva2Vucy5wdXNoKEpTT04uc3RyaW5naWZ5KHRleHQuc2xpY2UobGFzdEluZGV4KSkpO1xuICB9XG4gIHJldHVybiB0b2tlbnMuam9pbignKycpXG59XG5cbi8qICAqL1xuXG52YXIgZGlyUkUgPSAvXnYtfF5AfF46LztcbnZhciBvblJFID0gL15AfF52LW9uOi87XG52YXIgZm9yQWxpYXNSRSA9IC8oLio/KVxccysoPzppbnxvZilcXHMrKC4qKS87XG52YXIgZm9ySXRlcmF0b3JSRSA9IC9cXCgoXFx7W159XSpcXH18W14sXSopLChbXixdKikoPzosKFteLF0qKSk/XFwpLztcbnZhciBiaW5kUkUgPSAvXjp8XnYtYmluZDovO1xudmFyIGFyZ1JFID0gLzooLiopJC87XG52YXIgbW9kaWZpZXJSRSA9IC9cXC5bXi5dKy9nO1xuXG52YXIgZGVjb2RlSFRNTENhY2hlZCA9IGNhY2hlZChkZWNvZGUpO1xuXG4vLyBjb25maWd1cmFibGUgc3RhdGVcbnZhciB3YXJuJDI7XG52YXIgcGxhdGZvcm1HZXRUYWdOYW1lc3BhY2U7XG52YXIgcGxhdGZvcm1NdXN0VXNlUHJvcDtcbnZhciBwbGF0Zm9ybUlzUHJlVGFnO1xudmFyIHByZVRyYW5zZm9ybXM7XG52YXIgdHJhbnNmb3JtcztcbnZhciBwb3N0VHJhbnNmb3JtcztcbnZhciBkZWxpbWl0ZXJzO1xuXG4vKipcbiAqIENvbnZlcnQgSFRNTCBzdHJpbmcgdG8gQVNULlxuICovXG5mdW5jdGlvbiBwYXJzZSAoXG4gIHRlbXBsYXRlLFxuICBvcHRpb25zXG4pIHtcbiAgd2FybiQyID0gb3B0aW9ucy53YXJuIHx8IGJhc2VXYXJuO1xuICBwbGF0Zm9ybUdldFRhZ05hbWVzcGFjZSA9IG9wdGlvbnMuZ2V0VGFnTmFtZXNwYWNlIHx8IG5vO1xuICBwbGF0Zm9ybU11c3RVc2VQcm9wID0gb3B0aW9ucy5tdXN0VXNlUHJvcCB8fCBubztcbiAgcGxhdGZvcm1Jc1ByZVRhZyA9IG9wdGlvbnMuaXNQcmVUYWcgfHwgbm87XG4gIHByZVRyYW5zZm9ybXMgPSBwbHVja01vZHVsZUZ1bmN0aW9uKG9wdGlvbnMubW9kdWxlcywgJ3ByZVRyYW5zZm9ybU5vZGUnKTtcbiAgdHJhbnNmb3JtcyA9IHBsdWNrTW9kdWxlRnVuY3Rpb24ob3B0aW9ucy5tb2R1bGVzLCAndHJhbnNmb3JtTm9kZScpO1xuICBwb3N0VHJhbnNmb3JtcyA9IHBsdWNrTW9kdWxlRnVuY3Rpb24ob3B0aW9ucy5tb2R1bGVzLCAncG9zdFRyYW5zZm9ybU5vZGUnKTtcbiAgZGVsaW1pdGVycyA9IG9wdGlvbnMuZGVsaW1pdGVycztcblxuICB2YXIgc3RhY2sgPSBbXTtcbiAgdmFyIHByZXNlcnZlV2hpdGVzcGFjZSA9IG9wdGlvbnMucHJlc2VydmVXaGl0ZXNwYWNlICE9PSBmYWxzZTtcbiAgdmFyIHJvb3Q7XG4gIHZhciBjdXJyZW50UGFyZW50O1xuICB2YXIgaW5WUHJlID0gZmFsc2U7XG4gIHZhciBpblByZSA9IGZhbHNlO1xuICB2YXIgd2FybmVkID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gZW5kUHJlIChlbGVtZW50KSB7XG4gICAgLy8gY2hlY2sgcHJlIHN0YXRlXG4gICAgaWYgKGVsZW1lbnQucHJlKSB7XG4gICAgICBpblZQcmUgPSBmYWxzZTtcbiAgICB9XG4gICAgaWYgKHBsYXRmb3JtSXNQcmVUYWcoZWxlbWVudC50YWcpKSB7XG4gICAgICBpblByZSA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHBhcnNlSFRNTCh0ZW1wbGF0ZSwge1xuICAgIHdhcm46IHdhcm4kMixcbiAgICBleHBlY3RIVE1MOiBvcHRpb25zLmV4cGVjdEhUTUwsXG4gICAgaXNVbmFyeVRhZzogb3B0aW9ucy5pc1VuYXJ5VGFnLFxuICAgIHNob3VsZERlY29kZU5ld2xpbmVzOiBvcHRpb25zLnNob3VsZERlY29kZU5ld2xpbmVzLFxuICAgIHN0YXJ0OiBmdW5jdGlvbiBzdGFydCAodGFnLCBhdHRycywgdW5hcnkpIHtcbiAgICAgIC8vIGNoZWNrIG5hbWVzcGFjZS5cbiAgICAgIC8vIGluaGVyaXQgcGFyZW50IG5zIGlmIHRoZXJlIGlzIG9uZVxuICAgICAgdmFyIG5zID0gKGN1cnJlbnRQYXJlbnQgJiYgY3VycmVudFBhcmVudC5ucykgfHwgcGxhdGZvcm1HZXRUYWdOYW1lc3BhY2UodGFnKTtcblxuICAgICAgLy8gaGFuZGxlIElFIHN2ZyBidWdcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgaWYgKGlzSUUgJiYgbnMgPT09ICdzdmcnKSB7XG4gICAgICAgIGF0dHJzID0gZ3VhcmRJRVNWR0J1ZyhhdHRycyk7XG4gICAgICB9XG5cbiAgICAgIHZhciBlbGVtZW50ID0ge1xuICAgICAgICB0eXBlOiAxLFxuICAgICAgICB0YWc6IHRhZyxcbiAgICAgICAgYXR0cnNMaXN0OiBhdHRycyxcbiAgICAgICAgYXR0cnNNYXA6IG1ha2VBdHRyc01hcChhdHRycyksXG4gICAgICAgIHBhcmVudDogY3VycmVudFBhcmVudCxcbiAgICAgICAgY2hpbGRyZW46IFtdXG4gICAgICB9O1xuICAgICAgaWYgKG5zKSB7XG4gICAgICAgIGVsZW1lbnQubnMgPSBucztcbiAgICAgIH1cblxuICAgICAgaWYgKGlzRm9yYmlkZGVuVGFnKGVsZW1lbnQpICYmICFpc1NlcnZlclJlbmRlcmluZygpKSB7XG4gICAgICAgIGVsZW1lbnQuZm9yYmlkZGVuID0gdHJ1ZTtcbiAgICAgICAgXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiYgd2FybiQyKFxuICAgICAgICAgICdUZW1wbGF0ZXMgc2hvdWxkIG9ubHkgYmUgcmVzcG9uc2libGUgZm9yIG1hcHBpbmcgdGhlIHN0YXRlIHRvIHRoZSAnICtcbiAgICAgICAgICAnVUkuIEF2b2lkIHBsYWNpbmcgdGFncyB3aXRoIHNpZGUtZWZmZWN0cyBpbiB5b3VyIHRlbXBsYXRlcywgc3VjaCBhcyAnICtcbiAgICAgICAgICBcIjxcIiArIHRhZyArIFwiPlwiICsgJywgYXMgdGhleSB3aWxsIG5vdCBiZSBwYXJzZWQuJ1xuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICAvLyBhcHBseSBwcmUtdHJhbnNmb3Jtc1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcmVUcmFuc2Zvcm1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHByZVRyYW5zZm9ybXNbaV0oZWxlbWVudCwgb3B0aW9ucyk7XG4gICAgICB9XG5cbiAgICAgIGlmICghaW5WUHJlKSB7XG4gICAgICAgIHByb2Nlc3NQcmUoZWxlbWVudCk7XG4gICAgICAgIGlmIChlbGVtZW50LnByZSkge1xuICAgICAgICAgIGluVlByZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChwbGF0Zm9ybUlzUHJlVGFnKGVsZW1lbnQudGFnKSkge1xuICAgICAgICBpblByZSA9IHRydWU7XG4gICAgICB9XG4gICAgICBpZiAoaW5WUHJlKSB7XG4gICAgICAgIHByb2Nlc3NSYXdBdHRycyhlbGVtZW50KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHByb2Nlc3NGb3IoZWxlbWVudCk7XG4gICAgICAgIHByb2Nlc3NJZihlbGVtZW50KTtcbiAgICAgICAgcHJvY2Vzc09uY2UoZWxlbWVudCk7XG4gICAgICAgIHByb2Nlc3NLZXkoZWxlbWVudCk7XG5cbiAgICAgICAgLy8gZGV0ZXJtaW5lIHdoZXRoZXIgdGhpcyBpcyBhIHBsYWluIGVsZW1lbnQgYWZ0ZXJcbiAgICAgICAgLy8gcmVtb3Zpbmcgc3RydWN0dXJhbCBhdHRyaWJ1dGVzXG4gICAgICAgIGVsZW1lbnQucGxhaW4gPSAhZWxlbWVudC5rZXkgJiYgIWF0dHJzLmxlbmd0aDtcblxuICAgICAgICBwcm9jZXNzUmVmKGVsZW1lbnQpO1xuICAgICAgICBwcm9jZXNzU2xvdChlbGVtZW50KTtcbiAgICAgICAgcHJvY2Vzc0NvbXBvbmVudChlbGVtZW50KTtcbiAgICAgICAgZm9yICh2YXIgaSQxID0gMDsgaSQxIDwgdHJhbnNmb3Jtcy5sZW5ndGg7IGkkMSsrKSB7XG4gICAgICAgICAgdHJhbnNmb3Jtc1tpJDFdKGVsZW1lbnQsIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICAgIHByb2Nlc3NBdHRycyhlbGVtZW50KTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gY2hlY2tSb290Q29uc3RyYWludHMgKGVsKSB7XG4gICAgICAgIGlmIChcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiAhd2FybmVkKSB7XG4gICAgICAgICAgaWYgKGVsLnRhZyA9PT0gJ3Nsb3QnIHx8IGVsLnRhZyA9PT0gJ3RlbXBsYXRlJykge1xuICAgICAgICAgICAgd2FybmVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHdhcm4kMihcbiAgICAgICAgICAgICAgXCJDYW5ub3QgdXNlIDxcIiArIChlbC50YWcpICsgXCI+IGFzIGNvbXBvbmVudCByb290IGVsZW1lbnQgYmVjYXVzZSBpdCBtYXkgXCIgK1xuICAgICAgICAgICAgICAnY29udGFpbiBtdWx0aXBsZSBub2Rlcy4nXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZWwuYXR0cnNNYXAuaGFzT3duUHJvcGVydHkoJ3YtZm9yJykpIHtcbiAgICAgICAgICAgIHdhcm5lZCA9IHRydWU7XG4gICAgICAgICAgICB3YXJuJDIoXG4gICAgICAgICAgICAgICdDYW5ub3QgdXNlIHYtZm9yIG9uIHN0YXRlZnVsIGNvbXBvbmVudCByb290IGVsZW1lbnQgYmVjYXVzZSAnICtcbiAgICAgICAgICAgICAgJ2l0IHJlbmRlcnMgbXVsdGlwbGUgZWxlbWVudHMuJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gdHJlZSBtYW5hZ2VtZW50XG4gICAgICBpZiAoIXJvb3QpIHtcbiAgICAgICAgcm9vdCA9IGVsZW1lbnQ7XG4gICAgICAgIGNoZWNrUm9vdENvbnN0cmFpbnRzKHJvb3QpO1xuICAgICAgfSBlbHNlIGlmICghc3RhY2subGVuZ3RoKSB7XG4gICAgICAgIC8vIGFsbG93IHJvb3QgZWxlbWVudHMgd2l0aCB2LWlmLCB2LWVsc2UtaWYgYW5kIHYtZWxzZVxuICAgICAgICBpZiAocm9vdC5pZiAmJiAoZWxlbWVudC5lbHNlaWYgfHwgZWxlbWVudC5lbHNlKSkge1xuICAgICAgICAgIGNoZWNrUm9vdENvbnN0cmFpbnRzKGVsZW1lbnQpO1xuICAgICAgICAgIGFkZElmQ29uZGl0aW9uKHJvb3QsIHtcbiAgICAgICAgICAgIGV4cDogZWxlbWVudC5lbHNlaWYsXG4gICAgICAgICAgICBibG9jazogZWxlbWVudFxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmICF3YXJuZWQpIHtcbiAgICAgICAgICB3YXJuZWQgPSB0cnVlO1xuICAgICAgICAgIHdhcm4kMihcbiAgICAgICAgICAgIFwiQ29tcG9uZW50IHRlbXBsYXRlIHNob3VsZCBjb250YWluIGV4YWN0bHkgb25lIHJvb3QgZWxlbWVudC4gXCIgK1xuICAgICAgICAgICAgXCJJZiB5b3UgYXJlIHVzaW5nIHYtaWYgb24gbXVsdGlwbGUgZWxlbWVudHMsIFwiICtcbiAgICAgICAgICAgIFwidXNlIHYtZWxzZS1pZiB0byBjaGFpbiB0aGVtIGluc3RlYWQuXCJcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoY3VycmVudFBhcmVudCAmJiAhZWxlbWVudC5mb3JiaWRkZW4pIHtcbiAgICAgICAgaWYgKGVsZW1lbnQuZWxzZWlmIHx8IGVsZW1lbnQuZWxzZSkge1xuICAgICAgICAgIHByb2Nlc3NJZkNvbmRpdGlvbnMoZWxlbWVudCwgY3VycmVudFBhcmVudCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5zbG90U2NvcGUpIHsgLy8gc2NvcGVkIHNsb3RcbiAgICAgICAgICBjdXJyZW50UGFyZW50LnBsYWluID0gZmFsc2U7XG4gICAgICAgICAgdmFyIG5hbWUgPSBlbGVtZW50LnNsb3RUYXJnZXQgfHwgJ1wiZGVmYXVsdFwiJzsoY3VycmVudFBhcmVudC5zY29wZWRTbG90cyB8fCAoY3VycmVudFBhcmVudC5zY29wZWRTbG90cyA9IHt9KSlbbmFtZV0gPSBlbGVtZW50O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGN1cnJlbnRQYXJlbnQuY2hpbGRyZW4ucHVzaChlbGVtZW50KTtcbiAgICAgICAgICBlbGVtZW50LnBhcmVudCA9IGN1cnJlbnRQYXJlbnQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICghdW5hcnkpIHtcbiAgICAgICAgY3VycmVudFBhcmVudCA9IGVsZW1lbnQ7XG4gICAgICAgIHN0YWNrLnB1c2goZWxlbWVudCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbmRQcmUoZWxlbWVudCk7XG4gICAgICB9XG4gICAgICAvLyBhcHBseSBwb3N0LXRyYW5zZm9ybXNcbiAgICAgIGZvciAodmFyIGkkMiA9IDA7IGkkMiA8IHBvc3RUcmFuc2Zvcm1zLmxlbmd0aDsgaSQyKyspIHtcbiAgICAgICAgcG9zdFRyYW5zZm9ybXNbaSQyXShlbGVtZW50LCBvcHRpb25zKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgZW5kOiBmdW5jdGlvbiBlbmQgKCkge1xuICAgICAgLy8gcmVtb3ZlIHRyYWlsaW5nIHdoaXRlc3BhY2VcbiAgICAgIHZhciBlbGVtZW50ID0gc3RhY2tbc3RhY2subGVuZ3RoIC0gMV07XG4gICAgICB2YXIgbGFzdE5vZGUgPSBlbGVtZW50LmNoaWxkcmVuW2VsZW1lbnQuY2hpbGRyZW4ubGVuZ3RoIC0gMV07XG4gICAgICBpZiAobGFzdE5vZGUgJiYgbGFzdE5vZGUudHlwZSA9PT0gMyAmJiBsYXN0Tm9kZS50ZXh0ID09PSAnICcgJiYgIWluUHJlKSB7XG4gICAgICAgIGVsZW1lbnQuY2hpbGRyZW4ucG9wKCk7XG4gICAgICB9XG4gICAgICAvLyBwb3Agc3RhY2tcbiAgICAgIHN0YWNrLmxlbmd0aCAtPSAxO1xuICAgICAgY3VycmVudFBhcmVudCA9IHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdO1xuICAgICAgZW5kUHJlKGVsZW1lbnQpO1xuICAgIH0sXG5cbiAgICBjaGFyczogZnVuY3Rpb24gY2hhcnMgKHRleHQpIHtcbiAgICAgIGlmICghY3VycmVudFBhcmVudCkge1xuICAgICAgICBpZiAoXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiYgIXdhcm5lZCAmJiB0ZXh0ID09PSB0ZW1wbGF0ZSkge1xuICAgICAgICAgIHdhcm5lZCA9IHRydWU7XG4gICAgICAgICAgd2FybiQyKFxuICAgICAgICAgICAgJ0NvbXBvbmVudCB0ZW1wbGF0ZSByZXF1aXJlcyBhIHJvb3QgZWxlbWVudCwgcmF0aGVyIHRoYW4ganVzdCB0ZXh0LidcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgLy8gSUUgdGV4dGFyZWEgcGxhY2Vob2xkZXIgYnVnXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgIGlmIChpc0lFICYmXG4gICAgICAgICAgY3VycmVudFBhcmVudC50YWcgPT09ICd0ZXh0YXJlYScgJiZcbiAgICAgICAgICBjdXJyZW50UGFyZW50LmF0dHJzTWFwLnBsYWNlaG9sZGVyID09PSB0ZXh0KSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgdmFyIGNoaWxkcmVuID0gY3VycmVudFBhcmVudC5jaGlsZHJlbjtcbiAgICAgIHRleHQgPSBpblByZSB8fCB0ZXh0LnRyaW0oKVxuICAgICAgICA/IGRlY29kZUhUTUxDYWNoZWQodGV4dClcbiAgICAgICAgLy8gb25seSBwcmVzZXJ2ZSB3aGl0ZXNwYWNlIGlmIGl0cyBub3QgcmlnaHQgYWZ0ZXIgYSBzdGFydGluZyB0YWdcbiAgICAgICAgOiBwcmVzZXJ2ZVdoaXRlc3BhY2UgJiYgY2hpbGRyZW4ubGVuZ3RoID8gJyAnIDogJyc7XG4gICAgICBpZiAodGV4dCkge1xuICAgICAgICB2YXIgZXhwcmVzc2lvbjtcbiAgICAgICAgaWYgKCFpblZQcmUgJiYgdGV4dCAhPT0gJyAnICYmIChleHByZXNzaW9uID0gcGFyc2VUZXh0KHRleHQsIGRlbGltaXRlcnMpKSkge1xuICAgICAgICAgIGNoaWxkcmVuLnB1c2goe1xuICAgICAgICAgICAgdHlwZTogMixcbiAgICAgICAgICAgIGV4cHJlc3Npb246IGV4cHJlc3Npb24sXG4gICAgICAgICAgICB0ZXh0OiB0ZXh0XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAodGV4dCAhPT0gJyAnIHx8ICFjaGlsZHJlbi5sZW5ndGggfHwgY2hpbGRyZW5bY2hpbGRyZW4ubGVuZ3RoIC0gMV0udGV4dCAhPT0gJyAnKSB7XG4gICAgICAgICAgY2hpbGRyZW4ucHVzaCh7XG4gICAgICAgICAgICB0eXBlOiAzLFxuICAgICAgICAgICAgdGV4dDogdGV4dFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHJvb3Rcbn1cblxuZnVuY3Rpb24gcHJvY2Vzc1ByZSAoZWwpIHtcbiAgaWYgKGdldEFuZFJlbW92ZUF0dHIoZWwsICd2LXByZScpICE9IG51bGwpIHtcbiAgICBlbC5wcmUgPSB0cnVlO1xuICB9XG59XG5cbmZ1bmN0aW9uIHByb2Nlc3NSYXdBdHRycyAoZWwpIHtcbiAgdmFyIGwgPSBlbC5hdHRyc0xpc3QubGVuZ3RoO1xuICBpZiAobCkge1xuICAgIHZhciBhdHRycyA9IGVsLmF0dHJzID0gbmV3IEFycmF5KGwpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbDsgaSsrKSB7XG4gICAgICBhdHRyc1tpXSA9IHtcbiAgICAgICAgbmFtZTogZWwuYXR0cnNMaXN0W2ldLm5hbWUsXG4gICAgICAgIHZhbHVlOiBKU09OLnN0cmluZ2lmeShlbC5hdHRyc0xpc3RbaV0udmFsdWUpXG4gICAgICB9O1xuICAgIH1cbiAgfSBlbHNlIGlmICghZWwucHJlKSB7XG4gICAgLy8gbm9uIHJvb3Qgbm9kZSBpbiBwcmUgYmxvY2tzIHdpdGggbm8gYXR0cmlidXRlc1xuICAgIGVsLnBsYWluID0gdHJ1ZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBwcm9jZXNzS2V5IChlbCkge1xuICB2YXIgZXhwID0gZ2V0QmluZGluZ0F0dHIoZWwsICdrZXknKTtcbiAgaWYgKGV4cCkge1xuICAgIGlmIChcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiBlbC50YWcgPT09ICd0ZW1wbGF0ZScpIHtcbiAgICAgIHdhcm4kMihcIjx0ZW1wbGF0ZT4gY2Fubm90IGJlIGtleWVkLiBQbGFjZSB0aGUga2V5IG9uIHJlYWwgZWxlbWVudHMgaW5zdGVhZC5cIik7XG4gICAgfVxuICAgIGVsLmtleSA9IGV4cDtcbiAgfVxufVxuXG5mdW5jdGlvbiBwcm9jZXNzUmVmIChlbCkge1xuICB2YXIgcmVmID0gZ2V0QmluZGluZ0F0dHIoZWwsICdyZWYnKTtcbiAgaWYgKHJlZikge1xuICAgIGVsLnJlZiA9IHJlZjtcbiAgICBlbC5yZWZJbkZvciA9IGNoZWNrSW5Gb3IoZWwpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHByb2Nlc3NGb3IgKGVsKSB7XG4gIHZhciBleHA7XG4gIGlmICgoZXhwID0gZ2V0QW5kUmVtb3ZlQXR0cihlbCwgJ3YtZm9yJykpKSB7XG4gICAgdmFyIGluTWF0Y2ggPSBleHAubWF0Y2goZm9yQWxpYXNSRSk7XG4gICAgaWYgKCFpbk1hdGNoKSB7XG4gICAgICBcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiB3YXJuJDIoXG4gICAgICAgIChcIkludmFsaWQgdi1mb3IgZXhwcmVzc2lvbjogXCIgKyBleHApXG4gICAgICApO1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGVsLmZvciA9IGluTWF0Y2hbMl0udHJpbSgpO1xuICAgIHZhciBhbGlhcyA9IGluTWF0Y2hbMV0udHJpbSgpO1xuICAgIHZhciBpdGVyYXRvck1hdGNoID0gYWxpYXMubWF0Y2goZm9ySXRlcmF0b3JSRSk7XG4gICAgaWYgKGl0ZXJhdG9yTWF0Y2gpIHtcbiAgICAgIGVsLmFsaWFzID0gaXRlcmF0b3JNYXRjaFsxXS50cmltKCk7XG4gICAgICBlbC5pdGVyYXRvcjEgPSBpdGVyYXRvck1hdGNoWzJdLnRyaW0oKTtcbiAgICAgIGlmIChpdGVyYXRvck1hdGNoWzNdKSB7XG4gICAgICAgIGVsLml0ZXJhdG9yMiA9IGl0ZXJhdG9yTWF0Y2hbM10udHJpbSgpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBlbC5hbGlhcyA9IGFsaWFzO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBwcm9jZXNzSWYgKGVsKSB7XG4gIHZhciBleHAgPSBnZXRBbmRSZW1vdmVBdHRyKGVsLCAndi1pZicpO1xuICBpZiAoZXhwKSB7XG4gICAgZWwuaWYgPSBleHA7XG4gICAgYWRkSWZDb25kaXRpb24oZWwsIHtcbiAgICAgIGV4cDogZXhwLFxuICAgICAgYmxvY2s6IGVsXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKGdldEFuZFJlbW92ZUF0dHIoZWwsICd2LWVsc2UnKSAhPSBudWxsKSB7XG4gICAgICBlbC5lbHNlID0gdHJ1ZTtcbiAgICB9XG4gICAgdmFyIGVsc2VpZiA9IGdldEFuZFJlbW92ZUF0dHIoZWwsICd2LWVsc2UtaWYnKTtcbiAgICBpZiAoZWxzZWlmKSB7XG4gICAgICBlbC5lbHNlaWYgPSBlbHNlaWY7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHByb2Nlc3NJZkNvbmRpdGlvbnMgKGVsLCBwYXJlbnQpIHtcbiAgdmFyIHByZXYgPSBmaW5kUHJldkVsZW1lbnQocGFyZW50LmNoaWxkcmVuKTtcbiAgaWYgKHByZXYgJiYgcHJldi5pZikge1xuICAgIGFkZElmQ29uZGl0aW9uKHByZXYsIHtcbiAgICAgIGV4cDogZWwuZWxzZWlmLFxuICAgICAgYmxvY2s6IGVsXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgd2FybiQyKFxuICAgICAgXCJ2LVwiICsgKGVsLmVsc2VpZiA/ICgnZWxzZS1pZj1cIicgKyBlbC5lbHNlaWYgKyAnXCInKSA6ICdlbHNlJykgKyBcIiBcIiArXG4gICAgICBcInVzZWQgb24gZWxlbWVudCA8XCIgKyAoZWwudGFnKSArIFwiPiB3aXRob3V0IGNvcnJlc3BvbmRpbmcgdi1pZi5cIlxuICAgICk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZmluZFByZXZFbGVtZW50IChjaGlsZHJlbikge1xuICB2YXIgaSA9IGNoaWxkcmVuLmxlbmd0aDtcbiAgd2hpbGUgKGktLSkge1xuICAgIGlmIChjaGlsZHJlbltpXS50eXBlID09PSAxKSB7XG4gICAgICByZXR1cm4gY2hpbGRyZW5baV1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmIGNoaWxkcmVuW2ldLnRleHQgIT09ICcgJykge1xuICAgICAgICB3YXJuJDIoXG4gICAgICAgICAgXCJ0ZXh0IFxcXCJcIiArIChjaGlsZHJlbltpXS50ZXh0LnRyaW0oKSkgKyBcIlxcXCIgYmV0d2VlbiB2LWlmIGFuZCB2LWVsc2UoLWlmKSBcIiArXG4gICAgICAgICAgXCJ3aWxsIGJlIGlnbm9yZWQuXCJcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIGNoaWxkcmVuLnBvcCgpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBhZGRJZkNvbmRpdGlvbiAoZWwsIGNvbmRpdGlvbikge1xuICBpZiAoIWVsLmlmQ29uZGl0aW9ucykge1xuICAgIGVsLmlmQ29uZGl0aW9ucyA9IFtdO1xuICB9XG4gIGVsLmlmQ29uZGl0aW9ucy5wdXNoKGNvbmRpdGlvbik7XG59XG5cbmZ1bmN0aW9uIHByb2Nlc3NPbmNlIChlbCkge1xuICB2YXIgb25jZSQkMSA9IGdldEFuZFJlbW92ZUF0dHIoZWwsICd2LW9uY2UnKTtcbiAgaWYgKG9uY2UkJDEgIT0gbnVsbCkge1xuICAgIGVsLm9uY2UgPSB0cnVlO1xuICB9XG59XG5cbmZ1bmN0aW9uIHByb2Nlc3NTbG90IChlbCkge1xuICBpZiAoZWwudGFnID09PSAnc2xvdCcpIHtcbiAgICBlbC5zbG90TmFtZSA9IGdldEJpbmRpbmdBdHRyKGVsLCAnbmFtZScpO1xuICAgIGlmIChcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiBlbC5rZXkpIHtcbiAgICAgIHdhcm4kMihcbiAgICAgICAgXCJga2V5YCBkb2VzIG5vdCB3b3JrIG9uIDxzbG90PiBiZWNhdXNlIHNsb3RzIGFyZSBhYnN0cmFjdCBvdXRsZXRzIFwiICtcbiAgICAgICAgXCJhbmQgY2FuIHBvc3NpYmx5IGV4cGFuZCBpbnRvIG11bHRpcGxlIGVsZW1lbnRzLiBcIiArXG4gICAgICAgIFwiVXNlIHRoZSBrZXkgb24gYSB3cmFwcGluZyBlbGVtZW50IGluc3RlYWQuXCJcbiAgICAgICk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciBzbG90VGFyZ2V0ID0gZ2V0QmluZGluZ0F0dHIoZWwsICdzbG90Jyk7XG4gICAgaWYgKHNsb3RUYXJnZXQpIHtcbiAgICAgIGVsLnNsb3RUYXJnZXQgPSBzbG90VGFyZ2V0ID09PSAnXCJcIicgPyAnXCJkZWZhdWx0XCInIDogc2xvdFRhcmdldDtcbiAgICB9XG4gICAgaWYgKGVsLnRhZyA9PT0gJ3RlbXBsYXRlJykge1xuICAgICAgZWwuc2xvdFNjb3BlID0gZ2V0QW5kUmVtb3ZlQXR0cihlbCwgJ3Njb3BlJyk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHByb2Nlc3NDb21wb25lbnQgKGVsKSB7XG4gIHZhciBiaW5kaW5nO1xuICBpZiAoKGJpbmRpbmcgPSBnZXRCaW5kaW5nQXR0cihlbCwgJ2lzJykpKSB7XG4gICAgZWwuY29tcG9uZW50ID0gYmluZGluZztcbiAgfVxuICBpZiAoZ2V0QW5kUmVtb3ZlQXR0cihlbCwgJ2lubGluZS10ZW1wbGF0ZScpICE9IG51bGwpIHtcbiAgICBlbC5pbmxpbmVUZW1wbGF0ZSA9IHRydWU7XG4gIH1cbn1cblxuZnVuY3Rpb24gcHJvY2Vzc0F0dHJzIChlbCkge1xuICB2YXIgbGlzdCA9IGVsLmF0dHJzTGlzdDtcbiAgdmFyIGksIGwsIG5hbWUsIHJhd05hbWUsIHZhbHVlLCBhcmcsIG1vZGlmaWVycywgaXNQcm9wO1xuICBmb3IgKGkgPSAwLCBsID0gbGlzdC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBuYW1lID0gcmF3TmFtZSA9IGxpc3RbaV0ubmFtZTtcbiAgICB2YWx1ZSA9IGxpc3RbaV0udmFsdWU7XG4gICAgaWYgKGRpclJFLnRlc3QobmFtZSkpIHtcbiAgICAgIC8vIG1hcmsgZWxlbWVudCBhcyBkeW5hbWljXG4gICAgICBlbC5oYXNCaW5kaW5ncyA9IHRydWU7XG4gICAgICAvLyBtb2RpZmllcnNcbiAgICAgIG1vZGlmaWVycyA9IHBhcnNlTW9kaWZpZXJzKG5hbWUpO1xuICAgICAgaWYgKG1vZGlmaWVycykge1xuICAgICAgICBuYW1lID0gbmFtZS5yZXBsYWNlKG1vZGlmaWVyUkUsICcnKTtcbiAgICAgIH1cbiAgICAgIGlmIChiaW5kUkUudGVzdChuYW1lKSkgeyAvLyB2LWJpbmRcbiAgICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZShiaW5kUkUsICcnKTtcbiAgICAgICAgdmFsdWUgPSBwYXJzZUZpbHRlcnModmFsdWUpO1xuICAgICAgICBpc1Byb3AgPSBmYWxzZTtcbiAgICAgICAgaWYgKG1vZGlmaWVycykge1xuICAgICAgICAgIGlmIChtb2RpZmllcnMucHJvcCkge1xuICAgICAgICAgICAgaXNQcm9wID0gdHJ1ZTtcbiAgICAgICAgICAgIG5hbWUgPSBjYW1lbGl6ZShuYW1lKTtcbiAgICAgICAgICAgIGlmIChuYW1lID09PSAnaW5uZXJIdG1sJykgeyBuYW1lID0gJ2lubmVySFRNTCc7IH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKG1vZGlmaWVycy5jYW1lbCkge1xuICAgICAgICAgICAgbmFtZSA9IGNhbWVsaXplKG5hbWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNQcm9wIHx8IHBsYXRmb3JtTXVzdFVzZVByb3AoZWwudGFnLCBlbC5hdHRyc01hcC50eXBlLCBuYW1lKSkge1xuICAgICAgICAgIGFkZFByb3AoZWwsIG5hbWUsIHZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhZGRBdHRyKGVsLCBuYW1lLCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAob25SRS50ZXN0KG5hbWUpKSB7IC8vIHYtb25cbiAgICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZShvblJFLCAnJyk7XG4gICAgICAgIGFkZEhhbmRsZXIoZWwsIG5hbWUsIHZhbHVlLCBtb2RpZmllcnMpO1xuICAgICAgfSBlbHNlIHsgLy8gbm9ybWFsIGRpcmVjdGl2ZXNcbiAgICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZShkaXJSRSwgJycpO1xuICAgICAgICAvLyBwYXJzZSBhcmdcbiAgICAgICAgdmFyIGFyZ01hdGNoID0gbmFtZS5tYXRjaChhcmdSRSk7XG4gICAgICAgIGlmIChhcmdNYXRjaCAmJiAoYXJnID0gYXJnTWF0Y2hbMV0pKSB7XG4gICAgICAgICAgbmFtZSA9IG5hbWUuc2xpY2UoMCwgLShhcmcubGVuZ3RoICsgMSkpO1xuICAgICAgICB9XG4gICAgICAgIGFkZERpcmVjdGl2ZShlbCwgbmFtZSwgcmF3TmFtZSwgdmFsdWUsIGFyZywgbW9kaWZpZXJzKTtcbiAgICAgICAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmIG5hbWUgPT09ICdtb2RlbCcpIHtcbiAgICAgICAgICBjaGVja0ZvckFsaWFzTW9kZWwoZWwsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBsaXRlcmFsIGF0dHJpYnV0ZVxuICAgICAge1xuICAgICAgICB2YXIgZXhwcmVzc2lvbiA9IHBhcnNlVGV4dCh2YWx1ZSwgZGVsaW1pdGVycyk7XG4gICAgICAgIGlmIChleHByZXNzaW9uKSB7XG4gICAgICAgICAgd2FybiQyKFxuICAgICAgICAgICAgbmFtZSArIFwiPVxcXCJcIiArIHZhbHVlICsgXCJcXFwiOiBcIiArXG4gICAgICAgICAgICAnSW50ZXJwb2xhdGlvbiBpbnNpZGUgYXR0cmlidXRlcyBoYXMgYmVlbiByZW1vdmVkLiAnICtcbiAgICAgICAgICAgICdVc2Ugdi1iaW5kIG9yIHRoZSBjb2xvbiBzaG9ydGhhbmQgaW5zdGVhZC4gRm9yIGV4YW1wbGUsICcgK1xuICAgICAgICAgICAgJ2luc3RlYWQgb2YgPGRpdiBpZD1cInt7IHZhbCB9fVwiPiwgdXNlIDxkaXYgOmlkPVwidmFsXCI+LidcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBhZGRBdHRyKGVsLCBuYW1lLCBKU09OLnN0cmluZ2lmeSh2YWx1ZSkpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBjaGVja0luRm9yIChlbCkge1xuICB2YXIgcGFyZW50ID0gZWw7XG4gIHdoaWxlIChwYXJlbnQpIHtcbiAgICBpZiAocGFyZW50LmZvciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50O1xuICB9XG4gIHJldHVybiBmYWxzZVxufVxuXG5mdW5jdGlvbiBwYXJzZU1vZGlmaWVycyAobmFtZSkge1xuICB2YXIgbWF0Y2ggPSBuYW1lLm1hdGNoKG1vZGlmaWVyUkUpO1xuICBpZiAobWF0Y2gpIHtcbiAgICB2YXIgcmV0ID0ge307XG4gICAgbWF0Y2guZm9yRWFjaChmdW5jdGlvbiAobSkgeyByZXRbbS5zbGljZSgxKV0gPSB0cnVlOyB9KTtcbiAgICByZXR1cm4gcmV0XG4gIH1cbn1cblxuZnVuY3Rpb24gbWFrZUF0dHJzTWFwIChhdHRycykge1xuICB2YXIgbWFwID0ge307XG4gIGZvciAodmFyIGkgPSAwLCBsID0gYXR0cnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmIG1hcFthdHRyc1tpXS5uYW1lXSAmJiAhaXNJRSkge1xuICAgICAgd2FybiQyKCdkdXBsaWNhdGUgYXR0cmlidXRlOiAnICsgYXR0cnNbaV0ubmFtZSk7XG4gICAgfVxuICAgIG1hcFthdHRyc1tpXS5uYW1lXSA9IGF0dHJzW2ldLnZhbHVlO1xuICB9XG4gIHJldHVybiBtYXBcbn1cblxuZnVuY3Rpb24gaXNGb3JiaWRkZW5UYWcgKGVsKSB7XG4gIHJldHVybiAoXG4gICAgZWwudGFnID09PSAnc3R5bGUnIHx8XG4gICAgKGVsLnRhZyA9PT0gJ3NjcmlwdCcgJiYgKFxuICAgICAgIWVsLmF0dHJzTWFwLnR5cGUgfHxcbiAgICAgIGVsLmF0dHJzTWFwLnR5cGUgPT09ICd0ZXh0L2phdmFzY3JpcHQnXG4gICAgKSlcbiAgKVxufVxuXG52YXIgaWVOU0J1ZyA9IC9eeG1sbnM6TlNcXGQrLztcbnZhciBpZU5TUHJlZml4ID0gL15OU1xcZCs6LztcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbmZ1bmN0aW9uIGd1YXJkSUVTVkdCdWcgKGF0dHJzKSB7XG4gIHZhciByZXMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhdHRycy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBhdHRyID0gYXR0cnNbaV07XG4gICAgaWYgKCFpZU5TQnVnLnRlc3QoYXR0ci5uYW1lKSkge1xuICAgICAgYXR0ci5uYW1lID0gYXR0ci5uYW1lLnJlcGxhY2UoaWVOU1ByZWZpeCwgJycpO1xuICAgICAgcmVzLnB1c2goYXR0cik7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXNcbn1cblxuZnVuY3Rpb24gY2hlY2tGb3JBbGlhc01vZGVsIChlbCwgdmFsdWUpIHtcbiAgdmFyIF9lbCA9IGVsO1xuICB3aGlsZSAoX2VsKSB7XG4gICAgaWYgKF9lbC5mb3IgJiYgX2VsLmFsaWFzID09PSB2YWx1ZSkge1xuICAgICAgd2FybiQyKFxuICAgICAgICBcIjxcIiArIChlbC50YWcpICsgXCIgdi1tb2RlbD1cXFwiXCIgKyB2YWx1ZSArIFwiXFxcIj46IFwiICtcbiAgICAgICAgXCJZb3UgYXJlIGJpbmRpbmcgdi1tb2RlbCBkaXJlY3RseSB0byBhIHYtZm9yIGl0ZXJhdGlvbiBhbGlhcy4gXCIgK1xuICAgICAgICBcIlRoaXMgd2lsbCBub3QgYmUgYWJsZSB0byBtb2RpZnkgdGhlIHYtZm9yIHNvdXJjZSBhcnJheSBiZWNhdXNlIFwiICtcbiAgICAgICAgXCJ3cml0aW5nIHRvIHRoZSBhbGlhcyBpcyBsaWtlIG1vZGlmeWluZyBhIGZ1bmN0aW9uIGxvY2FsIHZhcmlhYmxlLiBcIiArXG4gICAgICAgIFwiQ29uc2lkZXIgdXNpbmcgYW4gYXJyYXkgb2Ygb2JqZWN0cyBhbmQgdXNlIHYtbW9kZWwgb24gYW4gb2JqZWN0IHByb3BlcnR5IGluc3RlYWQuXCJcbiAgICAgICk7XG4gICAgfVxuICAgIF9lbCA9IF9lbC5wYXJlbnQ7XG4gIH1cbn1cblxuLyogICovXG5cbnZhciBpc1N0YXRpY0tleTtcbnZhciBpc1BsYXRmb3JtUmVzZXJ2ZWRUYWc7XG5cbnZhciBnZW5TdGF0aWNLZXlzQ2FjaGVkID0gY2FjaGVkKGdlblN0YXRpY0tleXMkMSk7XG5cbi8qKlxuICogR29hbCBvZiB0aGUgb3B0aW1pemVyOiB3YWxrIHRoZSBnZW5lcmF0ZWQgdGVtcGxhdGUgQVNUIHRyZWVcbiAqIGFuZCBkZXRlY3Qgc3ViLXRyZWVzIHRoYXQgYXJlIHB1cmVseSBzdGF0aWMsIGkuZS4gcGFydHMgb2ZcbiAqIHRoZSBET00gdGhhdCBuZXZlciBuZWVkcyB0byBjaGFuZ2UuXG4gKlxuICogT25jZSB3ZSBkZXRlY3QgdGhlc2Ugc3ViLXRyZWVzLCB3ZSBjYW46XG4gKlxuICogMS4gSG9pc3QgdGhlbSBpbnRvIGNvbnN0YW50cywgc28gdGhhdCB3ZSBubyBsb25nZXIgbmVlZCB0b1xuICogICAgY3JlYXRlIGZyZXNoIG5vZGVzIGZvciB0aGVtIG9uIGVhY2ggcmUtcmVuZGVyO1xuICogMi4gQ29tcGxldGVseSBza2lwIHRoZW0gaW4gdGhlIHBhdGNoaW5nIHByb2Nlc3MuXG4gKi9cbmZ1bmN0aW9uIG9wdGltaXplIChyb290LCBvcHRpb25zKSB7XG4gIGlmICghcm9vdCkgeyByZXR1cm4gfVxuICBpc1N0YXRpY0tleSA9IGdlblN0YXRpY0tleXNDYWNoZWQob3B0aW9ucy5zdGF0aWNLZXlzIHx8ICcnKTtcbiAgaXNQbGF0Zm9ybVJlc2VydmVkVGFnID0gb3B0aW9ucy5pc1Jlc2VydmVkVGFnIHx8IG5vO1xuICAvLyBmaXJzdCBwYXNzOiBtYXJrIGFsbCBub24tc3RhdGljIG5vZGVzLlxuICBtYXJrU3RhdGljJDEocm9vdCk7XG4gIC8vIHNlY29uZCBwYXNzOiBtYXJrIHN0YXRpYyByb290cy5cbiAgbWFya1N0YXRpY1Jvb3RzKHJvb3QsIGZhbHNlKTtcbn1cblxuZnVuY3Rpb24gZ2VuU3RhdGljS2V5cyQxIChrZXlzKSB7XG4gIHJldHVybiBtYWtlTWFwKFxuICAgICd0eXBlLHRhZyxhdHRyc0xpc3QsYXR0cnNNYXAscGxhaW4scGFyZW50LGNoaWxkcmVuLGF0dHJzJyArXG4gICAgKGtleXMgPyAnLCcgKyBrZXlzIDogJycpXG4gIClcbn1cblxuZnVuY3Rpb24gbWFya1N0YXRpYyQxIChub2RlKSB7XG4gIG5vZGUuc3RhdGljID0gaXNTdGF0aWMobm9kZSk7XG4gIGlmIChub2RlLnR5cGUgPT09IDEpIHtcbiAgICAvLyBkbyBub3QgbWFrZSBjb21wb25lbnQgc2xvdCBjb250ZW50IHN0YXRpYy4gdGhpcyBhdm9pZHNcbiAgICAvLyAxLiBjb21wb25lbnRzIG5vdCBhYmxlIHRvIG11dGF0ZSBzbG90IG5vZGVzXG4gICAgLy8gMi4gc3RhdGljIHNsb3QgY29udGVudCBmYWlscyBmb3IgaG90LXJlbG9hZGluZ1xuICAgIGlmIChcbiAgICAgICFpc1BsYXRmb3JtUmVzZXJ2ZWRUYWcobm9kZS50YWcpICYmXG4gICAgICBub2RlLnRhZyAhPT0gJ3Nsb3QnICYmXG4gICAgICBub2RlLmF0dHJzTWFwWydpbmxpbmUtdGVtcGxhdGUnXSA9PSBudWxsXG4gICAgKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBub2RlLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgdmFyIGNoaWxkID0gbm9kZS5jaGlsZHJlbltpXTtcbiAgICAgIG1hcmtTdGF0aWMkMShjaGlsZCk7XG4gICAgICBpZiAoIWNoaWxkLnN0YXRpYykge1xuICAgICAgICBub2RlLnN0YXRpYyA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBtYXJrU3RhdGljUm9vdHMgKG5vZGUsIGlzSW5Gb3IpIHtcbiAgaWYgKG5vZGUudHlwZSA9PT0gMSkge1xuICAgIGlmIChub2RlLnN0YXRpYyB8fCBub2RlLm9uY2UpIHtcbiAgICAgIG5vZGUuc3RhdGljSW5Gb3IgPSBpc0luRm9yO1xuICAgIH1cbiAgICAvLyBGb3IgYSBub2RlIHRvIHF1YWxpZnkgYXMgYSBzdGF0aWMgcm9vdCwgaXQgc2hvdWxkIGhhdmUgY2hpbGRyZW4gdGhhdFxuICAgIC8vIGFyZSBub3QganVzdCBzdGF0aWMgdGV4dC4gT3RoZXJ3aXNlIHRoZSBjb3N0IG9mIGhvaXN0aW5nIG91dCB3aWxsXG4gICAgLy8gb3V0d2VpZ2ggdGhlIGJlbmVmaXRzIGFuZCBpdCdzIGJldHRlciBvZmYgdG8ganVzdCBhbHdheXMgcmVuZGVyIGl0IGZyZXNoLlxuICAgIGlmIChub2RlLnN0YXRpYyAmJiBub2RlLmNoaWxkcmVuLmxlbmd0aCAmJiAhKFxuICAgICAgbm9kZS5jaGlsZHJlbi5sZW5ndGggPT09IDEgJiZcbiAgICAgIG5vZGUuY2hpbGRyZW5bMF0udHlwZSA9PT0gM1xuICAgICkpIHtcbiAgICAgIG5vZGUuc3RhdGljUm9vdCA9IHRydWU7XG4gICAgICByZXR1cm5cbiAgICB9IGVsc2Uge1xuICAgICAgbm9kZS5zdGF0aWNSb290ID0gZmFsc2U7XG4gICAgfVxuICAgIGlmIChub2RlLmNoaWxkcmVuKSB7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbCA9IG5vZGUuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIG1hcmtTdGF0aWNSb290cyhub2RlLmNoaWxkcmVuW2ldLCBpc0luRm9yIHx8ICEhbm9kZS5mb3IpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAobm9kZS5pZkNvbmRpdGlvbnMpIHtcbiAgICAgIHdhbGtUaHJvdWdoQ29uZGl0aW9uc0Jsb2Nrcyhub2RlLmlmQ29uZGl0aW9ucywgaXNJbkZvcik7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHdhbGtUaHJvdWdoQ29uZGl0aW9uc0Jsb2NrcyAoY29uZGl0aW9uQmxvY2tzLCBpc0luRm9yKSB7XG4gIGZvciAodmFyIGkgPSAxLCBsZW4gPSBjb25kaXRpb25CbG9ja3MubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBtYXJrU3RhdGljUm9vdHMoY29uZGl0aW9uQmxvY2tzW2ldLmJsb2NrLCBpc0luRm9yKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBpc1N0YXRpYyAobm9kZSkge1xuICBpZiAobm9kZS50eXBlID09PSAyKSB7IC8vIGV4cHJlc3Npb25cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuICBpZiAobm9kZS50eXBlID09PSAzKSB7IC8vIHRleHRcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG4gIHJldHVybiAhIShub2RlLnByZSB8fCAoXG4gICAgIW5vZGUuaGFzQmluZGluZ3MgJiYgLy8gbm8gZHluYW1pYyBiaW5kaW5nc1xuICAgICFub2RlLmlmICYmICFub2RlLmZvciAmJiAvLyBub3Qgdi1pZiBvciB2LWZvciBvciB2LWVsc2VcbiAgICAhaXNCdWlsdEluVGFnKG5vZGUudGFnKSAmJiAvLyBub3QgYSBidWlsdC1pblxuICAgIGlzUGxhdGZvcm1SZXNlcnZlZFRhZyhub2RlLnRhZykgJiYgLy8gbm90IGEgY29tcG9uZW50XG4gICAgIWlzRGlyZWN0Q2hpbGRPZlRlbXBsYXRlRm9yKG5vZGUpICYmXG4gICAgT2JqZWN0LmtleXMobm9kZSkuZXZlcnkoaXNTdGF0aWNLZXkpXG4gICkpXG59XG5cbmZ1bmN0aW9uIGlzRGlyZWN0Q2hpbGRPZlRlbXBsYXRlRm9yIChub2RlKSB7XG4gIHdoaWxlIChub2RlLnBhcmVudCkge1xuICAgIG5vZGUgPSBub2RlLnBhcmVudDtcbiAgICBpZiAobm9kZS50YWcgIT09ICd0ZW1wbGF0ZScpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICBpZiAobm9kZS5mb3IpIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZVxufVxuXG4vKiAgKi9cblxudmFyIGZuRXhwUkUgPSAvXlxccyooW1xcdyRfXSt8XFwoW14pXSo/XFwpKVxccyo9PnxeZnVuY3Rpb25cXHMqXFwoLztcbnZhciBzaW1wbGVQYXRoUkUgPSAvXlxccypbQS1aYS16XyRdW1xcdyRdKig/OlxcLltBLVphLXpfJF1bXFx3JF0qfFxcWycuKj8nXXxcXFtcIi4qP1wiXXxcXFtcXGQrXXxcXFtbQS1aYS16XyRdW1xcdyRdKl0pKlxccyokLztcblxuLy8ga2V5Q29kZSBhbGlhc2VzXG52YXIga2V5Q29kZXMgPSB7XG4gIGVzYzogMjcsXG4gIHRhYjogOSxcbiAgZW50ZXI6IDEzLFxuICBzcGFjZTogMzIsXG4gIHVwOiAzOCxcbiAgbGVmdDogMzcsXG4gIHJpZ2h0OiAzOSxcbiAgZG93bjogNDAsXG4gICdkZWxldGUnOiBbOCwgNDZdXG59O1xuXG4vLyAjNDg2ODogbW9kaWZpZXJzIHRoYXQgcHJldmVudCB0aGUgZXhlY3V0aW9uIG9mIHRoZSBsaXN0ZW5lclxuLy8gbmVlZCB0byBleHBsaWNpdGx5IHJldHVybiBudWxsIHNvIHRoYXQgd2UgY2FuIGRldGVybWluZSB3aGV0aGVyIHRvIHJlbW92ZVxuLy8gdGhlIGxpc3RlbmVyIGZvciAub25jZVxudmFyIGdlbkd1YXJkID0gZnVuY3Rpb24gKGNvbmRpdGlvbikgeyByZXR1cm4gKFwiaWYoXCIgKyBjb25kaXRpb24gKyBcIilyZXR1cm4gbnVsbDtcIik7IH07XG5cbnZhciBtb2RpZmllckNvZGUgPSB7XG4gIHN0b3A6ICckZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7JyxcbiAgcHJldmVudDogJyRldmVudC5wcmV2ZW50RGVmYXVsdCgpOycsXG4gIHNlbGY6IGdlbkd1YXJkKFwiJGV2ZW50LnRhcmdldCAhPT0gJGV2ZW50LmN1cnJlbnRUYXJnZXRcIiksXG4gIGN0cmw6IGdlbkd1YXJkKFwiISRldmVudC5jdHJsS2V5XCIpLFxuICBzaGlmdDogZ2VuR3VhcmQoXCIhJGV2ZW50LnNoaWZ0S2V5XCIpLFxuICBhbHQ6IGdlbkd1YXJkKFwiISRldmVudC5hbHRLZXlcIiksXG4gIG1ldGE6IGdlbkd1YXJkKFwiISRldmVudC5tZXRhS2V5XCIpLFxuICBsZWZ0OiBnZW5HdWFyZChcIididXR0b24nIGluICRldmVudCAmJiAkZXZlbnQuYnV0dG9uICE9PSAwXCIpLFxuICBtaWRkbGU6IGdlbkd1YXJkKFwiJ2J1dHRvbicgaW4gJGV2ZW50ICYmICRldmVudC5idXR0b24gIT09IDFcIiksXG4gIHJpZ2h0OiBnZW5HdWFyZChcIididXR0b24nIGluICRldmVudCAmJiAkZXZlbnQuYnV0dG9uICE9PSAyXCIpXG59O1xuXG5mdW5jdGlvbiBnZW5IYW5kbGVycyAoZXZlbnRzLCBuYXRpdmUpIHtcbiAgdmFyIHJlcyA9IG5hdGl2ZSA/ICduYXRpdmVPbjp7JyA6ICdvbjp7JztcbiAgZm9yICh2YXIgbmFtZSBpbiBldmVudHMpIHtcbiAgICByZXMgKz0gXCJcXFwiXCIgKyBuYW1lICsgXCJcXFwiOlwiICsgKGdlbkhhbmRsZXIobmFtZSwgZXZlbnRzW25hbWVdKSkgKyBcIixcIjtcbiAgfVxuICByZXR1cm4gcmVzLnNsaWNlKDAsIC0xKSArICd9J1xufVxuXG5mdW5jdGlvbiBnZW5IYW5kbGVyIChcbiAgbmFtZSxcbiAgaGFuZGxlclxuKSB7XG4gIGlmICghaGFuZGxlcikge1xuICAgIHJldHVybiAnZnVuY3Rpb24oKXt9J1xuICB9XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkoaGFuZGxlcikpIHtcbiAgICByZXR1cm4gKFwiW1wiICsgKGhhbmRsZXIubWFwKGZ1bmN0aW9uIChoYW5kbGVyKSB7IHJldHVybiBnZW5IYW5kbGVyKG5hbWUsIGhhbmRsZXIpOyB9KS5qb2luKCcsJykpICsgXCJdXCIpXG4gIH1cblxuICB2YXIgaXNNZXRob2RQYXRoID0gc2ltcGxlUGF0aFJFLnRlc3QoaGFuZGxlci52YWx1ZSk7XG4gIHZhciBpc0Z1bmN0aW9uRXhwcmVzc2lvbiA9IGZuRXhwUkUudGVzdChoYW5kbGVyLnZhbHVlKTtcblxuICBpZiAoIWhhbmRsZXIubW9kaWZpZXJzKSB7XG4gICAgcmV0dXJuIGlzTWV0aG9kUGF0aCB8fCBpc0Z1bmN0aW9uRXhwcmVzc2lvblxuICAgICAgPyBoYW5kbGVyLnZhbHVlXG4gICAgICA6IChcImZ1bmN0aW9uKCRldmVudCl7XCIgKyAoaGFuZGxlci52YWx1ZSkgKyBcIn1cIikgLy8gaW5saW5lIHN0YXRlbWVudFxuICB9IGVsc2Uge1xuICAgIHZhciBjb2RlID0gJyc7XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gaGFuZGxlci5tb2RpZmllcnMpIHtcbiAgICAgIGlmIChtb2RpZmllckNvZGVba2V5XSkge1xuICAgICAgICBjb2RlICs9IG1vZGlmaWVyQ29kZVtrZXldO1xuICAgICAgICAvLyBsZWZ0L3JpZ2h0XG4gICAgICAgIGlmIChrZXlDb2Rlc1trZXldKSB7XG4gICAgICAgICAga2V5cy5wdXNoKGtleSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGtleXMucHVzaChrZXkpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoa2V5cy5sZW5ndGgpIHtcbiAgICAgIGNvZGUgKz0gZ2VuS2V5RmlsdGVyKGtleXMpO1xuICAgIH1cbiAgICB2YXIgaGFuZGxlckNvZGUgPSBpc01ldGhvZFBhdGhcbiAgICAgID8gaGFuZGxlci52YWx1ZSArICcoJGV2ZW50KSdcbiAgICAgIDogaXNGdW5jdGlvbkV4cHJlc3Npb25cbiAgICAgICAgPyAoXCIoXCIgKyAoaGFuZGxlci52YWx1ZSkgKyBcIikoJGV2ZW50KVwiKVxuICAgICAgICA6IGhhbmRsZXIudmFsdWU7XG4gICAgcmV0dXJuIChcImZ1bmN0aW9uKCRldmVudCl7XCIgKyBjb2RlICsgaGFuZGxlckNvZGUgKyBcIn1cIilcbiAgfVxufVxuXG5mdW5jdGlvbiBnZW5LZXlGaWx0ZXIgKGtleXMpIHtcbiAgcmV0dXJuIChcImlmKCEoJ2J1dHRvbicgaW4gJGV2ZW50KSYmXCIgKyAoa2V5cy5tYXAoZ2VuRmlsdGVyQ29kZSkuam9pbignJiYnKSkgKyBcIilyZXR1cm4gbnVsbDtcIilcbn1cblxuZnVuY3Rpb24gZ2VuRmlsdGVyQ29kZSAoa2V5KSB7XG4gIHZhciBrZXlWYWwgPSBwYXJzZUludChrZXksIDEwKTtcbiAgaWYgKGtleVZhbCkge1xuICAgIHJldHVybiAoXCIkZXZlbnQua2V5Q29kZSE9PVwiICsga2V5VmFsKVxuICB9XG4gIHZhciBhbGlhcyA9IGtleUNvZGVzW2tleV07XG4gIHJldHVybiAoXCJfaygkZXZlbnQua2V5Q29kZSxcIiArIChKU09OLnN0cmluZ2lmeShrZXkpKSArIChhbGlhcyA/ICcsJyArIEpTT04uc3RyaW5naWZ5KGFsaWFzKSA6ICcnKSArIFwiKVwiKVxufVxuXG4vKiAgKi9cblxuZnVuY3Rpb24gYmluZCQxIChlbCwgZGlyKSB7XG4gIGVsLndyYXBEYXRhID0gZnVuY3Rpb24gKGNvZGUpIHtcbiAgICByZXR1cm4gKFwiX2IoXCIgKyBjb2RlICsgXCIsJ1wiICsgKGVsLnRhZykgKyBcIicsXCIgKyAoZGlyLnZhbHVlKSArIChkaXIubW9kaWZpZXJzICYmIGRpci5tb2RpZmllcnMucHJvcCA/ICcsdHJ1ZScgOiAnJykgKyBcIilcIilcbiAgfTtcbn1cblxuLyogICovXG5cbnZhciBiYXNlRGlyZWN0aXZlcyA9IHtcbiAgYmluZDogYmluZCQxLFxuICBjbG9hazogbm9vcFxufTtcblxuLyogICovXG5cbi8vIGNvbmZpZ3VyYWJsZSBzdGF0ZVxudmFyIHdhcm4kMztcbnZhciB0cmFuc2Zvcm1zJDE7XG52YXIgZGF0YUdlbkZucztcbnZhciBwbGF0Zm9ybURpcmVjdGl2ZXMkMTtcbnZhciBpc1BsYXRmb3JtUmVzZXJ2ZWRUYWckMTtcbnZhciBzdGF0aWNSZW5kZXJGbnM7XG52YXIgb25jZUNvdW50O1xudmFyIGN1cnJlbnRPcHRpb25zO1xuXG5mdW5jdGlvbiBnZW5lcmF0ZSAoXG4gIGFzdCxcbiAgb3B0aW9uc1xuKSB7XG4gIC8vIHNhdmUgcHJldmlvdXMgc3RhdGljUmVuZGVyRm5zIHNvIGdlbmVyYXRlIGNhbGxzIGNhbiBiZSBuZXN0ZWRcbiAgdmFyIHByZXZTdGF0aWNSZW5kZXJGbnMgPSBzdGF0aWNSZW5kZXJGbnM7XG4gIHZhciBjdXJyZW50U3RhdGljUmVuZGVyRm5zID0gc3RhdGljUmVuZGVyRm5zID0gW107XG4gIHZhciBwcmV2T25jZUNvdW50ID0gb25jZUNvdW50O1xuICBvbmNlQ291bnQgPSAwO1xuICBjdXJyZW50T3B0aW9ucyA9IG9wdGlvbnM7XG4gIHdhcm4kMyA9IG9wdGlvbnMud2FybiB8fCBiYXNlV2FybjtcbiAgdHJhbnNmb3JtcyQxID0gcGx1Y2tNb2R1bGVGdW5jdGlvbihvcHRpb25zLm1vZHVsZXMsICd0cmFuc2Zvcm1Db2RlJyk7XG4gIGRhdGFHZW5GbnMgPSBwbHVja01vZHVsZUZ1bmN0aW9uKG9wdGlvbnMubW9kdWxlcywgJ2dlbkRhdGEnKTtcbiAgcGxhdGZvcm1EaXJlY3RpdmVzJDEgPSBvcHRpb25zLmRpcmVjdGl2ZXMgfHwge307XG4gIGlzUGxhdGZvcm1SZXNlcnZlZFRhZyQxID0gb3B0aW9ucy5pc1Jlc2VydmVkVGFnIHx8IG5vO1xuICB2YXIgY29kZSA9IGFzdCA/IGdlbkVsZW1lbnQoYXN0KSA6ICdfYyhcImRpdlwiKSc7XG4gIHN0YXRpY1JlbmRlckZucyA9IHByZXZTdGF0aWNSZW5kZXJGbnM7XG4gIG9uY2VDb3VudCA9IHByZXZPbmNlQ291bnQ7XG4gIHJldHVybiB7XG4gICAgcmVuZGVyOiAoXCJ3aXRoKHRoaXMpe3JldHVybiBcIiArIGNvZGUgKyBcIn1cIiksXG4gICAgc3RhdGljUmVuZGVyRm5zOiBjdXJyZW50U3RhdGljUmVuZGVyRm5zXG4gIH1cbn1cblxuZnVuY3Rpb24gZ2VuRWxlbWVudCAoZWwpIHtcbiAgaWYgKGVsLnN0YXRpY1Jvb3QgJiYgIWVsLnN0YXRpY1Byb2Nlc3NlZCkge1xuICAgIHJldHVybiBnZW5TdGF0aWMoZWwpXG4gIH0gZWxzZSBpZiAoZWwub25jZSAmJiAhZWwub25jZVByb2Nlc3NlZCkge1xuICAgIHJldHVybiBnZW5PbmNlKGVsKVxuICB9IGVsc2UgaWYgKGVsLmZvciAmJiAhZWwuZm9yUHJvY2Vzc2VkKSB7XG4gICAgcmV0dXJuIGdlbkZvcihlbClcbiAgfSBlbHNlIGlmIChlbC5pZiAmJiAhZWwuaWZQcm9jZXNzZWQpIHtcbiAgICByZXR1cm4gZ2VuSWYoZWwpXG4gIH0gZWxzZSBpZiAoZWwudGFnID09PSAndGVtcGxhdGUnICYmICFlbC5zbG90VGFyZ2V0KSB7XG4gICAgcmV0dXJuIGdlbkNoaWxkcmVuKGVsKSB8fCAndm9pZCAwJ1xuICB9IGVsc2UgaWYgKGVsLnRhZyA9PT0gJ3Nsb3QnKSB7XG4gICAgcmV0dXJuIGdlblNsb3QoZWwpXG4gIH0gZWxzZSB7XG4gICAgLy8gY29tcG9uZW50IG9yIGVsZW1lbnRcbiAgICB2YXIgY29kZTtcbiAgICBpZiAoZWwuY29tcG9uZW50KSB7XG4gICAgICBjb2RlID0gZ2VuQ29tcG9uZW50KGVsLmNvbXBvbmVudCwgZWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgZGF0YSA9IGVsLnBsYWluID8gdW5kZWZpbmVkIDogZ2VuRGF0YShlbCk7XG5cbiAgICAgIHZhciBjaGlsZHJlbiA9IGVsLmlubGluZVRlbXBsYXRlID8gbnVsbCA6IGdlbkNoaWxkcmVuKGVsLCB0cnVlKTtcbiAgICAgIGNvZGUgPSBcIl9jKCdcIiArIChlbC50YWcpICsgXCInXCIgKyAoZGF0YSA/IChcIixcIiArIGRhdGEpIDogJycpICsgKGNoaWxkcmVuID8gKFwiLFwiICsgY2hpbGRyZW4pIDogJycpICsgXCIpXCI7XG4gICAgfVxuICAgIC8vIG1vZHVsZSB0cmFuc2Zvcm1zXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0cmFuc2Zvcm1zJDEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvZGUgPSB0cmFuc2Zvcm1zJDFbaV0oZWwsIGNvZGUpO1xuICAgIH1cbiAgICByZXR1cm4gY29kZVxuICB9XG59XG5cbi8vIGhvaXN0IHN0YXRpYyBzdWItdHJlZXMgb3V0XG5mdW5jdGlvbiBnZW5TdGF0aWMgKGVsKSB7XG4gIGVsLnN0YXRpY1Byb2Nlc3NlZCA9IHRydWU7XG4gIHN0YXRpY1JlbmRlckZucy5wdXNoKChcIndpdGgodGhpcyl7cmV0dXJuIFwiICsgKGdlbkVsZW1lbnQoZWwpKSArIFwifVwiKSk7XG4gIHJldHVybiAoXCJfbShcIiArIChzdGF0aWNSZW5kZXJGbnMubGVuZ3RoIC0gMSkgKyAoZWwuc3RhdGljSW5Gb3IgPyAnLHRydWUnIDogJycpICsgXCIpXCIpXG59XG5cbi8vIHYtb25jZVxuZnVuY3Rpb24gZ2VuT25jZSAoZWwpIHtcbiAgZWwub25jZVByb2Nlc3NlZCA9IHRydWU7XG4gIGlmIChlbC5pZiAmJiAhZWwuaWZQcm9jZXNzZWQpIHtcbiAgICByZXR1cm4gZ2VuSWYoZWwpXG4gIH0gZWxzZSBpZiAoZWwuc3RhdGljSW5Gb3IpIHtcbiAgICB2YXIga2V5ID0gJyc7XG4gICAgdmFyIHBhcmVudCA9IGVsLnBhcmVudDtcbiAgICB3aGlsZSAocGFyZW50KSB7XG4gICAgICBpZiAocGFyZW50LmZvcikge1xuICAgICAgICBrZXkgPSBwYXJlbnQua2V5O1xuICAgICAgICBicmVha1xuICAgICAgfVxuICAgICAgcGFyZW50ID0gcGFyZW50LnBhcmVudDtcbiAgICB9XG4gICAgaWYgKCFrZXkpIHtcbiAgICAgIFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmIHdhcm4kMyhcbiAgICAgICAgXCJ2LW9uY2UgY2FuIG9ubHkgYmUgdXNlZCBpbnNpZGUgdi1mb3IgdGhhdCBpcyBrZXllZC4gXCJcbiAgICAgICk7XG4gICAgICByZXR1cm4gZ2VuRWxlbWVudChlbClcbiAgICB9XG4gICAgcmV0dXJuIChcIl9vKFwiICsgKGdlbkVsZW1lbnQoZWwpKSArIFwiLFwiICsgKG9uY2VDb3VudCsrKSArIChrZXkgPyAoXCIsXCIgKyBrZXkpIDogXCJcIikgKyBcIilcIilcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZ2VuU3RhdGljKGVsKVxuICB9XG59XG5cbmZ1bmN0aW9uIGdlbklmIChlbCkge1xuICBlbC5pZlByb2Nlc3NlZCA9IHRydWU7IC8vIGF2b2lkIHJlY3Vyc2lvblxuICByZXR1cm4gZ2VuSWZDb25kaXRpb25zKGVsLmlmQ29uZGl0aW9ucy5zbGljZSgpKVxufVxuXG5mdW5jdGlvbiBnZW5JZkNvbmRpdGlvbnMgKGNvbmRpdGlvbnMpIHtcbiAgaWYgKCFjb25kaXRpb25zLmxlbmd0aCkge1xuICAgIHJldHVybiAnX2UoKSdcbiAgfVxuXG4gIHZhciBjb25kaXRpb24gPSBjb25kaXRpb25zLnNoaWZ0KCk7XG4gIGlmIChjb25kaXRpb24uZXhwKSB7XG4gICAgcmV0dXJuIChcIihcIiArIChjb25kaXRpb24uZXhwKSArIFwiKT9cIiArIChnZW5UZXJuYXJ5RXhwKGNvbmRpdGlvbi5ibG9jaykpICsgXCI6XCIgKyAoZ2VuSWZDb25kaXRpb25zKGNvbmRpdGlvbnMpKSlcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gKFwiXCIgKyAoZ2VuVGVybmFyeUV4cChjb25kaXRpb24uYmxvY2spKSlcbiAgfVxuXG4gIC8vIHYtaWYgd2l0aCB2LW9uY2Ugc2hvdWxkIGdlbmVyYXRlIGNvZGUgbGlrZSAoYSk/X20oMCk6X20oMSlcbiAgZnVuY3Rpb24gZ2VuVGVybmFyeUV4cCAoZWwpIHtcbiAgICByZXR1cm4gZWwub25jZSA/IGdlbk9uY2UoZWwpIDogZ2VuRWxlbWVudChlbClcbiAgfVxufVxuXG5mdW5jdGlvbiBnZW5Gb3IgKGVsKSB7XG4gIHZhciBleHAgPSBlbC5mb3I7XG4gIHZhciBhbGlhcyA9IGVsLmFsaWFzO1xuICB2YXIgaXRlcmF0b3IxID0gZWwuaXRlcmF0b3IxID8gKFwiLFwiICsgKGVsLml0ZXJhdG9yMSkpIDogJyc7XG4gIHZhciBpdGVyYXRvcjIgPSBlbC5pdGVyYXRvcjIgPyAoXCIsXCIgKyAoZWwuaXRlcmF0b3IyKSkgOiAnJztcblxuICBpZiAoXG4gICAgXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiZcbiAgICBtYXliZUNvbXBvbmVudChlbCkgJiYgZWwudGFnICE9PSAnc2xvdCcgJiYgZWwudGFnICE9PSAndGVtcGxhdGUnICYmICFlbC5rZXlcbiAgKSB7XG4gICAgd2FybiQzKFxuICAgICAgXCI8XCIgKyAoZWwudGFnKSArIFwiIHYtZm9yPVxcXCJcIiArIGFsaWFzICsgXCIgaW4gXCIgKyBleHAgKyBcIlxcXCI+OiBjb21wb25lbnQgbGlzdHMgcmVuZGVyZWQgd2l0aCBcIiArXG4gICAgICBcInYtZm9yIHNob3VsZCBoYXZlIGV4cGxpY2l0IGtleXMuIFwiICtcbiAgICAgIFwiU2VlIGh0dHBzOi8vdnVlanMub3JnL2d1aWRlL2xpc3QuaHRtbCNrZXkgZm9yIG1vcmUgaW5mby5cIixcbiAgICAgIHRydWUgLyogdGlwICovXG4gICAgKTtcbiAgfVxuXG4gIGVsLmZvclByb2Nlc3NlZCA9IHRydWU7IC8vIGF2b2lkIHJlY3Vyc2lvblxuICByZXR1cm4gXCJfbCgoXCIgKyBleHAgKyBcIiksXCIgK1xuICAgIFwiZnVuY3Rpb24oXCIgKyBhbGlhcyArIGl0ZXJhdG9yMSArIGl0ZXJhdG9yMiArIFwiKXtcIiArXG4gICAgICBcInJldHVybiBcIiArIChnZW5FbGVtZW50KGVsKSkgK1xuICAgICd9KSdcbn1cblxuZnVuY3Rpb24gZ2VuRGF0YSAoZWwpIHtcbiAgdmFyIGRhdGEgPSAneyc7XG5cbiAgLy8gZGlyZWN0aXZlcyBmaXJzdC5cbiAgLy8gZGlyZWN0aXZlcyBtYXkgbXV0YXRlIHRoZSBlbCdzIG90aGVyIHByb3BlcnRpZXMgYmVmb3JlIHRoZXkgYXJlIGdlbmVyYXRlZC5cbiAgdmFyIGRpcnMgPSBnZW5EaXJlY3RpdmVzKGVsKTtcbiAgaWYgKGRpcnMpIHsgZGF0YSArPSBkaXJzICsgJywnOyB9XG5cbiAgLy8ga2V5XG4gIGlmIChlbC5rZXkpIHtcbiAgICBkYXRhICs9IFwia2V5OlwiICsgKGVsLmtleSkgKyBcIixcIjtcbiAgfVxuICAvLyByZWZcbiAgaWYgKGVsLnJlZikge1xuICAgIGRhdGEgKz0gXCJyZWY6XCIgKyAoZWwucmVmKSArIFwiLFwiO1xuICB9XG4gIGlmIChlbC5yZWZJbkZvcikge1xuICAgIGRhdGEgKz0gXCJyZWZJbkZvcjp0cnVlLFwiO1xuICB9XG4gIC8vIHByZVxuICBpZiAoZWwucHJlKSB7XG4gICAgZGF0YSArPSBcInByZTp0cnVlLFwiO1xuICB9XG4gIC8vIHJlY29yZCBvcmlnaW5hbCB0YWcgbmFtZSBmb3IgY29tcG9uZW50cyB1c2luZyBcImlzXCIgYXR0cmlidXRlXG4gIGlmIChlbC5jb21wb25lbnQpIHtcbiAgICBkYXRhICs9IFwidGFnOlxcXCJcIiArIChlbC50YWcpICsgXCJcXFwiLFwiO1xuICB9XG4gIC8vIG1vZHVsZSBkYXRhIGdlbmVyYXRpb24gZnVuY3Rpb25zXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YUdlbkZucy5sZW5ndGg7IGkrKykge1xuICAgIGRhdGEgKz0gZGF0YUdlbkZuc1tpXShlbCk7XG4gIH1cbiAgLy8gYXR0cmlidXRlc1xuICBpZiAoZWwuYXR0cnMpIHtcbiAgICBkYXRhICs9IFwiYXR0cnM6e1wiICsgKGdlblByb3BzKGVsLmF0dHJzKSkgKyBcIn0sXCI7XG4gIH1cbiAgLy8gRE9NIHByb3BzXG4gIGlmIChlbC5wcm9wcykge1xuICAgIGRhdGEgKz0gXCJkb21Qcm9wczp7XCIgKyAoZ2VuUHJvcHMoZWwucHJvcHMpKSArIFwifSxcIjtcbiAgfVxuICAvLyBldmVudCBoYW5kbGVyc1xuICBpZiAoZWwuZXZlbnRzKSB7XG4gICAgZGF0YSArPSAoZ2VuSGFuZGxlcnMoZWwuZXZlbnRzKSkgKyBcIixcIjtcbiAgfVxuICBpZiAoZWwubmF0aXZlRXZlbnRzKSB7XG4gICAgZGF0YSArPSAoZ2VuSGFuZGxlcnMoZWwubmF0aXZlRXZlbnRzLCB0cnVlKSkgKyBcIixcIjtcbiAgfVxuICAvLyBzbG90IHRhcmdldFxuICBpZiAoZWwuc2xvdFRhcmdldCkge1xuICAgIGRhdGEgKz0gXCJzbG90OlwiICsgKGVsLnNsb3RUYXJnZXQpICsgXCIsXCI7XG4gIH1cbiAgLy8gc2NvcGVkIHNsb3RzXG4gIGlmIChlbC5zY29wZWRTbG90cykge1xuICAgIGRhdGEgKz0gKGdlblNjb3BlZFNsb3RzKGVsLnNjb3BlZFNsb3RzKSkgKyBcIixcIjtcbiAgfVxuICAvLyBjb21wb25lbnQgdi1tb2RlbFxuICBpZiAoZWwubW9kZWwpIHtcbiAgICBkYXRhICs9IFwibW9kZWw6e3ZhbHVlOlwiICsgKGVsLm1vZGVsLnZhbHVlKSArIFwiLGNhbGxiYWNrOlwiICsgKGVsLm1vZGVsLmNhbGxiYWNrKSArIFwiLGV4cHJlc3Npb246XCIgKyAoZWwubW9kZWwuZXhwcmVzc2lvbikgKyBcIn0sXCI7XG4gIH1cbiAgLy8gaW5saW5lLXRlbXBsYXRlXG4gIGlmIChlbC5pbmxpbmVUZW1wbGF0ZSkge1xuICAgIHZhciBpbmxpbmVUZW1wbGF0ZSA9IGdlbklubGluZVRlbXBsYXRlKGVsKTtcbiAgICBpZiAoaW5saW5lVGVtcGxhdGUpIHtcbiAgICAgIGRhdGEgKz0gaW5saW5lVGVtcGxhdGUgKyBcIixcIjtcbiAgICB9XG4gIH1cbiAgZGF0YSA9IGRhdGEucmVwbGFjZSgvLCQvLCAnJykgKyAnfSc7XG4gIC8vIHYtYmluZCBkYXRhIHdyYXBcbiAgaWYgKGVsLndyYXBEYXRhKSB7XG4gICAgZGF0YSA9IGVsLndyYXBEYXRhKGRhdGEpO1xuICB9XG4gIHJldHVybiBkYXRhXG59XG5cbmZ1bmN0aW9uIGdlbkRpcmVjdGl2ZXMgKGVsKSB7XG4gIHZhciBkaXJzID0gZWwuZGlyZWN0aXZlcztcbiAgaWYgKCFkaXJzKSB7IHJldHVybiB9XG4gIHZhciByZXMgPSAnZGlyZWN0aXZlczpbJztcbiAgdmFyIGhhc1J1bnRpbWUgPSBmYWxzZTtcbiAgdmFyIGksIGwsIGRpciwgbmVlZFJ1bnRpbWU7XG4gIGZvciAoaSA9IDAsIGwgPSBkaXJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGRpciA9IGRpcnNbaV07XG4gICAgbmVlZFJ1bnRpbWUgPSB0cnVlO1xuICAgIHZhciBnZW4gPSBwbGF0Zm9ybURpcmVjdGl2ZXMkMVtkaXIubmFtZV0gfHwgYmFzZURpcmVjdGl2ZXNbZGlyLm5hbWVdO1xuICAgIGlmIChnZW4pIHtcbiAgICAgIC8vIGNvbXBpbGUtdGltZSBkaXJlY3RpdmUgdGhhdCBtYW5pcHVsYXRlcyBBU1QuXG4gICAgICAvLyByZXR1cm5zIHRydWUgaWYgaXQgYWxzbyBuZWVkcyBhIHJ1bnRpbWUgY291bnRlcnBhcnQuXG4gICAgICBuZWVkUnVudGltZSA9ICEhZ2VuKGVsLCBkaXIsIHdhcm4kMyk7XG4gICAgfVxuICAgIGlmIChuZWVkUnVudGltZSkge1xuICAgICAgaGFzUnVudGltZSA9IHRydWU7XG4gICAgICByZXMgKz0gXCJ7bmFtZTpcXFwiXCIgKyAoZGlyLm5hbWUpICsgXCJcXFwiLHJhd05hbWU6XFxcIlwiICsgKGRpci5yYXdOYW1lKSArIFwiXFxcIlwiICsgKGRpci52YWx1ZSA/IChcIix2YWx1ZTooXCIgKyAoZGlyLnZhbHVlKSArIFwiKSxleHByZXNzaW9uOlwiICsgKEpTT04uc3RyaW5naWZ5KGRpci52YWx1ZSkpKSA6ICcnKSArIChkaXIuYXJnID8gKFwiLGFyZzpcXFwiXCIgKyAoZGlyLmFyZykgKyBcIlxcXCJcIikgOiAnJykgKyAoZGlyLm1vZGlmaWVycyA/IChcIixtb2RpZmllcnM6XCIgKyAoSlNPTi5zdHJpbmdpZnkoZGlyLm1vZGlmaWVycykpKSA6ICcnKSArIFwifSxcIjtcbiAgICB9XG4gIH1cbiAgaWYgKGhhc1J1bnRpbWUpIHtcbiAgICByZXR1cm4gcmVzLnNsaWNlKDAsIC0xKSArICddJ1xuICB9XG59XG5cbmZ1bmN0aW9uIGdlbklubGluZVRlbXBsYXRlIChlbCkge1xuICB2YXIgYXN0ID0gZWwuY2hpbGRyZW5bMF07XG4gIGlmIChcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiAoXG4gICAgZWwuY2hpbGRyZW4ubGVuZ3RoID4gMSB8fCBhc3QudHlwZSAhPT0gMVxuICApKSB7XG4gICAgd2FybiQzKCdJbmxpbmUtdGVtcGxhdGUgY29tcG9uZW50cyBtdXN0IGhhdmUgZXhhY3RseSBvbmUgY2hpbGQgZWxlbWVudC4nKTtcbiAgfVxuICBpZiAoYXN0LnR5cGUgPT09IDEpIHtcbiAgICB2YXIgaW5saW5lUmVuZGVyRm5zID0gZ2VuZXJhdGUoYXN0LCBjdXJyZW50T3B0aW9ucyk7XG4gICAgcmV0dXJuIChcImlubGluZVRlbXBsYXRlOntyZW5kZXI6ZnVuY3Rpb24oKXtcIiArIChpbmxpbmVSZW5kZXJGbnMucmVuZGVyKSArIFwifSxzdGF0aWNSZW5kZXJGbnM6W1wiICsgKGlubGluZVJlbmRlckZucy5zdGF0aWNSZW5kZXJGbnMubWFwKGZ1bmN0aW9uIChjb2RlKSB7IHJldHVybiAoXCJmdW5jdGlvbigpe1wiICsgY29kZSArIFwifVwiKTsgfSkuam9pbignLCcpKSArIFwiXX1cIilcbiAgfVxufVxuXG5mdW5jdGlvbiBnZW5TY29wZWRTbG90cyAoc2xvdHMpIHtcbiAgcmV0dXJuIChcInNjb3BlZFNsb3RzOl91KFtcIiArIChPYmplY3Qua2V5cyhzbG90cykubWFwKGZ1bmN0aW9uIChrZXkpIHsgcmV0dXJuIGdlblNjb3BlZFNsb3Qoa2V5LCBzbG90c1trZXldKTsgfSkuam9pbignLCcpKSArIFwiXSlcIilcbn1cblxuZnVuY3Rpb24gZ2VuU2NvcGVkU2xvdCAoa2V5LCBlbCkge1xuICByZXR1cm4gXCJbXCIgKyBrZXkgKyBcIixmdW5jdGlvbihcIiArIChTdHJpbmcoZWwuYXR0cnNNYXAuc2NvcGUpKSArIFwiKXtcIiArXG4gICAgXCJyZXR1cm4gXCIgKyAoZWwudGFnID09PSAndGVtcGxhdGUnXG4gICAgICA/IGdlbkNoaWxkcmVuKGVsKSB8fCAndm9pZCAwJ1xuICAgICAgOiBnZW5FbGVtZW50KGVsKSkgKyBcIn1dXCJcbn1cblxuZnVuY3Rpb24gZ2VuQ2hpbGRyZW4gKGVsLCBjaGVja1NraXApIHtcbiAgdmFyIGNoaWxkcmVuID0gZWwuY2hpbGRyZW47XG4gIGlmIChjaGlsZHJlbi5sZW5ndGgpIHtcbiAgICB2YXIgZWwkMSA9IGNoaWxkcmVuWzBdO1xuICAgIC8vIG9wdGltaXplIHNpbmdsZSB2LWZvclxuICAgIGlmIChjaGlsZHJlbi5sZW5ndGggPT09IDEgJiZcbiAgICAgICAgZWwkMS5mb3IgJiZcbiAgICAgICAgZWwkMS50YWcgIT09ICd0ZW1wbGF0ZScgJiZcbiAgICAgICAgZWwkMS50YWcgIT09ICdzbG90Jykge1xuICAgICAgcmV0dXJuIGdlbkVsZW1lbnQoZWwkMSlcbiAgICB9XG4gICAgdmFyIG5vcm1hbGl6YXRpb25UeXBlID0gY2hlY2tTa2lwID8gZ2V0Tm9ybWFsaXphdGlvblR5cGUoY2hpbGRyZW4pIDogMDtcbiAgICByZXR1cm4gKFwiW1wiICsgKGNoaWxkcmVuLm1hcChnZW5Ob2RlKS5qb2luKCcsJykpICsgXCJdXCIgKyAobm9ybWFsaXphdGlvblR5cGUgPyAoXCIsXCIgKyBub3JtYWxpemF0aW9uVHlwZSkgOiAnJykpXG4gIH1cbn1cblxuLy8gZGV0ZXJtaW5lIHRoZSBub3JtYWxpemF0aW9uIG5lZWRlZCBmb3IgdGhlIGNoaWxkcmVuIGFycmF5LlxuLy8gMDogbm8gbm9ybWFsaXphdGlvbiBuZWVkZWRcbi8vIDE6IHNpbXBsZSBub3JtYWxpemF0aW9uIG5lZWRlZCAocG9zc2libGUgMS1sZXZlbCBkZWVwIG5lc3RlZCBhcnJheSlcbi8vIDI6IGZ1bGwgbm9ybWFsaXphdGlvbiBuZWVkZWRcbmZ1bmN0aW9uIGdldE5vcm1hbGl6YXRpb25UeXBlIChjaGlsZHJlbikge1xuICB2YXIgcmVzID0gMDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgIHZhciBlbCA9IGNoaWxkcmVuW2ldO1xuICAgIGlmIChlbC50eXBlICE9PSAxKSB7XG4gICAgICBjb250aW51ZVxuICAgIH1cbiAgICBpZiAobmVlZHNOb3JtYWxpemF0aW9uKGVsKSB8fFxuICAgICAgICAoZWwuaWZDb25kaXRpb25zICYmIGVsLmlmQ29uZGl0aW9ucy5zb21lKGZ1bmN0aW9uIChjKSB7IHJldHVybiBuZWVkc05vcm1hbGl6YXRpb24oYy5ibG9jayk7IH0pKSkge1xuICAgICAgcmVzID0gMjtcbiAgICAgIGJyZWFrXG4gICAgfVxuICAgIGlmIChtYXliZUNvbXBvbmVudChlbCkgfHxcbiAgICAgICAgKGVsLmlmQ29uZGl0aW9ucyAmJiBlbC5pZkNvbmRpdGlvbnMuc29tZShmdW5jdGlvbiAoYykgeyByZXR1cm4gbWF5YmVDb21wb25lbnQoYy5ibG9jayk7IH0pKSkge1xuICAgICAgcmVzID0gMTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc1xufVxuXG5mdW5jdGlvbiBuZWVkc05vcm1hbGl6YXRpb24gKGVsKSB7XG4gIHJldHVybiBlbC5mb3IgIT09IHVuZGVmaW5lZCB8fCBlbC50YWcgPT09ICd0ZW1wbGF0ZScgfHwgZWwudGFnID09PSAnc2xvdCdcbn1cblxuZnVuY3Rpb24gbWF5YmVDb21wb25lbnQgKGVsKSB7XG4gIHJldHVybiAhaXNQbGF0Zm9ybVJlc2VydmVkVGFnJDEoZWwudGFnKVxufVxuXG5mdW5jdGlvbiBnZW5Ob2RlIChub2RlKSB7XG4gIGlmIChub2RlLnR5cGUgPT09IDEpIHtcbiAgICByZXR1cm4gZ2VuRWxlbWVudChub2RlKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBnZW5UZXh0KG5vZGUpXG4gIH1cbn1cblxuZnVuY3Rpb24gZ2VuVGV4dCAodGV4dCkge1xuICByZXR1cm4gKFwiX3YoXCIgKyAodGV4dC50eXBlID09PSAyXG4gICAgPyB0ZXh0LmV4cHJlc3Npb24gLy8gbm8gbmVlZCBmb3IgKCkgYmVjYXVzZSBhbHJlYWR5IHdyYXBwZWQgaW4gX3MoKVxuICAgIDogdHJhbnNmb3JtU3BlY2lhbE5ld2xpbmVzKEpTT04uc3RyaW5naWZ5KHRleHQudGV4dCkpKSArIFwiKVwiKVxufVxuXG5mdW5jdGlvbiBnZW5TbG90IChlbCkge1xuICB2YXIgc2xvdE5hbWUgPSBlbC5zbG90TmFtZSB8fCAnXCJkZWZhdWx0XCInO1xuICB2YXIgY2hpbGRyZW4gPSBnZW5DaGlsZHJlbihlbCk7XG4gIHZhciByZXMgPSBcIl90KFwiICsgc2xvdE5hbWUgKyAoY2hpbGRyZW4gPyAoXCIsXCIgKyBjaGlsZHJlbikgOiAnJyk7XG4gIHZhciBhdHRycyA9IGVsLmF0dHJzICYmIChcIntcIiArIChlbC5hdHRycy5tYXAoZnVuY3Rpb24gKGEpIHsgcmV0dXJuICgoY2FtZWxpemUoYS5uYW1lKSkgKyBcIjpcIiArIChhLnZhbHVlKSk7IH0pLmpvaW4oJywnKSkgKyBcIn1cIik7XG4gIHZhciBiaW5kJCQxID0gZWwuYXR0cnNNYXBbJ3YtYmluZCddO1xuICBpZiAoKGF0dHJzIHx8IGJpbmQkJDEpICYmICFjaGlsZHJlbikge1xuICAgIHJlcyArPSBcIixudWxsXCI7XG4gIH1cbiAgaWYgKGF0dHJzKSB7XG4gICAgcmVzICs9IFwiLFwiICsgYXR0cnM7XG4gIH1cbiAgaWYgKGJpbmQkJDEpIHtcbiAgICByZXMgKz0gKGF0dHJzID8gJycgOiAnLG51bGwnKSArIFwiLFwiICsgYmluZCQkMTtcbiAgfVxuICByZXR1cm4gcmVzICsgJyknXG59XG5cbi8vIGNvbXBvbmVudE5hbWUgaXMgZWwuY29tcG9uZW50LCB0YWtlIGl0IGFzIGFyZ3VtZW50IHRvIHNodW4gZmxvdydzIHBlc3NpbWlzdGljIHJlZmluZW1lbnRcbmZ1bmN0aW9uIGdlbkNvbXBvbmVudCAoY29tcG9uZW50TmFtZSwgZWwpIHtcbiAgdmFyIGNoaWxkcmVuID0gZWwuaW5saW5lVGVtcGxhdGUgPyBudWxsIDogZ2VuQ2hpbGRyZW4oZWwsIHRydWUpO1xuICByZXR1cm4gKFwiX2MoXCIgKyBjb21wb25lbnROYW1lICsgXCIsXCIgKyAoZ2VuRGF0YShlbCkpICsgKGNoaWxkcmVuID8gKFwiLFwiICsgY2hpbGRyZW4pIDogJycpICsgXCIpXCIpXG59XG5cbmZ1bmN0aW9uIGdlblByb3BzIChwcm9wcykge1xuICB2YXIgcmVzID0gJyc7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgcHJvcCA9IHByb3BzW2ldO1xuICAgIHJlcyArPSBcIlxcXCJcIiArIChwcm9wLm5hbWUpICsgXCJcXFwiOlwiICsgKHRyYW5zZm9ybVNwZWNpYWxOZXdsaW5lcyhwcm9wLnZhbHVlKSkgKyBcIixcIjtcbiAgfVxuICByZXR1cm4gcmVzLnNsaWNlKDAsIC0xKVxufVxuXG4vLyAjMzg5NSwgIzQyNjhcbmZ1bmN0aW9uIHRyYW5zZm9ybVNwZWNpYWxOZXdsaW5lcyAodGV4dCkge1xuICByZXR1cm4gdGV4dFxuICAgIC5yZXBsYWNlKC9cXHUyMDI4L2csICdcXFxcdTIwMjgnKVxuICAgIC5yZXBsYWNlKC9cXHUyMDI5L2csICdcXFxcdTIwMjknKVxufVxuXG4vKiAgKi9cblxuLy8gdGhlc2Uga2V5d29yZHMgc2hvdWxkIG5vdCBhcHBlYXIgaW5zaWRlIGV4cHJlc3Npb25zLCBidXQgb3BlcmF0b3JzIGxpa2Vcbi8vIHR5cGVvZiwgaW5zdGFuY2VvZiBhbmQgaW4gYXJlIGFsbG93ZWRcbnZhciBwcm9oaWJpdGVkS2V5d29yZFJFID0gbmV3IFJlZ0V4cCgnXFxcXGInICsgKFxuICAnZG8saWYsZm9yLGxldCxuZXcsdHJ5LHZhcixjYXNlLGVsc2Usd2l0aCxhd2FpdCxicmVhayxjYXRjaCxjbGFzcyxjb25zdCwnICtcbiAgJ3N1cGVyLHRocm93LHdoaWxlLHlpZWxkLGRlbGV0ZSxleHBvcnQsaW1wb3J0LHJldHVybixzd2l0Y2gsZGVmYXVsdCwnICtcbiAgJ2V4dGVuZHMsZmluYWxseSxjb250aW51ZSxkZWJ1Z2dlcixmdW5jdGlvbixhcmd1bWVudHMnXG4pLnNwbGl0KCcsJykuam9pbignXFxcXGJ8XFxcXGInKSArICdcXFxcYicpO1xuXG4vLyB0aGVzZSB1bmFyeSBvcGVyYXRvcnMgc2hvdWxkIG5vdCBiZSB1c2VkIGFzIHByb3BlcnR5L21ldGhvZCBuYW1lc1xudmFyIHVuYXJ5T3BlcmF0b3JzUkUgPSBuZXcgUmVnRXhwKCdcXFxcYicgKyAoXG4gICdkZWxldGUsdHlwZW9mLHZvaWQnXG4pLnNwbGl0KCcsJykuam9pbignXFxcXHMqXFxcXChbXlxcXFwpXSpcXFxcKXxcXFxcYicpICsgJ1xcXFxzKlxcXFwoW15cXFxcKV0qXFxcXCknKTtcblxuLy8gY2hlY2sgdmFsaWQgaWRlbnRpZmllciBmb3Igdi1mb3JcbnZhciBpZGVudFJFID0gL1tBLVphLXpfJF1bXFx3JF0qLztcblxuLy8gc3RyaXAgc3RyaW5ncyBpbiBleHByZXNzaW9uc1xudmFyIHN0cmlwU3RyaW5nUkUgPSAvJyg/OlteJ1xcXFxdfFxcXFwuKSonfFwiKD86W15cIlxcXFxdfFxcXFwuKSpcInxgKD86W15gXFxcXF18XFxcXC4pKlxcJFxce3xcXH0oPzpbXmBcXFxcXXxcXFxcLikqYHxgKD86W15gXFxcXF18XFxcXC4pKmAvZztcblxuLy8gZGV0ZWN0IHByb2JsZW1hdGljIGV4cHJlc3Npb25zIGluIGEgdGVtcGxhdGVcbmZ1bmN0aW9uIGRldGVjdEVycm9ycyAoYXN0KSB7XG4gIHZhciBlcnJvcnMgPSBbXTtcbiAgaWYgKGFzdCkge1xuICAgIGNoZWNrTm9kZShhc3QsIGVycm9ycyk7XG4gIH1cbiAgcmV0dXJuIGVycm9yc1xufVxuXG5mdW5jdGlvbiBjaGVja05vZGUgKG5vZGUsIGVycm9ycykge1xuICBpZiAobm9kZS50eXBlID09PSAxKSB7XG4gICAgZm9yICh2YXIgbmFtZSBpbiBub2RlLmF0dHJzTWFwKSB7XG4gICAgICBpZiAoZGlyUkUudGVzdChuYW1lKSkge1xuICAgICAgICB2YXIgdmFsdWUgPSBub2RlLmF0dHJzTWFwW25hbWVdO1xuICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICBpZiAobmFtZSA9PT0gJ3YtZm9yJykge1xuICAgICAgICAgICAgY2hlY2tGb3Iobm9kZSwgKFwidi1mb3I9XFxcIlwiICsgdmFsdWUgKyBcIlxcXCJcIiksIGVycm9ycyk7XG4gICAgICAgICAgfSBlbHNlIGlmIChvblJFLnRlc3QobmFtZSkpIHtcbiAgICAgICAgICAgIGNoZWNrRXZlbnQodmFsdWUsIChuYW1lICsgXCI9XFxcIlwiICsgdmFsdWUgKyBcIlxcXCJcIiksIGVycm9ycyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNoZWNrRXhwcmVzc2lvbih2YWx1ZSwgKG5hbWUgKyBcIj1cXFwiXCIgKyB2YWx1ZSArIFwiXFxcIlwiKSwgZXJyb3JzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKG5vZGUuY2hpbGRyZW4pIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICBjaGVja05vZGUobm9kZS5jaGlsZHJlbltpXSwgZXJyb3JzKTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAobm9kZS50eXBlID09PSAyKSB7XG4gICAgY2hlY2tFeHByZXNzaW9uKG5vZGUuZXhwcmVzc2lvbiwgbm9kZS50ZXh0LCBlcnJvcnMpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNoZWNrRXZlbnQgKGV4cCwgdGV4dCwgZXJyb3JzKSB7XG4gIHZhciBrZXl3b3JkTWF0Y2ggPSBleHAucmVwbGFjZShzdHJpcFN0cmluZ1JFLCAnJykubWF0Y2godW5hcnlPcGVyYXRvcnNSRSk7XG4gIGlmIChrZXl3b3JkTWF0Y2gpIHtcbiAgICBlcnJvcnMucHVzaChcbiAgICAgIFwiYXZvaWQgdXNpbmcgSmF2YVNjcmlwdCB1bmFyeSBvcGVyYXRvciBhcyBwcm9wZXJ0eSBuYW1lOiBcIiArXG4gICAgICBcIlxcXCJcIiArIChrZXl3b3JkTWF0Y2hbMF0pICsgXCJcXFwiIGluIGV4cHJlc3Npb24gXCIgKyAodGV4dC50cmltKCkpXG4gICAgKTtcbiAgfVxuICBjaGVja0V4cHJlc3Npb24oZXhwLCB0ZXh0LCBlcnJvcnMpO1xufVxuXG5mdW5jdGlvbiBjaGVja0ZvciAobm9kZSwgdGV4dCwgZXJyb3JzKSB7XG4gIGNoZWNrRXhwcmVzc2lvbihub2RlLmZvciB8fCAnJywgdGV4dCwgZXJyb3JzKTtcbiAgY2hlY2tJZGVudGlmaWVyKG5vZGUuYWxpYXMsICd2LWZvciBhbGlhcycsIHRleHQsIGVycm9ycyk7XG4gIGNoZWNrSWRlbnRpZmllcihub2RlLml0ZXJhdG9yMSwgJ3YtZm9yIGl0ZXJhdG9yJywgdGV4dCwgZXJyb3JzKTtcbiAgY2hlY2tJZGVudGlmaWVyKG5vZGUuaXRlcmF0b3IyLCAndi1mb3IgaXRlcmF0b3InLCB0ZXh0LCBlcnJvcnMpO1xufVxuXG5mdW5jdGlvbiBjaGVja0lkZW50aWZpZXIgKGlkZW50LCB0eXBlLCB0ZXh0LCBlcnJvcnMpIHtcbiAgaWYgKHR5cGVvZiBpZGVudCA9PT0gJ3N0cmluZycgJiYgIWlkZW50UkUudGVzdChpZGVudCkpIHtcbiAgICBlcnJvcnMucHVzaCgoXCJpbnZhbGlkIFwiICsgdHlwZSArIFwiIFxcXCJcIiArIGlkZW50ICsgXCJcXFwiIGluIGV4cHJlc3Npb246IFwiICsgKHRleHQudHJpbSgpKSkpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNoZWNrRXhwcmVzc2lvbiAoZXhwLCB0ZXh0LCBlcnJvcnMpIHtcbiAgdHJ5IHtcbiAgICBuZXcgRnVuY3Rpb24oKFwicmV0dXJuIFwiICsgZXhwKSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICB2YXIga2V5d29yZE1hdGNoID0gZXhwLnJlcGxhY2Uoc3RyaXBTdHJpbmdSRSwgJycpLm1hdGNoKHByb2hpYml0ZWRLZXl3b3JkUkUpO1xuICAgIGlmIChrZXl3b3JkTWF0Y2gpIHtcbiAgICAgIGVycm9ycy5wdXNoKFxuICAgICAgICBcImF2b2lkIHVzaW5nIEphdmFTY3JpcHQga2V5d29yZCBhcyBwcm9wZXJ0eSBuYW1lOiBcIiArXG4gICAgICAgIFwiXFxcIlwiICsgKGtleXdvcmRNYXRjaFswXSkgKyBcIlxcXCIgaW4gZXhwcmVzc2lvbiBcIiArICh0ZXh0LnRyaW0oKSlcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVycm9ycy5wdXNoKChcImludmFsaWQgZXhwcmVzc2lvbjogXCIgKyAodGV4dC50cmltKCkpKSk7XG4gICAgfVxuICB9XG59XG5cbi8qICAqL1xuXG5mdW5jdGlvbiBiYXNlQ29tcGlsZSAoXG4gIHRlbXBsYXRlLFxuICBvcHRpb25zXG4pIHtcbiAgdmFyIGFzdCA9IHBhcnNlKHRlbXBsYXRlLnRyaW0oKSwgb3B0aW9ucyk7XG4gIG9wdGltaXplKGFzdCwgb3B0aW9ucyk7XG4gIHZhciBjb2RlID0gZ2VuZXJhdGUoYXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIHtcbiAgICBhc3Q6IGFzdCxcbiAgICByZW5kZXI6IGNvZGUucmVuZGVyLFxuICAgIHN0YXRpY1JlbmRlckZuczogY29kZS5zdGF0aWNSZW5kZXJGbnNcbiAgfVxufVxuXG5mdW5jdGlvbiBtYWtlRnVuY3Rpb24gKGNvZGUsIGVycm9ycykge1xuICB0cnkge1xuICAgIHJldHVybiBuZXcgRnVuY3Rpb24oY29kZSlcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgZXJyb3JzLnB1c2goeyBlcnI6IGVyciwgY29kZTogY29kZSB9KTtcbiAgICByZXR1cm4gbm9vcFxuICB9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUNvbXBpbGVyIChiYXNlT3B0aW9ucykge1xuICB2YXIgZnVuY3Rpb25Db21waWxlQ2FjaGUgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG4gIGZ1bmN0aW9uIGNvbXBpbGUgKFxuICAgIHRlbXBsYXRlLFxuICAgIG9wdGlvbnNcbiAgKSB7XG4gICAgdmFyIGZpbmFsT3B0aW9ucyA9IE9iamVjdC5jcmVhdGUoYmFzZU9wdGlvbnMpO1xuICAgIHZhciBlcnJvcnMgPSBbXTtcbiAgICB2YXIgdGlwcyA9IFtdO1xuICAgIGZpbmFsT3B0aW9ucy53YXJuID0gZnVuY3Rpb24gKG1zZywgdGlwJCQxKSB7XG4gICAgICAodGlwJCQxID8gdGlwcyA6IGVycm9ycykucHVzaChtc2cpO1xuICAgIH07XG5cbiAgICBpZiAob3B0aW9ucykge1xuICAgICAgLy8gbWVyZ2UgY3VzdG9tIG1vZHVsZXNcbiAgICAgIGlmIChvcHRpb25zLm1vZHVsZXMpIHtcbiAgICAgICAgZmluYWxPcHRpb25zLm1vZHVsZXMgPSAoYmFzZU9wdGlvbnMubW9kdWxlcyB8fCBbXSkuY29uY2F0KG9wdGlvbnMubW9kdWxlcyk7XG4gICAgICB9XG4gICAgICAvLyBtZXJnZSBjdXN0b20gZGlyZWN0aXZlc1xuICAgICAgaWYgKG9wdGlvbnMuZGlyZWN0aXZlcykge1xuICAgICAgICBmaW5hbE9wdGlvbnMuZGlyZWN0aXZlcyA9IGV4dGVuZChcbiAgICAgICAgICBPYmplY3QuY3JlYXRlKGJhc2VPcHRpb25zLmRpcmVjdGl2ZXMpLFxuICAgICAgICAgIG9wdGlvbnMuZGlyZWN0aXZlc1xuICAgICAgICApO1xuICAgICAgfVxuICAgICAgLy8gY29weSBvdGhlciBvcHRpb25zXG4gICAgICBmb3IgKHZhciBrZXkgaW4gb3B0aW9ucykge1xuICAgICAgICBpZiAoa2V5ICE9PSAnbW9kdWxlcycgJiYga2V5ICE9PSAnZGlyZWN0aXZlcycpIHtcbiAgICAgICAgICBmaW5hbE9wdGlvbnNba2V5XSA9IG9wdGlvbnNba2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBjb21waWxlZCA9IGJhc2VDb21waWxlKHRlbXBsYXRlLCBmaW5hbE9wdGlvbnMpO1xuICAgIHtcbiAgICAgIGVycm9ycy5wdXNoLmFwcGx5KGVycm9ycywgZGV0ZWN0RXJyb3JzKGNvbXBpbGVkLmFzdCkpO1xuICAgIH1cbiAgICBjb21waWxlZC5lcnJvcnMgPSBlcnJvcnM7XG4gICAgY29tcGlsZWQudGlwcyA9IHRpcHM7XG4gICAgcmV0dXJuIGNvbXBpbGVkXG4gIH1cblxuICBmdW5jdGlvbiBjb21waWxlVG9GdW5jdGlvbnMgKFxuICAgIHRlbXBsYXRlLFxuICAgIG9wdGlvbnMsXG4gICAgdm1cbiAgKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICB7XG4gICAgICAvLyBkZXRlY3QgcG9zc2libGUgQ1NQIHJlc3RyaWN0aW9uXG4gICAgICB0cnkge1xuICAgICAgICBuZXcgRnVuY3Rpb24oJ3JldHVybiAxJyk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChlLnRvU3RyaW5nKCkubWF0Y2goL3Vuc2FmZS1ldmFsfENTUC8pKSB7XG4gICAgICAgICAgd2FybihcbiAgICAgICAgICAgICdJdCBzZWVtcyB5b3UgYXJlIHVzaW5nIHRoZSBzdGFuZGFsb25lIGJ1aWxkIG9mIFZ1ZS5qcyBpbiBhbiAnICtcbiAgICAgICAgICAgICdlbnZpcm9ubWVudCB3aXRoIENvbnRlbnQgU2VjdXJpdHkgUG9saWN5IHRoYXQgcHJvaGliaXRzIHVuc2FmZS1ldmFsLiAnICtcbiAgICAgICAgICAgICdUaGUgdGVtcGxhdGUgY29tcGlsZXIgY2Fubm90IHdvcmsgaW4gdGhpcyBlbnZpcm9ubWVudC4gQ29uc2lkZXIgJyArXG4gICAgICAgICAgICAncmVsYXhpbmcgdGhlIHBvbGljeSB0byBhbGxvdyB1bnNhZmUtZXZhbCBvciBwcmUtY29tcGlsaW5nIHlvdXIgJyArXG4gICAgICAgICAgICAndGVtcGxhdGVzIGludG8gcmVuZGVyIGZ1bmN0aW9ucy4nXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGNoZWNrIGNhY2hlXG4gICAgdmFyIGtleSA9IG9wdGlvbnMuZGVsaW1pdGVyc1xuICAgICAgPyBTdHJpbmcob3B0aW9ucy5kZWxpbWl0ZXJzKSArIHRlbXBsYXRlXG4gICAgICA6IHRlbXBsYXRlO1xuICAgIGlmIChmdW5jdGlvbkNvbXBpbGVDYWNoZVtrZXldKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb25Db21waWxlQ2FjaGVba2V5XVxuICAgIH1cblxuICAgIC8vIGNvbXBpbGVcbiAgICB2YXIgY29tcGlsZWQgPSBjb21waWxlKHRlbXBsYXRlLCBvcHRpb25zKTtcblxuICAgIC8vIGNoZWNrIGNvbXBpbGF0aW9uIGVycm9ycy90aXBzXG4gICAge1xuICAgICAgaWYgKGNvbXBpbGVkLmVycm9ycyAmJiBjb21waWxlZC5lcnJvcnMubGVuZ3RoKSB7XG4gICAgICAgIHdhcm4oXG4gICAgICAgICAgXCJFcnJvciBjb21waWxpbmcgdGVtcGxhdGU6XFxuXFxuXCIgKyB0ZW1wbGF0ZSArIFwiXFxuXFxuXCIgK1xuICAgICAgICAgIGNvbXBpbGVkLmVycm9ycy5tYXAoZnVuY3Rpb24gKGUpIHsgcmV0dXJuIChcIi0gXCIgKyBlKTsgfSkuam9pbignXFxuJykgKyAnXFxuJyxcbiAgICAgICAgICB2bVxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgaWYgKGNvbXBpbGVkLnRpcHMgJiYgY29tcGlsZWQudGlwcy5sZW5ndGgpIHtcbiAgICAgICAgY29tcGlsZWQudGlwcy5mb3JFYWNoKGZ1bmN0aW9uIChtc2cpIHsgcmV0dXJuIHRpcChtc2csIHZtKTsgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gdHVybiBjb2RlIGludG8gZnVuY3Rpb25zXG4gICAgdmFyIHJlcyA9IHt9O1xuICAgIHZhciBmbkdlbkVycm9ycyA9IFtdO1xuICAgIHJlcy5yZW5kZXIgPSBtYWtlRnVuY3Rpb24oY29tcGlsZWQucmVuZGVyLCBmbkdlbkVycm9ycyk7XG4gICAgdmFyIGwgPSBjb21waWxlZC5zdGF0aWNSZW5kZXJGbnMubGVuZ3RoO1xuICAgIHJlcy5zdGF0aWNSZW5kZXJGbnMgPSBuZXcgQXJyYXkobCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICAgIHJlcy5zdGF0aWNSZW5kZXJGbnNbaV0gPSBtYWtlRnVuY3Rpb24oY29tcGlsZWQuc3RhdGljUmVuZGVyRm5zW2ldLCBmbkdlbkVycm9ycyk7XG4gICAgfVxuXG4gICAgLy8gY2hlY2sgZnVuY3Rpb24gZ2VuZXJhdGlvbiBlcnJvcnMuXG4gICAgLy8gdGhpcyBzaG91bGQgb25seSBoYXBwZW4gaWYgdGhlcmUgaXMgYSBidWcgaW4gdGhlIGNvbXBpbGVyIGl0c2VsZi5cbiAgICAvLyBtb3N0bHkgZm9yIGNvZGVnZW4gZGV2ZWxvcG1lbnQgdXNlXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAge1xuICAgICAgaWYgKCghY29tcGlsZWQuZXJyb3JzIHx8ICFjb21waWxlZC5lcnJvcnMubGVuZ3RoKSAmJiBmbkdlbkVycm9ycy5sZW5ndGgpIHtcbiAgICAgICAgd2FybihcbiAgICAgICAgICBcIkZhaWxlZCB0byBnZW5lcmF0ZSByZW5kZXIgZnVuY3Rpb246XFxuXFxuXCIgK1xuICAgICAgICAgIGZuR2VuRXJyb3JzLm1hcChmdW5jdGlvbiAocmVmKSB7XG4gICAgICAgICAgICB2YXIgZXJyID0gcmVmLmVycjtcbiAgICAgICAgICAgIHZhciBjb2RlID0gcmVmLmNvZGU7XG5cbiAgICAgICAgICAgIHJldHVybiAoKGVyci50b1N0cmluZygpKSArIFwiIGluXFxuXFxuXCIgKyBjb2RlICsgXCJcXG5cIik7XG4gICAgICAgIH0pLmpvaW4oJ1xcbicpLFxuICAgICAgICAgIHZtXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIChmdW5jdGlvbkNvbXBpbGVDYWNoZVtrZXldID0gcmVzKVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBjb21waWxlOiBjb21waWxlLFxuICAgIGNvbXBpbGVUb0Z1bmN0aW9uczogY29tcGlsZVRvRnVuY3Rpb25zXG4gIH1cbn1cblxuLyogICovXG5cbmZ1bmN0aW9uIHRyYW5zZm9ybU5vZGUgKGVsLCBvcHRpb25zKSB7XG4gIHZhciB3YXJuID0gb3B0aW9ucy53YXJuIHx8IGJhc2VXYXJuO1xuICB2YXIgc3RhdGljQ2xhc3MgPSBnZXRBbmRSZW1vdmVBdHRyKGVsLCAnY2xhc3MnKTtcbiAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmIHN0YXRpY0NsYXNzKSB7XG4gICAgdmFyIGV4cHJlc3Npb24gPSBwYXJzZVRleHQoc3RhdGljQ2xhc3MsIG9wdGlvbnMuZGVsaW1pdGVycyk7XG4gICAgaWYgKGV4cHJlc3Npb24pIHtcbiAgICAgIHdhcm4oXG4gICAgICAgIFwiY2xhc3M9XFxcIlwiICsgc3RhdGljQ2xhc3MgKyBcIlxcXCI6IFwiICtcbiAgICAgICAgJ0ludGVycG9sYXRpb24gaW5zaWRlIGF0dHJpYnV0ZXMgaGFzIGJlZW4gcmVtb3ZlZC4gJyArXG4gICAgICAgICdVc2Ugdi1iaW5kIG9yIHRoZSBjb2xvbiBzaG9ydGhhbmQgaW5zdGVhZC4gRm9yIGV4YW1wbGUsICcgK1xuICAgICAgICAnaW5zdGVhZCBvZiA8ZGl2IGNsYXNzPVwie3sgdmFsIH19XCI+LCB1c2UgPGRpdiA6Y2xhc3M9XCJ2YWxcIj4uJ1xuICAgICAgKTtcbiAgICB9XG4gIH1cbiAgaWYgKHN0YXRpY0NsYXNzKSB7XG4gICAgZWwuc3RhdGljQ2xhc3MgPSBKU09OLnN0cmluZ2lmeShzdGF0aWNDbGFzcyk7XG4gIH1cbiAgdmFyIGNsYXNzQmluZGluZyA9IGdldEJpbmRpbmdBdHRyKGVsLCAnY2xhc3MnLCBmYWxzZSAvKiBnZXRTdGF0aWMgKi8pO1xuICBpZiAoY2xhc3NCaW5kaW5nKSB7XG4gICAgZWwuY2xhc3NCaW5kaW5nID0gY2xhc3NCaW5kaW5nO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdlbkRhdGEkMSAoZWwpIHtcbiAgdmFyIGRhdGEgPSAnJztcbiAgaWYgKGVsLnN0YXRpY0NsYXNzKSB7XG4gICAgZGF0YSArPSBcInN0YXRpY0NsYXNzOlwiICsgKGVsLnN0YXRpY0NsYXNzKSArIFwiLFwiO1xuICB9XG4gIGlmIChlbC5jbGFzc0JpbmRpbmcpIHtcbiAgICBkYXRhICs9IFwiY2xhc3M6XCIgKyAoZWwuY2xhc3NCaW5kaW5nKSArIFwiLFwiO1xuICB9XG4gIHJldHVybiBkYXRhXG59XG5cbnZhciBrbGFzcyQxID0ge1xuICBzdGF0aWNLZXlzOiBbJ3N0YXRpY0NsYXNzJ10sXG4gIHRyYW5zZm9ybU5vZGU6IHRyYW5zZm9ybU5vZGUsXG4gIGdlbkRhdGE6IGdlbkRhdGEkMVxufTtcblxuLyogICovXG5cbmZ1bmN0aW9uIHRyYW5zZm9ybU5vZGUkMSAoZWwsIG9wdGlvbnMpIHtcbiAgdmFyIHdhcm4gPSBvcHRpb25zLndhcm4gfHwgYmFzZVdhcm47XG4gIHZhciBzdGF0aWNTdHlsZSA9IGdldEFuZFJlbW92ZUF0dHIoZWwsICdzdHlsZScpO1xuICBpZiAoc3RhdGljU3R5bGUpIHtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICB7XG4gICAgICB2YXIgZXhwcmVzc2lvbiA9IHBhcnNlVGV4dChzdGF0aWNTdHlsZSwgb3B0aW9ucy5kZWxpbWl0ZXJzKTtcbiAgICAgIGlmIChleHByZXNzaW9uKSB7XG4gICAgICAgIHdhcm4oXG4gICAgICAgICAgXCJzdHlsZT1cXFwiXCIgKyBzdGF0aWNTdHlsZSArIFwiXFxcIjogXCIgK1xuICAgICAgICAgICdJbnRlcnBvbGF0aW9uIGluc2lkZSBhdHRyaWJ1dGVzIGhhcyBiZWVuIHJlbW92ZWQuICcgK1xuICAgICAgICAgICdVc2Ugdi1iaW5kIG9yIHRoZSBjb2xvbiBzaG9ydGhhbmQgaW5zdGVhZC4gRm9yIGV4YW1wbGUsICcgK1xuICAgICAgICAgICdpbnN0ZWFkIG9mIDxkaXYgc3R5bGU9XCJ7eyB2YWwgfX1cIj4sIHVzZSA8ZGl2IDpzdHlsZT1cInZhbFwiPi4nXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICAgIGVsLnN0YXRpY1N0eWxlID0gSlNPTi5zdHJpbmdpZnkocGFyc2VTdHlsZVRleHQoc3RhdGljU3R5bGUpKTtcbiAgfVxuXG4gIHZhciBzdHlsZUJpbmRpbmcgPSBnZXRCaW5kaW5nQXR0cihlbCwgJ3N0eWxlJywgZmFsc2UgLyogZ2V0U3RhdGljICovKTtcbiAgaWYgKHN0eWxlQmluZGluZykge1xuICAgIGVsLnN0eWxlQmluZGluZyA9IHN0eWxlQmluZGluZztcbiAgfVxufVxuXG5mdW5jdGlvbiBnZW5EYXRhJDIgKGVsKSB7XG4gIHZhciBkYXRhID0gJyc7XG4gIGlmIChlbC5zdGF0aWNTdHlsZSkge1xuICAgIGRhdGEgKz0gXCJzdGF0aWNTdHlsZTpcIiArIChlbC5zdGF0aWNTdHlsZSkgKyBcIixcIjtcbiAgfVxuICBpZiAoZWwuc3R5bGVCaW5kaW5nKSB7XG4gICAgZGF0YSArPSBcInN0eWxlOihcIiArIChlbC5zdHlsZUJpbmRpbmcpICsgXCIpLFwiO1xuICB9XG4gIHJldHVybiBkYXRhXG59XG5cbnZhciBzdHlsZSQxID0ge1xuICBzdGF0aWNLZXlzOiBbJ3N0YXRpY1N0eWxlJ10sXG4gIHRyYW5zZm9ybU5vZGU6IHRyYW5zZm9ybU5vZGUkMSxcbiAgZ2VuRGF0YTogZ2VuRGF0YSQyXG59O1xuXG52YXIgbW9kdWxlcyQxID0gW1xuICBrbGFzcyQxLFxuICBzdHlsZSQxXG5dO1xuXG4vKiAgKi9cblxuZnVuY3Rpb24gdGV4dCAoZWwsIGRpcikge1xuICBpZiAoZGlyLnZhbHVlKSB7XG4gICAgYWRkUHJvcChlbCwgJ3RleHRDb250ZW50JywgKFwiX3MoXCIgKyAoZGlyLnZhbHVlKSArIFwiKVwiKSk7XG4gIH1cbn1cblxuLyogICovXG5cbmZ1bmN0aW9uIGh0bWwgKGVsLCBkaXIpIHtcbiAgaWYgKGRpci52YWx1ZSkge1xuICAgIGFkZFByb3AoZWwsICdpbm5lckhUTUwnLCAoXCJfcyhcIiArIChkaXIudmFsdWUpICsgXCIpXCIpKTtcbiAgfVxufVxuXG52YXIgZGlyZWN0aXZlcyQxID0ge1xuICBtb2RlbDogbW9kZWwsXG4gIHRleHQ6IHRleHQsXG4gIGh0bWw6IGh0bWxcbn07XG5cbi8qICAqL1xuXG52YXIgYmFzZU9wdGlvbnMgPSB7XG4gIGV4cGVjdEhUTUw6IHRydWUsXG4gIG1vZHVsZXM6IG1vZHVsZXMkMSxcbiAgZGlyZWN0aXZlczogZGlyZWN0aXZlcyQxLFxuICBpc1ByZVRhZzogaXNQcmVUYWcsXG4gIGlzVW5hcnlUYWc6IGlzVW5hcnlUYWcsXG4gIG11c3RVc2VQcm9wOiBtdXN0VXNlUHJvcCxcbiAgaXNSZXNlcnZlZFRhZzogaXNSZXNlcnZlZFRhZyxcbiAgZ2V0VGFnTmFtZXNwYWNlOiBnZXRUYWdOYW1lc3BhY2UsXG4gIHN0YXRpY0tleXM6IGdlblN0YXRpY0tleXMobW9kdWxlcyQxKVxufTtcblxudmFyIHJlZiQxID0gY3JlYXRlQ29tcGlsZXIoYmFzZU9wdGlvbnMpO1xudmFyIGNvbXBpbGVUb0Z1bmN0aW9ucyA9IHJlZiQxLmNvbXBpbGVUb0Z1bmN0aW9ucztcblxuLyogICovXG5cbnZhciBpZFRvVGVtcGxhdGUgPSBjYWNoZWQoZnVuY3Rpb24gKGlkKSB7XG4gIHZhciBlbCA9IHF1ZXJ5KGlkKTtcbiAgcmV0dXJuIGVsICYmIGVsLmlubmVySFRNTFxufSk7XG5cbnZhciBtb3VudCA9IFZ1ZSQzLnByb3RvdHlwZS4kbW91bnQ7XG5WdWUkMy5wcm90b3R5cGUuJG1vdW50ID0gZnVuY3Rpb24gKFxuICBlbCxcbiAgaHlkcmF0aW5nXG4pIHtcbiAgZWwgPSBlbCAmJiBxdWVyeShlbCk7XG5cbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gIGlmIChlbCA9PT0gZG9jdW1lbnQuYm9keSB8fCBlbCA9PT0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSB7XG4gICAgXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiYgd2FybihcbiAgICAgIFwiRG8gbm90IG1vdW50IFZ1ZSB0byA8aHRtbD4gb3IgPGJvZHk+IC0gbW91bnQgdG8gbm9ybWFsIGVsZW1lbnRzIGluc3RlYWQuXCJcbiAgICApO1xuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICB2YXIgb3B0aW9ucyA9IHRoaXMuJG9wdGlvbnM7XG4gIC8vIHJlc29sdmUgdGVtcGxhdGUvZWwgYW5kIGNvbnZlcnQgdG8gcmVuZGVyIGZ1bmN0aW9uXG4gIGlmICghb3B0aW9ucy5yZW5kZXIpIHtcbiAgICB2YXIgdGVtcGxhdGUgPSBvcHRpb25zLnRlbXBsYXRlO1xuICAgIGlmICh0ZW1wbGF0ZSkge1xuICAgICAgaWYgKHR5cGVvZiB0ZW1wbGF0ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgaWYgKHRlbXBsYXRlLmNoYXJBdCgwKSA9PT0gJyMnKSB7XG4gICAgICAgICAgdGVtcGxhdGUgPSBpZFRvVGVtcGxhdGUodGVtcGxhdGUpO1xuICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgICAgIGlmIChcImRldmVsb3BtZW50XCIgIT09ICdwcm9kdWN0aW9uJyAmJiAhdGVtcGxhdGUpIHtcbiAgICAgICAgICAgIHdhcm4oXG4gICAgICAgICAgICAgIChcIlRlbXBsYXRlIGVsZW1lbnQgbm90IGZvdW5kIG9yIGlzIGVtcHR5OiBcIiArIChvcHRpb25zLnRlbXBsYXRlKSksXG4gICAgICAgICAgICAgIHRoaXNcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHRlbXBsYXRlLm5vZGVUeXBlKSB7XG4gICAgICAgIHRlbXBsYXRlID0gdGVtcGxhdGUuaW5uZXJIVE1MO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAge1xuICAgICAgICAgIHdhcm4oJ2ludmFsaWQgdGVtcGxhdGUgb3B0aW9uOicgKyB0ZW1wbGF0ZSwgdGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGVsKSB7XG4gICAgICB0ZW1wbGF0ZSA9IGdldE91dGVySFRNTChlbCk7XG4gICAgfVxuICAgIGlmICh0ZW1wbGF0ZSkge1xuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICBpZiAoXCJkZXZlbG9wbWVudFwiICE9PSAncHJvZHVjdGlvbicgJiYgY29uZmlnLnBlcmZvcm1hbmNlICYmIHBlcmYpIHtcbiAgICAgICAgcGVyZi5tYXJrKCdjb21waWxlJyk7XG4gICAgICB9XG5cbiAgICAgIHZhciByZWYgPSBjb21waWxlVG9GdW5jdGlvbnModGVtcGxhdGUsIHtcbiAgICAgICAgc2hvdWxkRGVjb2RlTmV3bGluZXM6IHNob3VsZERlY29kZU5ld2xpbmVzLFxuICAgICAgICBkZWxpbWl0ZXJzOiBvcHRpb25zLmRlbGltaXRlcnNcbiAgICAgIH0sIHRoaXMpO1xuICAgICAgdmFyIHJlbmRlciA9IHJlZi5yZW5kZXI7XG4gICAgICB2YXIgc3RhdGljUmVuZGVyRm5zID0gcmVmLnN0YXRpY1JlbmRlckZucztcbiAgICAgIG9wdGlvbnMucmVuZGVyID0gcmVuZGVyO1xuICAgICAgb3B0aW9ucy5zdGF0aWNSZW5kZXJGbnMgPSBzdGF0aWNSZW5kZXJGbnM7XG5cbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgaWYgKFwiZGV2ZWxvcG1lbnRcIiAhPT0gJ3Byb2R1Y3Rpb24nICYmIGNvbmZpZy5wZXJmb3JtYW5jZSAmJiBwZXJmKSB7XG4gICAgICAgIHBlcmYubWFyaygnY29tcGlsZSBlbmQnKTtcbiAgICAgICAgcGVyZi5tZWFzdXJlKCgodGhpcy5fbmFtZSkgKyBcIiBjb21waWxlXCIpLCAnY29tcGlsZScsICdjb21waWxlIGVuZCcpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gbW91bnQuY2FsbCh0aGlzLCBlbCwgaHlkcmF0aW5nKVxufTtcblxuLyoqXG4gKiBHZXQgb3V0ZXJIVE1MIG9mIGVsZW1lbnRzLCB0YWtpbmcgY2FyZVxuICogb2YgU1ZHIGVsZW1lbnRzIGluIElFIGFzIHdlbGwuXG4gKi9cbmZ1bmN0aW9uIGdldE91dGVySFRNTCAoZWwpIHtcbiAgaWYgKGVsLm91dGVySFRNTCkge1xuICAgIHJldHVybiBlbC5vdXRlckhUTUxcbiAgfSBlbHNlIHtcbiAgICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGVsLmNsb25lTm9kZSh0cnVlKSk7XG4gICAgcmV0dXJuIGNvbnRhaW5lci5pbm5lckhUTUxcbiAgfVxufVxuXG5WdWUkMy5jb21waWxlID0gY29tcGlsZVRvRnVuY3Rpb25zO1xuXG5yZXR1cm4gVnVlJDM7XG5cbn0pKSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vfi92dWUvZGlzdC92dWUuanMiLCJpbXBvcnQgVnVlIGZyb20gJ3Z1ZSc7XG5pbXBvcnQgJy4vZmxvb3ItcGxhbi5jc3MnO1xuXG4vLyA8c2VhdCB2LWZvcj0nY29sIGluIHJvdy5jb2x1bW5zJz48L3NlYXQ+XG5WdWUuY29tcG9uZW50KCdmbG9vci1wbGFuJywge1xuICB0ZW1wbGF0ZTogYFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPSdmbG9vci1wbGFuJz5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPSdzY3JlZW4nIHYtaWY9J3BsYW4uc2NyZWVuUG9zID09PSAndG9wJyc+PC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz0ncm93JyB2LWZvcj0ncm93IGluIHBsYW4ucm93cyc+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz0ncm93LW5hbWUnPnt7cm93Lm5hbWV9fTwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPSdzY3JlZW4nIHYtaWY9J3BsYW4uc2NyZWVuUG9zID09PSAnYm90dG9tJyc+PC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgYCxcbiAgcHJvcHM6IHtcbiAgICBwbGFuOiB7XG4gICAgICB0eXBlOiBPYmplY3QsXG4gICAgICByZXF1aXJlZDogdHJ1ZVxuICAgIH1cbiAgfVxufSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9jb21wb25lbnRzL2Zsb29yLXBsYW4vZmxvb3ItcGxhbi5qcyIsImltcG9ydCBWdWUgZnJvbSAndnVlJztcbmltcG9ydCB0ZW1wbGF0ZSBmcm9tICcuL3RhYi5odG1sJztcblxuXG5WdWUuY29tcG9uZW50KCd0YWInLCB7XG5cdHRlbXBsYXRlLFxuXHRkYXRhKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRob3VzZWxpc3Q6W1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0bmFtZTogJ0hvdXNlIDEnLFxuXHRcdFx0XHRcdHVybDogJy8xJyxcblx0XHRcdFx0XHRpc0FjdGl2ZTogdHJ1ZSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdG5hbWU6ICdIb3VzZSAyJyxcblx0XHRcdFx0XHR1cmw6ICcvMicsXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRuYW1lOiAnSG91c2UgMycsXG5cdFx0XHRcdFx0dXJsOiAnLzMnLFxuXHRcdFx0XHR9XG5cdFx0XHRdLFxuXHRcdH07XG5cdH1cbn0pO1xuXG5cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2NvbXBvbmVudHMvdGFiL3RhYi5qcyIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9jb21tb24vY2luZW1hbGlzdC5jc3Ncbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2NvbW1vbi9jbGVhci5jc3Ncbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGc7XHJcblxyXG4vLyBUaGlzIHdvcmtzIGluIG5vbi1zdHJpY3QgbW9kZVxyXG5nID0gKGZ1bmN0aW9uKCkge1xyXG5cdHJldHVybiB0aGlzO1xyXG59KSgpO1xyXG5cclxudHJ5IHtcclxuXHQvLyBUaGlzIHdvcmtzIGlmIGV2YWwgaXMgYWxsb3dlZCAoc2VlIENTUClcclxuXHRnID0gZyB8fCBGdW5jdGlvbihcInJldHVybiB0aGlzXCIpKCkgfHwgKDEsZXZhbCkoXCJ0aGlzXCIpO1xyXG59IGNhdGNoKGUpIHtcclxuXHQvLyBUaGlzIHdvcmtzIGlmIHRoZSB3aW5kb3cgcmVmZXJlbmNlIGlzIGF2YWlsYWJsZVxyXG5cdGlmKHR5cGVvZiB3aW5kb3cgPT09IFwib2JqZWN0XCIpXHJcblx0XHRnID0gd2luZG93O1xyXG59XHJcblxyXG4vLyBnIGNhbiBzdGlsbCBiZSB1bmRlZmluZWQsIGJ1dCBub3RoaW5nIHRvIGRvIGFib3V0IGl0Li4uXHJcbi8vIFdlIHJldHVybiB1bmRlZmluZWQsIGluc3RlYWQgb2Ygbm90aGluZyBoZXJlLCBzbyBpdCdzXHJcbi8vIGVhc2llciB0byBoYW5kbGUgdGhpcyBjYXNlLiBpZighZ2xvYmFsKSB7IC4uLn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZztcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL34vd2VicGFjay9idWlsZGluL2dsb2JhbC5qcyIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9jb21wb25lbnRzL2Zsb29yLXBsYW4vZmxvb3ItcGxhbi5jc3Ncbi8vIG1vZHVsZSBpZCA9IDZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxkaXYgY2xhc3M9aGtjaW5lbWEtdGFiPiA8dWwgY2xhc3M9XFxcIm5hdiBuYXYtdGFic1xcXCI+IDxsaSB2LWZvcj1cXFwiaG91c2UgaW4gaG91c2VsaXN0XFxcIiB2LWJpbmQ6Y2xhc3M9XFxcInsgYWN0aXZlOiBob3VzZS5pc0FjdGl2ZSB9XFxcIj4gPGEgdi1iaW5kOmhyZWY9aG91c2UudXJsPnt7IGhvdXNlLm5hbWUgfX08L2E+IDwvbGk+IDwvdWw+IDwvZGl2PiBcIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2NvbXBvbmVudHMvdGFiL3RhYi5odG1sXG4vLyBtb2R1bGUgaWQgPSA3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBWdWUgZnJvbSAndnVlJztcbmltcG9ydCAnLi9jb21tb24vY2xlYXIuY3NzJztcbmltcG9ydCAnLi9jb21tb24vY2luZW1hbGlzdC5jc3MnO1xuaW1wb3J0ICcuL2NvbXBvbmVudHMvZmxvb3ItcGxhbi9mbG9vci1wbGFuJztcbmltcG9ydCAnLi9jb21wb25lbnRzL3RhYi90YWInO1xuXG5uZXcgVnVlKHtcblx0ZWw6ICcjYXBwJyxcblx0ZGF0YToge1xuXHRcdG1lc3NhZ2U6ICdIZWxsbyB3b3JsZCEnLFxuXHRcdGhlYWRlcjogJ0NpbmVtYSBXVEYgSElhYmMnLFxuXHRcdHBsYW46IHtcblx0XHRcdHNjcmVlblBvczogJ3RvcCcsXG5cdFx0XHRyb3dzOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRuYW1lOiAnQScsXG5cdFx0XHRcdFx0Y29sdW1uczogW1xuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRzZWF0OiAnMScsXG5cdFx0XHRcdFx0XHRcdHNjb3JlOiAxMFxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdF1cblx0XHRcdFx0fVxuXHRcdFx0XVxuXHRcdH0sXG5cdFx0Y2luZW1hTGlzdDogW1xuXHRcdFx0e1xuXHRcdFx0XHRyZWdpb246ICfmuK/ls7YnLFxuXHRcdFx0XHRsaXN0OiBbXG5cdFx0XHRcdFx0J0FNQyDlpKrlj6Tlu6PloLQnLCAnTCBDaW5lbWEnLCAnTUNMIEpQJywgJ01DTCDlurfmgKHmiLLpmaInLCAnTUNMIOa1t+aAoeaIsumZoicsICdNQ0wg55qH5a6k5oiy6ZmiJywgJ1VBIENpbmUgVGltZXMnLCAnVUEg6YqA5rKz5b2x6ZmiIERpcmVjdG9yXFwncyBDbHViJyxcblx0XHRcdFx0XHQn5paw5a+2IOe4vee1seaIsumZoicsICfnmb7ogIHljK8gUEFMQUNFIGlmYycsICfnmb7ogIHljK8g5pW456K85rivJ1xuXHRcdFx0XHRdXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRyZWdpb246ICfkuZ3pvo0nLFxuXHRcdFx0XHRsaXN0OiBbXG5cdFx0XHRcdFx0J0NpbmVtYSBDaXR5IOacl+ixquWdiicsICdGRVNUSVZBTCBHUkFORCBDSU5FTUEgJywgJ01DTCDlvrfnpo/miLLpmaInLCAnVGhlIEdyYW5kIENpbmVtYScsICdVQSBDaW5lIE1va28nLCAnVUEgQ2luZSBNb2tvIElNQVgnLFxuXHRcdFx0XHRcdCdVQSBpU1FVQVJFJywgJ1VBIGlTUVVBUkUgSU1BWCcsICdVQSBpU1FVQVJFIOmzs+WHsOW9semZoicsICdVQSBNZWdhQm94JywgJ1VBIE1lZ2FCb3ggQkVBIElNQVgnLFxuXHRcdFx0XHRcdCflmInnpr4gdGhlIHNreScsICflmInnpr4g5rW36YGL5oiy6ZmiJywgJ+WYieemviDpu4Pln5QnLCAn5a+255+z5oiy6ZmiJywgJ+W9seiXneaIsumZoicsICfmlrDlr7Yg5paw5a+25oiy6ZmiJywgJ+aWsOWvtiDosaroj6/miLLpmaInLCAn5pif5b2x5YyvJywgJ+eZvuiAgeWMryBQQUxBQ0UgYXBtJyxcblx0XHRcdFx0XHQn55m+6ICB5YyvIFRoZSBPTkUnLCAn55m+6ICB5YyvIOaXuuinkicsICfnmb7ogIHljK8g6I236YeM5rS7JywgJ+eZvuiAgeWMr+mbu+W9seS4reW/gydcblx0XHRcdFx0XVxuXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRyZWdpb246ICfmlrDnlYwnLFxuXHRcdFx0XHRsaXN0OiBbXG5cdFx0XHRcdFx0J01DTOaWsOmDveWfjuaIsumZoicsICdNQ0znsonltrrmiLLpmaInLCAnU1RBUiBDaW5lbWEnLCAnVUEg5bGv6ZaA5biC5buj5aC0Jyxcblx0XHRcdFx0XHQnVUEg5qmf5aC0SU1BWCcsICflhYPmnJfmiLLpmaInLCAn5ZiJ56a+IOeyieW2uicsICflmInnpr4g6I2D5paw5aSp5ZywJywgJ+WYieemviDpnZLooaMnLCAn5be06buO5YCr5pWm57SQ57SE57Gz6JitJywgJ+aWsOWvtiDlh7Hpg70nLCAn55m+6ICB5YyvIOWYiea5lumKgOW6pycsICfnmb7ogIHljK8g6I2D54GjJyxcblx0XHRcdFx0XHQn55m+6ICB5YyvIOiRteiKsycsICfppqzpno3lsbHmiLLpmaInXG5cdFx0XHRcdF1cblx0XHRcdH0sXG5cblx0XHRdLFxuXHR9XG59KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2luZGV4LmpzIl0sInNvdXJjZVJvb3QiOiIifQ==