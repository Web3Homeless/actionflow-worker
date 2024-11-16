
interface statusResponse {
    status: boolean;
  }

 const transactionProover = async (
    method: string,
    body: any
  ): Promise<statusResponse | undefined> => {

    try{
        console.log("transactionProover body: ", body);
        const response = await fetch(
            process.env.PROOVER_URI + method,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: body,
        }
        );

        const data: statusResponse = await response.json();
        console.log("transactionProover response: ", response);

        if (!response.ok) {
        throw new Error("Failed to post transactionProover");
        }
        console.log(data);
        return data;
    } catch (error) {
        console.error("Error getting transactionProover:", error);
        return undefined;
    }
  }

 const transferProover = async (
    method: string,
    body: any
    ): Promise<statusResponse | undefined> => {

    try{
        console.log("transferProover body: ", body);
        const response = await fetch(
            process.env.PROOVER_URI + method,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: body,
        }
        );

        const data: statusResponse = await response.json();
        console.log("transferProover response: ", response);

        if (!response.ok) {
        throw new Error("Failed to post transferProover");
        }
        console.log(data);
        return data;
    } catch (error) {
        console.error("Error getting transferProover:", error);
        return undefined;
    }
}

const twitterProover = async (
    method: string,
    body: any
    ): Promise<statusResponse | undefined> => {

    try{
        console.log("twitterProover body: ", body);
        const response = await fetch(
            process.env.PROOVER_URI + method,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: body,
        }
        );

        const data: statusResponse = await response.json();
        console.log("twitterProover response: ", response);

        if (!response.ok) {
        throw new Error("Failed to post twitterProover");
        }
        console.log(data);
        return data;
    } catch (error) {
        console.error("Error getting twitterProover:", error);
        return undefined;
    }
}

export const proover = {
    transactionProover,
    transferProover,
    twitterProover,
}