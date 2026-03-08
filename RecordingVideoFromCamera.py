# -*- coding: utf-8 -*-
"""
Created on Mon Nov 10 23:34:01 2025

@author: Hayrunisa Polat
"""
import cv2
# Open the default camera for video capture
videoCapture = cv2.VideoCapture(0)

# Get the width and height of the video frames
frameWidth = int(videoCapture.get(cv2.CAP_PROP_FRAME_WIDTH))
frameHeight = int(videoCapture.get(cv2.CAP_PROP_FRAME_HEIGHT))

# Initialize the video writer with FourCC codec (DIVX), 20 FPS, and frame dimensions
videoWriter = cv2.VideoWriter("recordedVideo.mp4", cv2.VideoWriter_fourcc(*'DIVX'), 20, (frameWidth, frameHeight))

while True:
    isSuccessful, currentFrame = videoCapture.read()
    # Display the current frame
    cv2.imshow("Live Video", currentFrame)
    # Write the frame to the output file
    videoWriter.write(currentFrame)    
    # Exit the loop if the 'q' key is pressed
    if (cv2.waitKey(1) & 0xFF == ord('q')):
        break

# Release hardware and software resources
videoCapture.release()
videoWriter.release()
cv2.destroyAllWindows()
