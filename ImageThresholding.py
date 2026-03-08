import cv2
import matplotlib.pyplot as plt

# Read the image and convert it to grayscale
image = cv2.imread("manzara.jpg")
image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

plt.figure()
plt.imshow(image, cmap="gray") # Set colormap to grayscale
plt.axis("off")
plt.show()

# Global Thresholding
# THRESH_BINARY: Pixels above the threshold (60) are set to maxval (255), others to 0.
# THRESH_BINARY_INV: Pixels above the threshold are set to 0, others to maxval.
_, thresholdedImage = cv2.threshold(image, thresh=60, maxval=255, type=cv2.THRESH_BINARY)

plt.figure()
plt.imshow(thresholdedImage, cmap="gray")
plt.axis("off")
plt.show()

# Adaptive Thresholding
# Calculates the threshold for small regions based on neighboring pixels. 
# blockSize defines the size of the neighborhood area.
adaptiveThresholdedImage = cv2.adaptiveThreshold(src=image, maxValue=255, adaptiveMethod=cv2.ADAPTIVE_THRESH_MEAN_C, thresholdType=cv2.THRESH_BINARY, blockSize=11, C=8)

plt.figure()
plt.imshow(adaptiveThresholdedImage, cmap="gray") 
plt.axis("off")
plt.show()
