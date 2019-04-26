myApp.controller('UserController', ['UserService', function (UserService) {
    //console.log('UserController created');
    var self = this;
    self.userService = UserService;
    self.userObject = UserService.userObject;

    // saving user data 
    self.saveUserInfo = function (data) {
        UserService.saveUserInfo(data);
    };
}]);