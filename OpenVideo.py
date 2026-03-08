# -*- coding: utf-8 -*-
"""
Created on Mon Nov 10 23:13:32 2025

@author: Hayrunisa Polat
"""
import cv2
import time

videoName = "video.mp4"
videoCapture = cv2.VideoCapture(videoName)

# Check if the video file was opened successfully
if (videoCapture.isOpened() == False):
    print("Error: Video file is empty or cannot be read.")

# Property identifier 3 corresponds to frame width, 4 to frame height
print("Width: ", videoCapture.get(3))
print("Height: ", videoCapture.get(4))

while True:
    isSuccessful, currentFrame = videoCapture.read()
    
    if isSuccessful == True:
        # Add a slight delay to play the video at a normal speed
        time.sleep(0.05) 
        cv2.imshow("Video Player", currentFrame)
    else: 
        break
        
    # Exit the loop and stop the video if the 'q' key is pressed
    if (cv2.waitKey(1) & 0xFF == ord("q")): 
        break

# Release the video capture object to free resources
videoCapture.release()

# Close all active OpenCV windows
cv2.destroyAllWindows()

cv2.destroyAllWindows()#bütün pencereleri kapatıyoruz.
