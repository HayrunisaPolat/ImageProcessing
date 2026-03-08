# -*- coding: utf-8 -*-
"""
Created on Sun Nov 16 21:17:59 2025

@author: Hayrunisa Polat
"""

import cv2
import numpy as np
# Read the input image
image = cv2.imread("kart.jpg")
cv2.imshow("Original Image", image)

targetWidth = 400
targetHeight = 500

# Define source points on the original image and corresponding destination points
sourcePoints = np.float32([[230, 1], [1, 472], [540, 150], [338, 617]])
destinationPoints = np.float32([[0, 0], [0, targetHeight], [targetWidth, 0], [targetWidth, targetHeight]])

# Calculate the perspective transformation matrix
perspectiveMatrix = cv2.getPerspectiveTransform(sourcePoints, destinationPoints)

# Apply the perspective transformation to get the final image
outputImage = cv2.warpPerspective(image, perspectiveMatrix, (targetWidth, targetHeight))

cv2.imshow("Transformed Image", outputImage)

# Wait for a key press and close windows to prevent freezing
cv2.waitKey(0)
cv2.destroyAllWindows()
