
interface statusResponse {
    status: boolean;
  }

 const transactionProover = async (
    method: string,
    address: any,
    body: any
  ): Promise<statusResponse | undefined> => {

    try{
        console.log("transactionProover body: ", body);
        const response = await fetch(
            process.env.PROOVER_URI + method +"/" + address,
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
    address: any,
    body: any
    ): Promise<statusResponse | undefined> => {

    try{
        console.log("transactionProover body: ", body);
        const response = await fetch(
            process.env.PROOVER_URI + method +"/" + address,
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

const twitterProover = async (
    method: string,
    address: any,
    body: any
    ): Promise<statusResponse | undefined> => {

    try{
        console.log("transactionProover body: ", body);
        const response = await fetch(
            process.env.PROOVER_URI + method +"/" + address,
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

export const proover = {
    transactionProover,
    transferProover,
    twitterProover,
}