
from pathlib import Path
import numpy as np
import matplotlib.pyplot as plt

# Locate the supplied NumPy file
files = list(Path(".").glob("*.npy"))

if not files:
    raise FileNotFoundError(
        "Place the downloaded .npy file in this folder."
    )

data = np.load(files[0], allow_pickle=False)

print("File:", files[0].name)
print("Original shape:", data.shape)
print("Total elements:", data.size)
print("Data type:", data.dtype)
print("Minimum:", data.min())
print("Maximum:", data.max())

# Flatten and reshape into a square matrix
side = int(np.sqrt(data.size))

if side * side != data.size:
    raise ValueError(
        "Array cannot form a square matrix directly."
    )

matrix = data.reshape(side, side)

# Try common transformations
variants = {
    "Original": matrix,
    "Transpose": matrix.T,
    "Flip horizontally": matrix[:, ::-1],
    "Flip vertically": matrix[::-1, :],
    "Rotate 90": np.rot90(matrix, 1),
    "Rotate 180": np.rot90(matrix, 2),
    "Rotate 270": np.rot90(matrix, 3),
    "Transpose + horizontal flip": matrix.T[:, ::-1],
}

fig, axes = plt.subplots(2, 4, figsize=(16, 8))

for ax, (name, image) in zip(axes.flat, variants.items()):
    ax.imshow(image, cmap="gray", interpolation="nearest")
    ax.set_title(name)
    ax.axis("off")

plt.tight_layout()
plt.savefig("transformations.png", dpi=200)
plt.show()

print("Saved transformations.png")
