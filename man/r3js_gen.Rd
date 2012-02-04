\name{r3js_gen}
\alias{r3js_gen}
\title{generate all-in-one html file}
\usage{
  r3js_gen(obj, name = "r3js", dir = tempdir(),
    browse = TRUE)
}
\description{
  generate all-in-one html file
}
\examples{
obj <- r3js_new()

N <- 20
x <- rnorm(N, 0.5, 0.2)
y <- rnorm(N, 0.5, 0.2)
z <- rnorm(N, 0.5, 0.2)
r <- runif(N, 0.03, 0.1)
col <- rgb(runif(N), runif(N), runif(N))
obj <- r3js_add(obj, r3js_sphere(x, y, z, r = r, col = col, alpha = 0.5))

y <- seq(0, 1, 0.01)
x <- cos(y*50) / 2 + 0.5
z <- sin(y*50) / 2 + 0.5
N <- length(y)
col <- rgb(runif(N), runif(N), runif(N))
obj <- r3js_add(obj, r3js_line(x, y, z, lwd = 5, alpha = 0.7, col = col))

r3js_gen(obj, browse = TRUE)
}

