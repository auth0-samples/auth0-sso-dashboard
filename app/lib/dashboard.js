var Dashboard = (function() {

  var appsContainer = document.getElementById('apps');

  var load = function(apps) {
    $.getJSON('/settings.json', function(settings) {
      if (apps.length === 0) {
        loadNoAppsMessage();
      } else {
        loadApps(apps, settings)
      }
    });
  };

  var loadNoAppsMessage = function() {
    var message = document.createElement('h4');
    message.innerText = "It looks like you haven't been authorized to use any applications yet.";
    appsContainer.appendChild(message);
  }

  var loadApps = function(apps, settings) {
    for (var i = 0; i < apps.length; i++) {
      var appId = apps[i];
      var app = settings[appId];
      loadAppDOM(app);
    }
  };

  var loadAppDOM = function(app) {
    var html = '<a href="' + app.loginUrl + '"><img src="/img/logos/' + app.logo + '" /></a>' +
               '<a class="name" href="' + app.loginUrl + '">' + app.name + '</a>';

    var appContainer = document.createElement('div');
    appContainer.setAttribute('class', 'app')
    appContainer.innerHTML = html;

    appsContainer.appendChild(appContainer);
  }

  return {
    load: load
  }
})();
