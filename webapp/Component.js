sap.ui.define(
  ["sap/ui/core/UIComponent", "sap/ui/model/json/JSONModel"],
  function (UIComponent, JSONModel) {
    "use strict";

    return UIComponent.extend("com.mycompany.myapp.Component", {
      metadata: {
        manifest: "json",
      },

      init: function () {
        UIComponent.prototype.init.apply(this, arguments);

        this.getRouter().initialize();
      },

      createContent: function () {
        return sap.ui.view({
          viewName: "com.mycompany.myapp.view.App",
          type: "XML",
        });
      },
    });
  }
);
