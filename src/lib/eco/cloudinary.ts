export function cldThumb(url: string, t = "w_600,h_450,c_fill,q_auto,f_auto") {
  // Inserta la transformación justo después de /upload/
  return url.includes("/upload/") ? url.replace("/upload/", `/upload/${t}/`) : url
}
