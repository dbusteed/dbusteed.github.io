from requests import get

username = 'dbusteed'

# increase the per_page / use pagination if you have a lot of repos
resp = get(f'https://api.github.com/users/{username}/repos?per_page=100')

with open('github_projects.js', 'w') as f:
    f.write('const projects = [\n')
    for repo in resp.json():
        f.write('\t{\n')
        f.write(f"\t\tname: \"{repo['name']}\",\n")
        f.write(f"\t\turl: \"{repo['html_url']}\",\n")
        f.write(f"\t\tblurb: \"TODO\",\n")
        f.write(f"\t\ttags: [\"TODO\"]\n")
        f.write('\t},\n')
    f.write(']\n')