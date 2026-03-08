# -*- coding: utf-8 -*-
"""
Created on Wed Nov 12 23:21:16 2025

@author: Hayrunisa Polat
"""

import cv2
import numpy as np

# Load and resize the image
image = cv2.imread("araba.jpg")
image = cv2.resize(image, (700, 700))
cv2.imshow("Original Image", image)

# Concatenate images horizontally
horizontalConcat = np.hstack((image, image))
cv2.imshow("Horizontal Concatenation", horizontalConcat)

# Concatenate images vertically
verticalConcat = np.vstack((image, image))
cv2.imshow("Vertical Concatenation", verticalConcat)

cv2.waitKey(0)
cv2.destroyAllWindows()
