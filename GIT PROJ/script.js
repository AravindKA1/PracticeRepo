function fetchGitHubRepos() {
  const username = document.getElementById("username").value;
  const accessToken = document.getElementById("access_token").value;
  const reposDropdown = document.getElementById("repository");

  if (accessToken === "" || username === "") {
      alert("Please fill out all required fields");
      return;
  }

  fetch("config.json")
      .then((response) => response.json())
      .then((config) => {
          
          const apiUrls = config.apiUrls;
          const apiUrl = apiUrls.repos.replace("{username}", username);
          return fetch(apiUrl, {
              headers: {
                  Authorization: `Bearer ${accessToken}`,
              },
          });
      })
      .then((response) => response.json())
      .then((data) => {
          reposDropdown.innerHTML = "";
          data.forEach((repo) => {
              const option = document.createElement("option");
              option.value = repo.name;
              option.textContent = repo.name;
              reposDropdown.appendChild(option);
          });
      })
      .catch((error) => {
          console.error("Error fetching GitHub repositories:", error);
      });

  
      const getreopsButton = document.getElementById("getReposButton");
      getreopsButton.style.display = "none";

      const repodropdown = document.getElementById("repository");
      repodropdown.style.display = "block";

      const submitButton = document.getElementById("submit-button");
      submitButton.style.display = "block";

      const start_date = document.getElementById("start_date");
      start_date.style.display = "block";

      const end_date = document.getElementById("end_date");
      end_date.style.display = "block";
      const start_date_label = document.getElementById("start_date_label");
      start_date_label.style.display = "block";

      const end_date_label = document.getElementById("end_date_label");
      end_date_label.style.display = "block";
      
      const repolabel = document.getElementById("repolabel");
      repolabel.style.display = "block";
}

document.addEventListener("DOMContentLoaded", function () {
  const storedStartDate = sessionStorage.getItem("start_date");
  const storedEndDate = sessionStorage.getItem("end_date");
  const storedAccessToken = sessionStorage.getItem("access_token");
  const storedUsername = sessionStorage.getItem("username");
  const storedRepository = sessionStorage.getItem("repository");
  sessionStorage.clear();
  if (storedStartDate) {
      document.getElementById("start_date").value = storedStartDate;
  }
  if (storedEndDate) {
      document.getElementById("end_date").value = storedEndDate;
  }
  if (storedAccessToken) {
      document.getElementById("access_token").value = storedAccessToken;
  }
  if (storedUsername) {
      document.getElementById("username").value = storedUsername;
  }
  if (storedRepository) {
      document.getElementById("repository").value = storedRepository;
  }

  function getCommits() {
      const since_date = document.getElementById("start_date").value;
      const until_date = document.getElementById("end_date").value;
      const access_token = document.getElementById("access_token").value;
      const username = document.getElementById("username").value;
      const repository = document.getElementById("repository").value;

      if (since_date === "" || until_date === "" || access_token === "" || username === "" || repository === "") {
          alert("Please fill out all required fields");
          return;
      }

      sessionStorage.setItem("start_date", since_date);
      sessionStorage.setItem("end_date", until_date);
      sessionStorage.setItem("access_token", access_token);
      sessionStorage.setItem("username", username);
      sessionStorage.setItem("repository", repository);
      window.location.href = "output.html";
  }

  const submitButton = document.getElementById("submit-button");
  submitButton.addEventListener("click", getCommits);

  
  const getReposButton = document.getElementById("getReposButton");
  getReposButton.addEventListener("click", fetchGitHubRepos);
});
