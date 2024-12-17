document.getElementById('searchButton').addEventListener('click', () => {
    const query = document.getElementById('search').value;
    const language = document.getElementById('language').value;
    const minStars = document.getElementById('min-stars').value;
    const minForks = document.getElementById('min-forks').value;
    searchRepositories(query, language, minStars, minForks, 1);
});

document.getElementById('prevPage').addEventListener('click', () => {
    const currentPage = parseInt(document.getElementById('pageNumber').textContent);
    changePage(currentPage - 1);
});

document.getElementById('nextPage').addEventListener('click', () => {
    const currentPage = parseInt(document.getElementById('pageNumber').textContent);
    changePage(currentPage + 1);
});

async function searchRepositories(query, language, minStars, minForks, page) {
    const resultsDiv = document.getElementById('results');
    const loadingDiv = document.getElementById('loading');
    loadingDiv.classList.remove('hidden');
    resultsDiv.innerHTML = '';
    
    let url = `https://api.github.com/search/repositories?q=${query}`;
    if (language) url += `+language:${language}`;
    if (minStars) url += `+stars:>=${minStars}`;
    if (minForks) url += `+forks:>=${minForks}`;
    url += `&page=${page}&per_page=10`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    displayResults(data.items);
    updatePagination(data.total_count, page);
    loadingDiv.classList.add('hidden');
}

function displayResults(repositories) {
    const resultsDiv = document.getElementById('results');
    
    if (repositories.length === 0) {
        resultsDiv.innerHTML = 'No repositories found.';
        return;
    }

    repositories.forEach(repo => {
        const repoDiv = document.createElement('div');
        repoDiv.classList.add('repo');
        
        const repoName = document.createElement('h3');
        repoName.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;
        
        const repoDescription = document.createElement('p');
        repoDescription.textContent = repo.description;

        const repoStars = document.createElement('p');
        repoStars.textContent = `⭐ Stars: ${repo.stargazers_count}`;

        const repoForks = document.createElement('p');
        repoForks.textContent = `🍴 Forks: ${repo.forks_count}`;

        repoDiv.appendChild(repoName);
        repoDiv.appendChild(repoDescription);
        repoDiv.appendChild(repoStars);
        repoDiv.appendChild(repoForks);
        
        resultsDiv.appendChild(repoDiv);
    });
}

function updatePagination(totalCount, currentPage) {
    const prevButton = document.getElementById('prevPage');
    const nextButton = document.getElementById('nextPage');
    const pageNumber = document.getElementById('pageNumber');
    
    pageNumber.textContent = currentPage;
    
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = totalCount <= currentPage * 10;
}

function changePage(page) {
    const query = document.getElementById('search').value;
    const language = document.getElementById('language').value;
    const minStars = document.getElementById('min-stars').value;
    const minForks = document.getElementById('min-forks').value;
    searchRepositories(query, language, minStars, minForks, page);
}
