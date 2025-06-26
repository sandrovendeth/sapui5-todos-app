sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/VBox",
    "sap/m/Label",
    "sap/m/Text",
    "sap/m/Switch",
  ],
  function (
    Controller,
    JSONModel,
    Filter,
    FilterOperator,
    Dialog,
    Button,
    VBox,
    Label,
    Text,
    Switch
  ) {
    "use strict";

    return Controller.extend("com.mycompany.myapp.controller.TodoList", {
      onInit: function () {
        console.log("TodoList Controller inicializado");
        this._loadTodos();
      },

      _loadTodos: function () {
        var oModel = new JSONModel();
        var that = this;

        fetch("https://jsonplaceholder.typicode.com/todos")
          .then((response) => response.json())
          .then((data) => {
            oModel.setData(data);
            that.getView().setModel(oModel);
            console.log("Dados carregados:", data.length + " todos");
          })
          .catch((error) => {
            console.error("Erro ao carregar dados:", error);
          });
      },

      onSearch: function (oEvent) {
        var sQuery = oEvent.getParameter("query");
        var oList = this.byId("todosList");
        var oBinding = oList.getBinding("items");

        if (sQuery) {
          var oFilter = new Filter("title", FilterOperator.Contains, sQuery);
          oBinding.filter([oFilter]);
        } else {
          oBinding.filter([]);
        }
      },

      onItemPress: function (oEvent) {
        var oItem = oEvent.getSource();
        var oContext = oItem.getBindingContext();

        if (oContext) {
          var oTodo = oContext.getObject();
          this._showTodoDetails(oTodo);
        }
      },

      _showTodoDetails: function (oTodo) {
        if (!this._oDialog) {
          this._createDialog();
        }

        // Atualiza os dados do dialog com o novo layout
        var oContent = this._oDialog.getContent()[0];

        // ID (posição 1 -> HBox -> item 1)
        oContent.getItems()[1].getItems()[0].getItems()[1].setText(oTodo.id);

        // Título (posição 1 -> VBox -> item 1 -> Text)
        oContent.getItems()[1].getItems()[1].getItems()[1].setText(oTodo.title);

        // User ID (posição 1 -> HBox -> item 1)
        oContent
          .getItems()[1]
          .getItems()[2]
          .getItems()[1]
          .setText(oTodo.userId);

        // Switch (posição 2 -> Panel -> HBox -> Switch)
        oContent
          .getItems()[2]
          .getContent()[0]
          .getItems()[1]
          .setState(oTodo.completed);

        // Armazena o todo atual
        this._currentTodo = oTodo;

        this._oDialog.open();
      },

      _createDialog: function () {
        var that = this;

        this._oDialog = new sap.m.Dialog({
          title: "Detalhes do Todo",
          contentWidth: "480px",
          contentHeight: "auto",
          content: [
            new sap.m.VBox({
              items: [
                // Header com ícone e título
                new sap.m.HBox({
                  items: [
                    new sap.m.Title({
                      text: "Informações da Tarefa",
                      level: "H3",
                    }),
                  ],
                  alignItems: "Center",
                  class: "sapUiMediumMarginBottom sapUiSmallMarginBegin",
                }),

                // Seção de informações
                new sap.m.VBox({
                  items: [
                    // ID
                    new sap.m.HBox({
                      items: [
                        new sap.m.Label({
                          text: "ID:",
                          design: "Bold",
                          width: "80px",
                        }),
                        new sap.m.Text({
                          id: "todoIdText",
                        }),
                      ],
                      alignItems: "Center",
                      class: "sapUiSmallMarginBottom",
                    }),

                    // Título
                    new sap.m.HBox({
                      items: [
                        new sap.m.Label({
                          text: "Título:",
                          design: "Bold",
                          width: "80px",
                        }),
                        new sap.m.Text({
                          id: "todoTitleText",
                          maxLines: 2,
                          width: "300px",
                        }),
                      ],
                      alignItems: "Center",
                      class: "sapUiSmallMarginBottom",
                    }),

                    // Usuário
                    new sap.m.HBox({
                      items: [
                        new sap.m.Label({
                          text: "Usuário:",
                          design: "Bold",
                          width: "80px",
                        }),
                        new sap.m.Text({
                          id: "todoUserText",
                        }),
                      ],
                      alignItems: "Center",
                      class: "sapUiMediumMarginBottom",
                    }),
                  ],
                  class: "sapUiMediumMarginBottom",
                }),

                // Seção de status
                new sap.m.Panel({
                  headerText: "Status da Tarefa22",
                  content: [
                    new sap.m.HBox({
                      items: [
                        new sap.m.VBox({
                          items: [
                            new sap.m.Label({
                              text: "Marcar como concluída",
                              design: "Bold",
                            }),
                            new sap.m.Text({
                              text: "Use o controle para alterar o status",
                              class: "sapUiTinyText",
                            }),
                          ],
                        }),
                        new sap.m.Switch({
                          id: "todoStatusSwitch",
                          customTextOn: " ",
                          customTextOff: " ",
                          change: function (oEvent) {
                            that.onStatusChange(oEvent);
                          },
                        }),
                      ],
                      alignItems: "Center",
                      justifyContent: "SpaceBetween",
                      class: "sapUiMediumMargin",
                    }),
                  ],
                  class: "sapUiNoMargin",
                }),
              ],
              class: "sapUiMediumMargin",
            }),
          ],
          beginButton: new sap.m.Button({
            text: "Fechar",
            type: "Emphasized",
            press: function () {
              that._oDialog.close();
            },
          }),
        });
      },

      onStatusChange: function (oEvent) {
        var bNewState = oEvent.getParameter("state");
        console.log(
          "Status alterado para:",
          bNewState ? "Concluído" : "Pendente"
        );

        if (this._currentTodo) {
          this._currentTodo.completed = bNewState;
          this.getView().getModel().refresh();

          // Feedback visual
          sap.m.MessageToast.show(
            bNewState
              ? "Tarefa marcada como concluída!"
              : "Tarefa marcada como pendente!"
          );
        }
      },
      onListStatusChange: function (oEvent) {
        var bNewState = oEvent.getParameter("state");
        var oSwitch = oEvent.getSource();
        var oContext = oSwitch.getBindingContext();

        if (oContext) {
          var oTodo = oContext.getObject();

          // Atualiza o objeto diretamente
          oTodo.completed = bNewState;

          // Atualiza o modelo
          this.getView().getModel().refresh();

          // Feedback visual
          sap.m.MessageToast.show(
            bNewState
              ? "Tarefa marcada como concluída!"
              : "Tarefa marcada como pendente!"
          );

          console.log(
            "Status da tarefa",
            oTodo.id,
            "alterado para:",
            bNewState ? "Concluído" : "Pendente"
          );
        }
      },

      onCloseDialog: function () {
        this._oDialog.close();
      },

      formatStatus: function (bCompleted) {
        return bCompleted ? "Concluído" : "Pendente";
      },
      formatStatusIcon: function (bCompleted) {
        return bCompleted ? "sap-icon://accept" : "sap-icon://pending";
      },

      formatStatusColor: function (bCompleted) {
        return bCompleted ? "#26383F" : "#007599";
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
