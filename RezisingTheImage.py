# -*- coding: utf-8 -*-
"""
Created on Wed Nov 12 22:41:44 2025

@author: Hayrunisa Polat
"""
import cv2
# Open the original image
originalImage = cv2.imread("araba.jpg")
print("Original image shape: ", originalImage.shape)
cv2.imshow("Original Image", originalImage)

# Resize the image to specific dimensions (width, height)
resizedImage = cv2.resize(originalImage, (500, 500))
print("Resized image shape: ", resizedImage.shape)
cv2.imshow("Resized Image", resizedImage)

# Crop the image using numpy slicing [startY:endY, startX:endX]
croppedImage = originalImage[:800, :800] 
print("Cropped image shape: ", croppedImage.shape)
cv2.imshow("Cropped Image", croppedImage)

# Wait for a key press and cleanly close all windows
cv2.waitKey(0)
cv2.destroyAllWindows()
