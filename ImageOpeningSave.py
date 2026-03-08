# -*- coding: utf-8 -*-
"""
Created on Mon Nov 10 22:01:52 2025

@author: Hayrunisa Polat
"""
import cv2

# Read the image
image = cv2.imread("araba.jpg") # Adding 0 as a second parameter reads it in grayscale

# Display the image
cv2.imshow("Car Image", image)

keyPressed = cv2.waitKey(0)
if keyPressed == 27: # Exit if ESC key is pressed
    cv2.destroyAllWindows()
elif keyPressed == ord('s'): # Save the image and exit if 's' key is pressed
    cv2.imwrite("savedCar.png", image)
    cv2.destroyAllWindows()
