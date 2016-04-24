var app = angular.module('todoApp', ['ngMaterial']);

app.run(function () {
    var existingTasks = localStorage.getItem("db");

    if (!existingTasks || !angular.isArray(JSON.parse(existingTasks))) {
        localStorage.setItem("db", JSON.stringify([]));
    }
});

app.factory('tasksFactory', function () {
    return {
        addTask: function (task) {
            var existingTasks = this.getTasks();

            var newTaskDate = new Date().getTime();

            var obj = {};

            obj[newTaskDate] = {
                'name': task,
                'done': false,
                'id': newTaskDate
            };

            existingTasks.push(obj);

            localStorage.setItem("db", JSON.stringify(existingTasks));
        },
        getTasks: function () {
            return JSON.parse(localStorage.getItem("db"));
        },
        syncScopeWithStorage: function (updated) {
            localStorage.setItem("db", JSON.stringify(updated));
        }
    }
});

app.controller('AppCtrl', function ($scope, $mdDialog, $mdToast, tasksFactory) {

    $scope.userTypedText = '';

    $scope.meta = {
        name: 'My Todo List',
        show: 'All tasks'
    };

    $scope.categoriesList = [
        {'title': 'All tasks', 'icon': 'list'},
        {'title': 'Todo', 'icon': 'assignment'},
        {'title': 'Done', 'icon': 'done'}
    ];

    $scope.DB = tasksFactory.getTasks();

    $scope.addNewTask = function (task) {
        tasksFactory.addTask(task);
        $scope.DB = tasksFactory.getTasks();
        $scope.userTypedText = '';
        $mdToast.showSimple(task + " was added!");
    };

    $scope.markTaskAsDone = function () {
        tasksFactory.syncScopeWithStorage($scope.DB);
    };

    $scope.objectDelete = function (id) {
        $scope.DB.splice(id, 1);
        localStorage.setItem("db", JSON.stringify($scope.DB));
        $scope.DB = tasksFactory.getTasks();
    };

    $scope.changeTab = function (content) {
        $scope.meta.show = content;
    };

    $scope.showAdd = function (ev) {
        $mdDialog.show({
            controller: AddDialogCtrl,
            template: '<md-dialog aria-label="User Form"> <md-content class="md-padding"> <form name="userForm"> <md-input-container> <label>New Task</label> <input ng-model="newTask" placeholder="Placeholder text"> </md-input-container> </form> </md-content> <div class="md-actions" layout="row"> <span flex></span> <md-button ng-click="cancel()"> Cancel </md-button> <md-button ng-click="add(newTask)" class="md-primary"> Add task </md-button> </div></md-dialog>',
            targetEvent: ev
        })
        .then(function (task) {
            $scope.addNewTask(task);
            $mdToast.showSimple('Task "' + task + '" was added!');
        });
    };

});

function AddDialogCtrl($scope, $mdDialog) {
    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.add = function (task) {
        $mdDialog.hide(task);
    };
}
