import requests
import json
from tabulate import tabulate
from collections import defaultdict
import csv

 

with open("config.json") as config_file:
    config = json.load(config_file)

# Replace with your GitHub repository details
owner = config["owner"]
repo = config["repo"]
access_token = config["access_token"]
# Define the date range you're interested in
since_date = config["since_date"]
until_date = config["until_date"]

 

# API endpoint to retrieve commit history
commit_endpoint = f"https://api.github.com/repos/{owner}/{repo}/commits"

 

headers = {"Authorization": f"Bearer {access_token}"}
params = {"since": since_date, "until": until_date}

 

response = requests.get(commit_endpoint, headers=headers, params=params)
commits = response.json()

 

commit_data_by_date = {}
print(commits)
for commit in commits:
    commit_sha = commit["sha"]
    commit_details_endpoint = f"https://api.github.com/repos/{owner}/{repo}/commits/{commit_sha}"
    commit_details_response = requests.get(commit_details_endpoint, headers=headers)
    commit_details = commit_details_response.json()

    commit_date = commit_details["commit"]["author"]["date"][:10]
    committer_name = commit_details["commit"]["committer"]["name"]
    committer_email = commit_details["commit"]["committer"]["email"]
    commit_filenames = ", ".join(file["filename"] for file in commit_details["files"])

    # Get the changes details using the "stats" key
    additions = commit_details["stats"]["additions"]
    deletions = commit_details["stats"]["deletions"]

    committer_key = f"{committer_name} <{committer_email}>"

    if commit_date not in commit_data_by_date:
        commit_data_by_date[commit_date] = {}

    if committer_key not in commit_data_by_date[commit_date]:
        commit_data_by_date[commit_date][committer_key] = {"commits": 0, "additions": 0, "deletions": 0, "files":[]}

    commit_data_by_date[commit_date][committer_key]["commits"] += 1
    commit_data_by_date[commit_date][committer_key]["additions"] += additions
    commit_data_by_date[commit_date][committer_key]["deletions"] += deletions
    commit_data_by_date[commit_date][committer_key]["files"].append(commit_filenames)

# Prepare data for the table
table_data = []
for date, committer_data in commit_data_by_date.items():
    for committer, data in committer_data.items():
        committed_files = "\n".join(data["files"])
        table_data.append([date, committer, data["commits"], data["additions"], data["deletions"],committed_files])

 

# Print the table
headers = ["Date", "Committer", "Commits", "Additions", "Deletions", "Committed Files"]
print(tabulate(table_data, headers=headers, tablefmt="grid"))

 

# Write CSV
csv_file_path = "commit_data.csv"
with open(csv_file_path, "w", newline="") as csv_file:
    csv_writer = csv.writer(csv_file)
    csv_writer.writerow(["Date", "Committer", "Commits", "Additions", "Deletions", "Committed Files"])
    csv_writer.writerows(table_data)

 

print(f"CSV file saved at {csv_file_path}")