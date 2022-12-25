//https://api.github.com/user/user_name/repos
// Github fetching API Data

// Below we are targetting all the class fields to get change when the github api is fetched
const user_img = document.querySelector(".user_img");
const userName = document.querySelector(".user_name h1");
const followers_ = document.querySelector(".followers_ span");
const follow_ = document.querySelector(".follow_ span");
const repo_details = document.querySelector(".repo_details");
const btn_submit = document.querySelector(".btn_submit");

let user_name = '';

// When user input the github info data in text box
function inputFunction() {
    let input_user = document.querySelector(".input_user").value.trim();
    // rim method will replace before and after white space of given value
    if (input_user.length <= 0) {
        window.confirm("Please enter github user name correctly");
        document.querySelector(".input_user").value = "";
        document.querySelector(".input_user").focus();
        return false;
    } else {
        user_name = input_user.split("").join("");
        // if everything is okay run the fetch user function
        fetchUser(); // this function will fetch the github data

        // clear the input box and focused  it for next i.e reset all the fields
        document.querySelector(".input_user").value = "";
        document.querySelector(".input_user").focus();

    }

};
// By using event listener on submit button it will run the above inputFunction to check for the correct username
btn_submit.addEventListener("click", function () {
    inputFunction()
});

// if the user press enter it should be submit
document.querySelector(".input_user").addEventListener("keyup", function (e) {
    if (e.keyCode === 13) {
        inputFunction()
    }
});

// fetching the usere data from github api
function fetchUser() {
    fetch(`https://api.github.com/users/${user_name}`)
        .then(response => response.json())
        .then(function (data) {
            //I am not testing live because unregistered user can hit only 60 times per hour
            console.log(data);
            if (data.message === "Not Found") {
                alert("User Not Found");
                return false;
            } else {
                user_img.innerHTML = `<img src="${data.avatar_url}">`;
                userName.innerHTML = data.login;
                followers_.innerHTML = data.followers;
                follow_.innerHTML = data.following;
                location.innerHTML = data.location;


            }
        })

    // fetching the repo data
    fetch(`https://api.github.com/users/${user_name}/repos`)
        .then(response => response.json())
        .then(function (repo_data) {
            console.log(repo_data);
            //if user type random name which is user but not have repository
            if (repo_data.length <= 0) {
                repo_details.innerHTML = `
                
                <div class="item_">
                    <div class="repo_name">No Repo Found</div>                
                </div>
            `
            } else {
                // when you type random user name if the use and repo both not found
                if (repo_data.message === "Not Found") {
                    repo_details.innerHTML = `
                <div class="item_">
                    <div class="repo_name">Not Found</div>
                    <div class="repo_details_">
                        <div class="info_ star">
                            <i class="fa fa-star-o"></i>10
                        </div>
                        <div class="info_ fork">
                            <p><i class="fa fa-code-fork"></i>30</p>
                        </div>
                        <div class="info_ size">
                            <p><i class="fa fa-file"></i>3000kb</p>
                        </div>
                    </div>
                </div>                
                `
                    user_img.innerHTML = `<img src="images/github_logo.png">`;
                    userName.innerHTML = `Not-Found`;
                    followers_.innerHTML = "0";
                    follow_.innerHTML = "0";
                } else {
                    repo_data = repo_data.map(item => {
                        console.log(item);
                        return (
                            `<div class="item_">
                        <div class="repo_name">${item.name}</div>
                        <div class="repo_details_">
                            <div class="info_ star">
                                <i class="fa fa-star-o"></i>
                                ${item.watchers}
                            </div>
                            <div class="info_ fork">
                                <p><i class="fa fa-code-fork"></i>
                                ${item.forks}
                                </p>
                            </div>
                            <div class="info_ size">
                                <p><i class="fa fa-file"></i>
                                ${item.size}kb
                                </p>
                            </div>
                        </div>
                    </div>
                        `
                        );
                    })
                    // I am taking maximum 6 repos
                    // you can take accourding to your requirement s
                    repo_details.innerHTML = repo_data.slice(0, 15).join("");
                }
            }
        });
}