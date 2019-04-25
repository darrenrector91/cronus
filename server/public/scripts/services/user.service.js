myApp.service("UserService", [
    "$http",
    "$location",
    function ($http, $location) {
        console.log('UserService Loaded');
        var self = this;

        self.userObject = {};

        (self.getuser = function () {
            console.log('UserService -- getuser');
            return $http.get("/api/user").then(
                function (response) {
                    if (response.data.username) {
                        // user has a current session on the server
                        self.userObject.username = response.data.username;
                        self.userObject.first_name = response.data.first_name;
                        self.userObject.last_name = response.data.last_name;
                        self.getCatch();
                        self.latLong();
                        console.log(self.userObject);
                        console.log('UserService -- getuser -- User Data: ', response.data.id);
                    } else {
                        console.log('UserService -- getuser -- failure');
                        // user has no session, bounce them back to the login page
                        $location.path("/home");
                    }
                },
                function (response) {
                    console.log('UserService -- getuser -- failure: ', response);
                    $location.path("/home");
                }
            );
        }),
        (self.logout = function () {
            console.log('UserService -- logout');
            swal({
                text: "Do you want to log out?",
                icon: "warning",
                buttons: ["No", "Yes"],
                dangerMode: true
            }).then(loggingOut => {
                if (loggingOut) {
                    return $http.get("/api/user/logout").then(function (response) {
                        swal("User was logged out!");
                        self.getuser();
                        $location.path("/home");
                    });
                } else {
                    swal({
                        text: "User will remain logged in!",
                        icon: "info"
                    });
                }
            });
        });
    }
]);