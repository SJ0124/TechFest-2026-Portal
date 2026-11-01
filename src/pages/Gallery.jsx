function Gallery() {
  const images = [
    "https://picsum.photos/seed/techfest1/300/200",
    "https://picsum.photos/seed/techfest2/300/200",
    "https://picsum.photos/seed/techfest3/300/200"
  ];

  return (
    <div className="page">
      <h1>Gallery</h1>
      <div className="gallery-grid">
        {images.map((src, index) => (
          <img key={index} src={src} alt="TechFest" />
        ))}
      </div>
    </div>
  );
}

export default Gallery;
