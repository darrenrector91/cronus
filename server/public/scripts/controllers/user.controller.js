myApp.controller('UserController', ['UserService', '$mdDialog', function (UserService, $mdDialog) {
    //console.log('UserController created');
    var vm = this;
    vm.userService = UserService;
    vm.userObject = UserService.userObject;
    vm.tableData = UserService.tableData;
    vm.weekStart = UserService.weekStart;
    vm.getSelectWeek = UserService.getSelectWeek;

    // saving user data 
    vm.saveUserInfo = function (data) {
        UserService.saveUserInfo(data);
    };

    // Service to add item
    vm.newItem = UserService.newItem;

    vm.addItem = function (data) {
        UserService.addItem(data);
        vm.newItem = '';
    };

    vm.getStartDate = function (data) {
        UserService.getStartDate(data);
    };

    // Service to delete item
    vm.deleteItem = function (id) {
        UserService.deleteItem(id);
    };

    // vm.editTimeEntry = function (id) {
    //     UserService.editTimeEntry(id);
    // };

    vm.showAdvanced = function (ev, id) {
        UserService.showAdvanced(id);
        $mdDialog.show({
            controller: function () {
                return self;
            },
            controllerAs: 'vm',
            templateUrl: 'dialog1.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true
        })
    };

}]);