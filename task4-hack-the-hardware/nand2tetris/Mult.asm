// Initialize result to zero
@R2
M=0

// Initialize counter
@R1
D=M
@counter
M=D

(LOOP)
@counter
D=M
@END
D;JLE

// Add R0 to result
@R0
D=M
@R2
M=D+M

// Decrement counter
@counter
M=M-1

@LOOP
0;JMP

(END)
@END
0;JMP
