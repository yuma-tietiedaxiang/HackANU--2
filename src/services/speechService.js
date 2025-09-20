// Speech service to run Python speech script
export const runSpeech = async () => {
  try {
    const response = await fetch("/api/speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Speech service failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Error running speech:", error);
    // Fallback to browser speech synthesis if Python fails
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(
        "Heyyy!! I'm the co-founder for your startup and I'm here to help. What are you looking for and which feature do you wanna explore?"
      );
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  }
};
