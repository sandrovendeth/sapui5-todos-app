sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  function (Controller, JSONModel, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("com.mycompany.myapp.controller.TodoList", {
      onInit: function () {
        this._loadTodos();
        this._oListFilterState = {
          aSearch: [],
          aStatus: [],
        };
      },

      _loadTodos: function () {
        var oModel = new JSONModel();
        var that = this;

        fetch("https://jsonplaceholder.typicode.com/todos")
          .then((response) => response.json())
          .then((data) => {
            oModel.setData(data);
            that.getView().setModel(oModel);

            sap.ui.getCore().setModel(oModel, "todosModel");
          })
          .catch((error) => {
            console.error("Erro ao carregar dados:", error);
          });
      },

      onItemPress: function (oEvent) {
        var oItem = oEvent.getSource();
        var oContext = oItem.getBindingContext();

        if (oContext) {
          var oTodo = oContext.getObject();

          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter.navTo("RouteDetail", {
            todoId: oTodo.id,
          });
        }
      },
      onListStatusChange: function (oEvent) {
        var bNewState = oEvent.getParameter("state");
        var oSwitch = oEvent.getSource();
        var oContext = oSwitch.getBindingContext();

        if (oContext) {
          var oTodo = oContext.getObject();
          oTodo.completed = bNewState;
          this.getView().getModel().refresh();

          sap.m.MessageToast.show(
            bNewState
              ? "Tarefa marcada como concluída!"
              : "Tarefa marcada como pendente!"
          );
        }
      },

      onSearch: function (oEvent) {
        var sQuery = oEvent.getParameter("newValue");
        this._oListFilterState.aSearch = [];
        if (sQuery) {
          this._oListFilterState.aSearch.push(
            new Filter("title", FilterOperator.Contains, sQuery)
          );
        }
        this._applyFilter();
      },

      onStatusFilterChange: function (oEvent) {
        var sKey = oEvent.getParameter("selectedItem").getKey();
        this._oListFilterState.aStatus = [];

        if (sKey === "Completed") {
          this._oListFilterState.aStatus.push(
            new Filter("completed", FilterOperator.EQ, true)
          );
        } else if (sKey === "Pending") {
          this._oListFilterState.aStatus.push(
            new Filter("completed", FilterOperator.EQ, false)
          );
        }
        this._applyFilter();
      },

      _applyFilter: function () {
        var aFilters = this._oListFilterState.aSearch.concat(
          this._oListFilterState.aStatus
        );
        var oList = this.byId("todosList");
        var oBinding = oList.getBinding("items");
        oBinding.filter(aFilters, "Application");
      },
      formatStatusIcon: function (bCompleted) {
        return bCompleted ? "sap-icon://accept" : "sap-icon://pending";
      },

      formatStatusColor: function (bCompleted) {
        return bCompleted ? "#2196F3" : "#FF9800";
      },

      formatStatusClass: function (bCompleted) {
        return bCompleted ? "sapUiPositiveText" : "sapUiCriticalText";
      },

      formatStatus: function (bCompleted) {
        return bCompleted ? "Concluído" : "Pendente";
      },
    });
  }
);
