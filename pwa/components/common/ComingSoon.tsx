import React from "react";

import Image from "next/image";
import comingSoon from "../../public/images/coming_soon.jpg";

const ComingSoon: React.FC = () => (
  <Image
    alt="comming soon"
    src={comingSoon}
    width={1280}
    height={800}
  />
)

export default ComingSoon;
