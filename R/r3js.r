
col2num <- function(x) as.numeric(sub("#", "0x", x))
#' @export
r3js_sphere <- function(x, y, z, r = 0.02, col = rgb(1, 1, 0), alpha = 1) {
  n <- length(x)
  if (length(r) == 1) r <- rep(r, n)
  if (length(col) == 1) col <- rep(col, n)
  if (length(alpha) == 1) alpha <- rep(alpha, n)
  list(type = "sphere", n = n, x = x, y = y, z = z, r = r,
       col = col2num(col), alpha = alpha)
}

#' @export
r3js_curve <- function(expression, l = 0, u = 1, n = 101) {
  
}

#' @export
r3js_line <- function(x, y, z, lwd = 2, col = rgb(0, 1, 1), alpha = 1) {
  if (length(col) == 1) col <- rep(col, length(x))
  list(type = "line", n = length(x), x = x, y = y, z = z,
       lwd = lwd[1], col = col2num(col), alpha = alpha[1])
}

#' @export
r3js_lathe <- function(x, y, z, lwd = 2, col = rgb(0, 1, 1), alpha = 1) {
  list(type = "lathe", n = length(x), x = x, y = y, z = z,
       lwd = lwd[1], col = col2num(col[1]), alpha = alpha[1])
}

#' @export
#' @importFrom rjson toJSON
r3js_tojson <- function(obj) {
  sprintf("var r3jsdata = %s;", toJSON(obj))
}

#' @export
r3js_add <- function(obj, value) {
  obj$values <- c(obj$values, list(value))
  obj
}

#' @export
r3js_new <- function(xlim = c(0, 1), ylim = c(0, 1), zlim = c(0, 1), values = NULL) {
  list(xlim = xlim, ylim = ylim, values = values)
}

#' generate all-in-one html file
#'
#' @export
#' @examples
#' .libPaths(dirname(as.package("r3js")$path))
#' 
#' obj <- r3js_new()
#' 
#' N <- 20
#' x <- rnorm(N, 0.5, 0.2)
#' y <- rnorm(N, 0.5, 0.2)
#' z <- rnorm(N, 0.5, 0.2)
#' r <- runif(N, 0.03, 0.1)
#' col <- rgb(runif(N), runif(N), runif(N))
#' obj <- r3js_add(obj, r3js_sphere(x, y, z, r = r, col = col, alpha = 0.5))
#' 
#' y <- seq(0, 1, 0.01)
#' x <- cos(y*50) / 2 + 0.5
#' z <- sin(y*50) / 2 + 0.5
#' 
#' obj <- r3js_add(obj, r3js_line(x, y, z, lwd = 5, alpha = 0.3))
#' 
#' r3js_gen(obj, browse = TRUE)
r3js_gen <- function(obj, name = "r3js", dir = tempdir(), browse = TRUE) {

  dir.create(dir, FALSE)

  files <- list.files(system.file("", package = "r3js", mustWork = TRUE))
  if ("inst" %in% files)
    prefix <- "inst/"
  else
    prefix <- ""
  
  path.3js <- system.file(paste(prefix, "javascript/Three.js/Three.js", sep = ""),
                          package = "r3js", mustWork = TRUE)
  path.3js.license <- system.file(paste(prefix, "javascript/Three.js/LICENSE", sep = ""),
                                  package = "r3js", mustWork = TRUE)
  path.template <- system.file(paste(prefix, "template/template.html", sep = ""),
                               package = "r3js", mustWork = TRUE)
  path.r3js.js <- system.file(paste(prefix, "javascript/r3js.js", sep = ""),
                              package = "r3js", mustWork = TRUE)
  
  file.copy(path.3js, dir, TRUE)
  file.copy(path.3js.license, dir, TRUE)
  
  handle.template <- file(path.template, "r")
  template <- readLines(handle.template)
  close(handle.template)

  handle.r3js.js <- file(path.r3js.js, "r")
  r3js.js <- readLines(handle.r3js.js)
  close(handle.r3js.js)

  json <- paste(r3js_tojson(obj), collapse = "\n")
  out <- sub("%data%", json, template)
  out <- sub("%js%", paste(r3js.js, collapse = "\n"), out)

  path.out <- sprintf("%s/%s.html", dir, name)
  handle.out <- file(path.out, "w")
  writeLines(out, handle.out)
  close(handle.out)

  if (browse) browseURL(paste("file:///", normalizePath(path.out), sep = ""))

  invisible(path.out)
}
