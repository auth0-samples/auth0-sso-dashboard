/*! Native Promise Only
    v0.7.8-a (c) Kyle Simpson
    MIT License: http://getify.mit-license.org
*/

(function UMD(name,context,definition){
	// special form of UMD for polyfilling across evironments
	context[name] = context[name] || definition();
	if (typeof module != "undefined" && module.exports) { module.exports = context[name]; }
	else if (typeof define == "function" && define.amd) { define(function $AMD$(){ return context[name]; }); }
})("Promise",typeof global != "undefined" ? global : this,function DEF(){
	/*jshint validthis:true */
	"use strict";

	var builtInProp, cycle, scheduling_queue,
		ToString = Object.prototype.toString,
		timer = (typeof setImmediate != "undefined") ?
			function timer(fn) { return setImmediate(fn); } :
			setTimeout
	;

	// dammit, IE8.
	try {
		Object.defineProperty({},"x",{});
		builtInProp = function builtInProp(obj,name,val,config) {
			return Object.defineProperty(obj,name,{
				value: val,
				writable: true,
				configurable: config !== false
			});
		};
	}
	catch (err) {
		builtInProp = function builtInProp(obj,name,val) {
			obj[name] = val;
			return obj;
		};
	}

	// Note: using a queue instead of array for efficiency
	scheduling_queue = (function Queue() {
		var first, last, item;

		function Item(fn,self) {
			this.fn = fn;
			this.self = self;
			this.next = void 0;
		}

		return {
			add: function add(fn,self) {
				item = new Item(fn,self);
				if (last) {
					last.next = item;
				}
				else {
					first = item;
				}
				last = item;
				item = void 0;
			},
			drain: function drain() {
				var f = first;
				first = last = cycle = void 0;

				while (f) {
					f.fn.call(f.self);
					f = f.next;
				}
			}
		};
	})();

	function schedule(fn,self) {
		scheduling_queue.add(fn,self);
		if (!cycle) {
			cycle = timer(scheduling_queue.drain);
		}
	}

	// promise duck typing
	function isThenable(o) {
		var _then, o_type = typeof o;

		if (o != null &&
			(
				o_type == "object" || o_type == "function"
			)
		) {
			_then = o.then;
		}
		return typeof _then == "function" ? _then : false;
	}

	function notify() {
		for (var i=0; i<this.chain.length; i++) {
			notifyIsolated(
				this,
				(this.state === 1) ? this.chain[i].success : this.chain[i].failure,
				this.chain[i]
			);
		}
		this.chain.length = 0;
	}

	// NOTE: This is a separate function to isolate
	// the `try..catch` so that other code can be
	// optimized better
	function notifyIsolated(self,cb,chain) {
		var ret, _then;
		try {
			if (cb === false) {
				chain.reject(self.msg);
			}
			else {
				if (cb === true) {
					ret = self.msg;
				}
				else {
					ret = cb.call(void 0,self.msg);
				}

				if (ret === chain.promise) {
					chain.reject(TypeError("Promise-chain cycle"));
				}
				else if (_then = isThenable(ret)) {
					_then.call(ret,chain.resolve,chain.reject);
				}
				else {
					chain.resolve(ret);
				}
			}
		}
		catch (err) {
			chain.reject(err);
		}
	}

	function resolve(msg) {
		var _then, def_wrapper, self = this;

		// already triggered?
		if (self.triggered) { return; }

		self.triggered = true;

		// unwrap
		if (self.def) {
			self = self.def;
		}

		try {
			if (_then = isThenable(msg)) {
				def_wrapper = new MakeDefWrapper(self);
				_then.call(msg,
					function $resolve$(){ resolve.apply(def_wrapper,arguments); },
					function $reject$(){ reject.apply(def_wrapper,arguments); }
				);
			}
			else {
				self.msg = msg;
				self.state = 1;
				if (self.chain.length > 0) {
					schedule(notify,self);
				}
			}
		}
		catch (err) {
			reject.call(def_wrapper || (new MakeDefWrapper(self)),err);
		}
	}

	function reject(msg) {
		var self = this;

		// already triggered?
		if (self.triggered) { return; }

		self.triggered = true;

		// unwrap
		if (self.def) {
			self = self.def;
		}

		self.msg = msg;
		self.state = 2;
		if (self.chain.length > 0) {
			schedule(notify,self);
		}
	}

	function iteratePromises(Constructor,arr,resolver,rejecter) {
		for (var idx=0; idx<arr.length; idx++) {
			(function IIFE(idx){
				Constructor.resolve(arr[idx])
				.then(
					function $resolver$(msg){
						resolver(idx,msg);
					},
					rejecter
				);
			})(idx);
		}
	}

	function MakeDefWrapper(self) {
		this.def = self;
		this.triggered = false;
	}

	function MakeDef(self) {
		this.promise = self;
		this.state = 0;
		this.triggered = false;
		this.chain = [];
		this.msg = void 0;
	}

	function Promise(executor) {
		if (typeof executor != "function") {
			throw TypeError("Not a function");
		}

		if (this.__NPO__ !== 0) {
			throw TypeError("Not a promise");
		}

		// instance shadowing the inherited "brand"
		// to signal an already "initialized" promise
		this.__NPO__ = 1;

		var def = new MakeDef(this);

		this["then"] = function then(success,failure) {
			var o = {
				success: typeof success == "function" ? success : true,
				failure: typeof failure == "function" ? failure : false
			};
			// Note: `then(..)` itself can be borrowed to be used against
			// a different promise constructor for making the chained promise,
			// by substituting a different `this` binding.
			o.promise = new this.constructor(function extractChain(resolve,reject) {
				if (typeof resolve != "function" || typeof reject != "function") {
					throw TypeError("Not a function");
				}

				o.resolve = resolve;
				o.reject = reject;
			});
			def.chain.push(o);

			if (def.state !== 0) {
				schedule(notify,def);
			}

			return o.promise;
		};
		this["catch"] = function $catch$(failure) {
			return this.then(void 0,failure);
		};

		try {
			executor.call(
				void 0,
				function publicResolve(msg){
					resolve.call(def,msg);
				},
				function publicReject(msg) {
					reject.call(def,msg);
				}
			);
		}
		catch (err) {
			reject.call(def,err);
		}
	}

	var PromisePrototype = builtInProp({},"constructor",Promise,
		/*configurable=*/false
	);

	// Note: Android 4 cannot use `Object.defineProperty(..)` here
	Promise.prototype = PromisePrototype;

	// built-in "brand" to signal an "uninitialized" promise
	builtInProp(PromisePrototype,"__NPO__",0,
		/*configurable=*/false
	);

	builtInProp(Promise,"resolve",function Promise$resolve(msg) {
		var Constructor = this;

		// spec mandated checks
		// note: best "isPromise" check that's practical for now
		if (msg && typeof msg == "object" && msg.__NPO__ === 1) {
			return msg;
		}

		return new Constructor(function executor(resolve,reject){
			if (typeof resolve != "function" || typeof reject != "function") {
				throw TypeError("Not a function");
			}

			resolve(msg);
		});
	});

	builtInProp(Promise,"reject",function Promise$reject(msg) {
		return new this(function executor(resolve,reject){
			if (typeof resolve != "function" || typeof reject != "function") {
				throw TypeError("Not a function");
			}

			reject(msg);
		});
	});

	builtInProp(Promise,"all",function Promise$all(arr) {
		var Constructor = this;

		// spec mandated checks
		if (ToString.call(arr) != "[object Array]") {
			return Constructor.reject(TypeError("Not an array"));
		}
		if (arr.length === 0) {
			return Constructor.resolve([]);
		}

		return new Constructor(function executor(resolve,reject){
			if (typeof resolve != "function" || typeof reject != "function") {
				throw TypeError("Not a function");
			}

			var len = arr.length, msgs = Array(len), count = 0;

			iteratePromises(Constructor,arr,function resolver(idx,msg) {
				msgs[idx] = msg;
				if (++count === len) {
					resolve(msgs);
				}
			},reject);
		});
	});

	builtInProp(Promise,"race",function Promise$race(arr) {
		var Constructor = this;

		// spec mandated checks
		if (ToString.call(arr) != "[object Array]") {
			return Constructor.reject(TypeError("Not an array"));
		}

		return new Constructor(function executor(resolve,reject){
			if (typeof resolve != "function" || typeof reject != "function") {
				throw TypeError("Not a function");
			}

			iteratePromises(Constructor,arr,function resolver(idx,msg){
				resolve(msg);
			},reject);
		});
	});

	return Promise;
});


