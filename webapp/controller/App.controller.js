sap.ui.define(["sap/ui/core/mvc/Controller"], function (Controller) {
  "use strict";

  return Controller.extend("com.mycompany.myapp.controller.App", {
    onInit: function () {
      console.log("App Controller inicializado com routing");
    },
  });
});
