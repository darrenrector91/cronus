myApp.controller('UserController', ['UserService', function (UserService) {
    //console.log('UserController created');
    var self = this;
    self.userService = UserService;
    self.userObject = UserService.userObject;

    // saving user data 
    self.saveUserInfo = function (data) {
        UserService.saveUserInfo(data);
    };

    // Service to add item
    self.newItem = UserService.newItem;
    self.addItem = function (data) {
        _.forEach(data, function (o) {
            console.log(o.time_in);

        });
        UserService.addItem(data);
        self.newItem = '';
    };
}]);