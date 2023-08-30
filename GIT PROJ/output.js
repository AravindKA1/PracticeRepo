document.addEventListener("DOMContentLoaded", function () {
    const since_date = sessionStorage.getItem("start_date");
    const until_date = sessionStorage.getItem("end_date");
    const access_token = sessionStorage.getItem("access_token");
    const username = sessionStorage.getItem("username");
    const repository = sessionStorage.getItem("repository");
    sessionStorage.clear();
    if (!since_date || !until_date || !access_token || !username || !repository) {
        window.location.href = "index.html";
    }

    function displayError(message) {
        const errorContainer = document.getElementById("errorContainer");
        errorContainer.textContent = message;
        errorContainer.style.display = "block";
        const table = document.getElementById("outputTable");
        table.style.display = "none";
    }

    function displayGroupedData(groupedData) {
        const tableBody = document.getElementById("groupedDataBody");
        tableBody.innerHTML = "";

        const sortedData = Object.values(groupedData).sort((a, b) => {
            return new Date(a.date) - new Date(b.date);
        });

        sortedData.forEach((group) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${group.author}</td>
                <td>${group.filename}</td>
                <td>${group.additions}</td>
                <td>${group.deletions}</td>
                <td>${group.date}</td>
            `;
            tableBody.appendChild(row);
        });

        const groupedDataTable = document.getElementById("groupedDataTable");
        groupedDataTable.style.display = "table";

        const errorContainer = document.getElementById("errorContainer");
        errorContainer.style.display = "none";
    }

    function fetchConfigAndCommits(since_date, until_date, access_token, username, repository) {
        
        fetch('config.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch config.json: ${response.statusText}`);
                }
                return response.json();
            })
            .then(config => {
                
                const apiUrl = config.apiUrls.commits.replace('{username}', username).replace('{repository}', repository);


                const groupedData = {};
                fetch(`${apiUrl}?since=${since_date}&until=${until_date}`, {
                    headers: {
                        Authorization: `token ${access_token}`,
                    },
                })
                    .then((response) => {
                        if (response.ok) {
                            return response.json();
                        } else {
                            throw new Error(`Failed to fetch commits: ${response.statusText}`);
                        }
                    })
                    .then((data) => {
                        if (Array.isArray(data)) {
                            const commits = [];
                            data.forEach((commit) => {
                                const url = config.apiUrls.commitDetails
                                .replace('{username}', username)
                                .replace('{repository}', repository)
                                .replace('{commit_sha}', commit.sha);
                            
                            console.log(url);
                            
                             
                                fetch(url, {
                                    headers: {
                                        Authorization: `token ${access_token}`,
                                    },
                                })
                                    .then((response) => response.json())
                                    .then((commitData) => {
                                        const commit_date = commit.commit.author.date.slice(0, 10);
                                        commitData.files.forEach((file) => {
                                            const filename = file.filename;
                                            const author = commitData.commit.author.name;
                                            const key = `${commit_date}-${filename}-${author}`;
        
                                            if (!groupedData[key]) {
                                                groupedData[key] = {
                                                    date: commit_date,
                                                    filename: filename,
                                                    author: author,
                                                    additions: 0,
                                                    deletions: 0,
                                                };
                                            }
                                            groupedData[key].additions += file.additions;
                                            groupedData[key].deletions += file.deletions;
                                        });
        
                                        commits.push({
                                            sha: commit.sha,
                                            date: commit_date,
                                            message: commit.commit.message,
                                            author: commitData.commit.author.name,
                                        });
        
                                        if (commits.length === data.length) {
                                            commits.sort((a, b) => (a.date < b.date ? 1 : -1));
                                            displayGroupedData(groupedData); 
                                        }
                                    })
                                    .catch((error) => {
                                        console.error("Error:", error);
                                        displayError("Failed to fetch commit details. Please check your inputs and try again.");
                                    });
                            });
                        } else {
                            console.error("Invalid data format:", data);
                            displayError("Invalid data format. Please check your inputs and try again.");
                        }
                    })
                    .catch((error) => {
                        console.error("Error fetching data:", error);
                        displayError("Failed to fetch commits. Please check your inputs and try again.");
                    });
            })
            .catch(error => {
                console.error("Error fetching config.json:", error);
                displayError("Failed to fetch configuration. Please check your inputs and try again.");
            });
    }

    fetchConfigAndCommits(since_date, until_date, access_token, username, repository);
});