return function(context, cb) {
  const samlAddons = ['samlp', 'salesforce_api', 'salesforce_sandbox_api', 'salesforce', 'box', 'concur']
  const wsFedAddons = ['wsfed', 'sharepoint'];

  var getAuthProtocol = (app) => {
    if (app.addons) {
      for (var addon in app.addons) {
        if (samlAddons.indexOf(addon) > -1) {
          return 'samlp';
        } else if (wsFedAddons.indexOf(addon) > -1) {
          return 'ws-fed';
        }
      }
    }

    return 'openid-connect';
  };

  var cleanApp = (app) => {
    var authProtocol = getAuthProtocol(app);
    switch (authProtocol) {
      case 'samlp':
        app.login_url = util.format(
          'https://%s/samlp/%s?connection=%s',
          process.env.AUTH0_DOMAIN,
          app.client_id,
          process.env.AUTH0_CONNECTION);
        break;
      case 'ws-fed':
        var callback = '';
        if (app.callbacks && app.callbacks.length > 1) {
          callback = app.callbacks[1];
        }
        app.login_url = util.format(
          'https://%s/wsfed/%s?whr=%s&wreply=%s',
          process.env.AUTH0_DOMAIN,
          app.client_id,
          process.env.AUTH0_CONNECTION,
          callback);
        break;
      case 'openid-connect':
        var callback = '';
        if (app.callbacks && app.callbacks.length > 0) {
          callback = app.callbacks[0];
        }
        app.login_url = util.format(
          'https://%s/authorize?response_type=code&scope=openid&client_id=%s&redirect_uri=%s&connection=%s',
          process.env.AUTH0_DOMAIN,
          app.client_id,
          callback, // Select the first callback url, this isn't really ideal though
          process.env.AUTH0_CONNECTION)
        break;
      default:
        throw 'unknown auth protocol';
    }
    delete app.addons;
    delete app.callbacks

    app.logo_url = '/img/logos/auth0.png';
    return settingsService.getClients()
    .then(clients => {
      var clientData = _.find(clients, { 'client_id': app.client_id });
      if (clientData) {
        if (clientData.logo_url) {
          app.logo_url = clientData.logo_url;
        }
      }
      return app;
    });
  }

  var getUserRoles = (user_id) => {
    console.log(user_id)
    return new Promise((resolve, reject) => {
      request({
        url: 'https://' + process.env.AUTH0_DOMAIN + '/api/v2/users/' + user_id, // + '?fields=groups,app_metadata',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + process.env.AUTH0_API_TOKEN
        }
      }, function(error, response, body) {
        if (error || response.statusCode !== 200) {
          console.error('HTTP Status: ' + response.statusCode);
          if (error) {
            console.error(error);
            reject(error);
          }
          reject('Invalid HTTP request. Status code: ' + response.statusCode);
        }
        settingsService.getRoles().then(roles => {
          var user = JSON.parse(body);
          var user_roles = [];
          if (user.groups && user.groups.length > 0) {
            user.groups.map(function(group) {
              var role = _.find(roles, function(role) {
                return role.name.toLowerCase() === group.toLowerCase();
              });
              if (role) {
                user_roles.push(role.id);
              }
            });
          } else if (user.app_metadata && user.app_metadata.roles && user.app_metadata.roles.length > 0) {
            user.app_metadata.roles.map(function(role_id) {
              user_roles.push(role_id)
            });
          }
          resolve(user_roles);
        });
      });

    });
  };

  var requestApps = () => {
    return new Promise((resolve, reject) => {
      request({
        url: 'https://' + process.env.AUTH0_DOMAIN + '/api/v2/clients?fields=name,client_id,addons,global,callbacks',
        headers: {
          'Authorization': 'Bearer ' + process.env.AUTH0_API_TOKEN
        }
      }, function(error, response, body) {
        if (error || response.statusCode !== 200) {
          if (error) {
            console.error(error);
            reject(error);
          }
          reject('Invalid HTTP request. Status code: ' + response.statusCode);
        }
        var apps = JSON.parse(body);
        resolve(apps);
      });
    });
  }

  var getApps = (securityTrim) => {
    securityTrim = securityTrim || function(apps) { return Promise.resolve(apps); }

    return this._requestApps()
    .then(apps => {
      var p = [];
      for (var i = 0; i < apps.length; i++) {
        var app = apps[i];
        // Filter out this app and the global 'all applications' app
        if (process.env.AUTH0_CLIENT_ID !== app.client_id && app.global === false) {
          // App is allowed, now check permissions
          p.push(this._cleanApp(app));
        }
      }
      return Promise.all(p);
    })
    .then(securityTrim)
    .then(apps => {
      return apps;
    });
  };

  var user_id = context.data.user_id;

  Promise.resolve(user_id)
  .then(this.getUserRoles)
  .then(user_role_ids => {
    return settingsService.getRoles()
    .then(roles => {
      var perms = {
        all_allowed: false,
        apps: []
      };
      user_role_ids.map(function(id) {
        var role = _.find(roles, { id: id });
        if (role) {
          perms.all_apps = perms.all_apps || role.all_apps;
          perms.apps = _.union(perms.apps, role.apps);
        }
      });
      return perms;
    }).then(perms => {
      var securityTrim = function(apps) {
        if (perms.all_apps) {
          return Promise.resolve(apps);
        } else {
          var allowed_apps = [];
          apps.map(function(app) {
            if (perms.apps.indexOf(app.client_id) > -1) {
              allowed_apps.push(app);
            }
          })
          return Promise.resolve(allowed_apps);
        }
      }
      var apps = this._getApps(securityTrim);
      cb(null, apps);
    }).catch(err => {
      cb(err);
    })
  });

}
