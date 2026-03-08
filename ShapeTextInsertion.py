# -*- coding: utf-8 -*-
"""
Created on Wed Nov 12 23:01:48 2025

@author: Hayrunisa Polat
"""

import cv2
import numpy as np

# Create a black image (all pixels are initialized to zero)
canvasImage = np.zeros((512, 512, 3), np.uint8)
cv2.imshow("Blank Image", canvasImage)

# Draw a line: image, start point, end point, color (BGR), thickness
imageWithLine = cv2.line(canvasImage, (0, 0), (512, 512), (180, 105, 255), 3)
cv2.imshow("Line Drawn", canvasImage)

# Draw a rectangle: image, top-left corner, bottom-right corner, color
# cv2.FILLED fills the inside of the rectangle
cv2.rectangle(canvasImage, (0, 0), (256, 256), (180, 105, 255), cv2.FILLED) 
cv2.imshow("Rectangle Drawn", canvasImage)

# Draw a circle: image, center coordinates, radius, color
cv2.circle(canvasImage, (300, 300), 45, (255, 0, 0), cv2.FILLED)
cv2.imshow("Circle Drawn", canvasImage)

# Add text: image, text string, bottom-left starting point, font type, font scale, color
cv2.putText(canvasImage, "TEXT", (256, 256), cv2.FONT_HERSHEY_COMPLEX, 1, (255, 255, 255))
cv2.imshow("Text Added", canvasImage)

# Wait for a key press and cleanly close all windows
cv2.waitKey(0)
cv2.destroyAllWindows()
