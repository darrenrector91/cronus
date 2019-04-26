myApp.service("UserService", ["$http", "$location",
    function ($http, $location) {
        //console.log('UserService Loaded');
        var self = this;

        self.userObject = {};

        self.getuser = function () {
            //console.log('UserService -- getuser');
            return $http.get("/api/user")
                .then(function (response) {
                        if (response.data.username) {
                            // user has a current session on the server
                            self.userObject.username = response.data.username;
                            self.userObject.first_name = response.data.first_name;
                            self.userObject.last_name = response.data.last_name;
                            self.userObject.job_position = response.data.job_position;
                        } else {
                            // user has no session, bounce them back to the login page
                            $location.path("/home");
                        }
                    },
                    function (response) {
                        //console.log('UserService -- getuser -- failure: ', response);
                        $location.path("/home");
                    }
                );
        };

        self.logout = function () {
            return $http.get("/api/user/logout").then(function (response) {
                self.getuser();
                $location.path("/home");
            });
        }
    }
]);