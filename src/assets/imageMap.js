const localImages = import.meta.glob("./**/*.{png,jpg,jpeg,webp}", {
  eager: true,
  import: "default",
});


const resolveLocalImage = (path) => localImages[`./${path}`] ?? null;

const imageMap = {
  logoSesareng: resolveLocalImage("logo/logo-sesareng.png"),
  logoSleman: resolveLocalImage("logo/logo-sleman.png"),
  hierroWatch: resolveLocalImage("umkm/hierro-watch.png"),
  bakpiaKencana: resolveLocalImage("umkm/bakpia-kencana.png"),
  batikAstoetik: resolveLocalImage("umkm/batik-astoetik.png"),
  jogjaMediaTraining: resolveLocalImage("providers/jogja-media-training.png"),
  gmedia: resolveLocalImage("providers/gmedia.png"),
  uny: resolveLocalImage("universities/uny.png"),
  ugm: resolveLocalImage("universities/ugm.png"),
  uin: resolveLocalImage("universities/uin.png"),
  uii: resolveLocalImage("universities/uii.png"),
};

export default imageMap;