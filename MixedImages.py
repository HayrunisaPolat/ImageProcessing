# -*- coding: utf-8 -*-
"""
Created on Sun Nov 16 21:44:18 2025

@author: Hayrunisa Polat
"""

import cv2
import matplotlib.pyplot as plt

# Read the images
firstImage = cv2.imread("agac.jpg")
firstImage = cv2.cvtColor(firstImage, cv2.COLOR_BGR2RGB) # Convert from BGR to RGB for matplotlib compatibility

secondImage = cv2.imread("deniz.jpg")
secondImage = cv2.cvtColor(secondImage, cv2.COLOR_BGR2RGB)

# Resize images to the same dimensions
firstImage = cv2.resize(firstImage, (600, 600))
secondImage = cv2.resize(secondImage, (600, 600))

# Blend images with equal weights (50% each)
blendedImage = cv2.addWeighted(firstImage, 0.5, secondImage, 0.5, gamma=0)

plt.figure()
plt.imshow(blendedImage)
plt.axis("off") # Hide axes for a cleaner output
plt.show()


