if (window.self === window.top) {
  document.write(`
  <header>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ml-auto">
            <li class="nav-item">
              <a class="nav-link btn btn-primary" href="../Home/PageHome.html">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link btn btn-primary" href="../Login/PageLogin.html">Login</a>
            </li>
            <li class="nav-item">
              <a class="nav-link btn btn-primary" href="../Game/PageGame.html">Game</a>
            </li>
          </ul>
        </div>
    </nav>
  </header>
`);
}


