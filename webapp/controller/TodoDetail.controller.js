sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/core/routing/History"],
  function (Controller, History) {
    "use strict";

    return Controller.extend("com.mycompany.myapp.controller.TodoDetail", {
      onInit: function () {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter
          .getRoute("RouteDetail")
          .attachPatternMatched(this._onObjectMatched, this);
      },

      _onObjectMatched: function (oEvent) {
        var sTodoId = oEvent.getParameter("arguments").todoId;

        this._loadTodoDetails(sTodoId);
      },

      _loadTodoDetails: function (sTodoId) {
        var oModel = sap.ui.getCore().getModel("todosModel");

        if (oModel) {
          var aTodos = oModel.getData();
          var oTodo = aTodos.find(function (todo) {
            return todo.id.toString() === sTodoId;
          });

          if (oTodo) {
            this._displayTodoDetails(oTodo);
            this._currentTodo = oTodo;
          } else {
            console.error("Todo não encontrado:", sTodoId);
            sap.m.MessageToast.show("Tarefa não encontrada!");
          }
        } else {
          console.error("Modelo de dados não encontrado");
          this._loadFromAPI(sTodoId);
        }
      },

      _loadFromAPI: function (sTodoId) {
        var that = this;

        fetch("https://jsonplaceholder.typicode.com/todos/" + sTodoId)
          .then((response) => response.json())
          .then((data) => {
            that._displayTodoDetails(data);
            that._currentTodo = data;
          })
          .catch((error) => {
            console.error("Erro ao carregar todo:", error);
            sap.m.MessageToast.show("Erro ao carregar detalhes da tarefa!");
          });
      },

      _displayTodoDetails: function (oTodo) {
        this.byId("todoId").setText(oTodo.id.toString());
        this.byId("todoTitle").setText(oTodo.title);
        this.byId("todoUser").setText("Usuário " + oTodo.userId);
        this.byId("statusSwitch").setState(oTodo.completed);
      },

      onStatusChange: function (oEvent) {
        var bNewState = oEvent.getParameter("state");

        if (this._currentTodo) {
          this._currentTodo.completed = bNewState;

          var oGlobalModel = sap.ui.getCore().getModel("todosModel");
          if (oGlobalModel) {
            var aTodos = oGlobalModel.getData();
            var iTodoIndex = aTodos.findIndex(
              function (todo) {
                return todo.id === this._currentTodo.id;
              }.bind(this)
            );

            if (iTodoIndex !== -1) {
              aTodos[iTodoIndex].completed = bNewState;
              oGlobalModel.refresh();
            }
          }

          sap.m.MessageToast.show(
            bNewState
              ? "Tarefa marcada como concluída!"
              : "Tarefa marcada como pendente!"
          );
        }
      },

      onNavBack: function () {
        var oHistory = History.getInstance();
        var sPreviousHash = oHistory.getPreviousHash();

        if (sPreviousHash !== undefined) {
          window.history.go(-1);
        } else {
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter.navTo("RouteMain");
        }
      },
    });
  }
);
