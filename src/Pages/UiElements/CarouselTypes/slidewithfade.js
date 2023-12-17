import React, { useState } from "react";
import { UncontrolledCarousel } from "reactstrap";

// Carousel images
import img3 from "../../../assets/images/small/img-3.jpg";

const Slidewithfade = ({ image1, image2, image3, image4 }) => {
  return (
      <React.Fragment>
          <UncontrolledCarousel
              interval={false}
              items={[
                  {
                      altText: " ",
                      caption: " ",
                      key: 1,
                      src: image1 || img3,
                  },
                  {
                      altText: " ",
                      caption: " ",
                      key: 2,
                      src: image2 || img3,
                  },
                  {
                      altText: " ",
                      caption: " ",
                      key: 3,
                      src: image3 || img3,
                  },
                  {
                      altText: " ",
                      caption: " ",
                      key: 4,
                      src: image4 || img3,
                  },
              ]}
          />
      </React.Fragment>
  );
};

export default Slidewithfade;

