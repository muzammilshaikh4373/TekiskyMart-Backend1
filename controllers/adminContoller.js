
// import { addProdactSerivces, getProdactServioces, productUpdateService } from "../services/adminServices.js";
import aws from "aws-sdk"
import { addProductSerivce, getProductService, productDeleteService, productUpdateService } from "../services/adminServices.js";
import { updateOrder } from "./orderController.js";
import dotenv from "dotenv"
dotenv.config();

//AWS Upload Code
aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SEC_KEY,
    region: process.env.AWS_REGION,
  });
  
  
  const s3 = new aws.S3();
  
  const uploadFile = async (file) => {
      // console.log('File Buffer:', file.buffer); // Log the file buffer
      const params = {
          Bucket: process.env.AWS_BUCKET_NAME ,
          Key: `images/${Date.now()}_${file.originalname}`,
          Body: file.buffer,
      };
      // console.log('Upload Params:', params);
      try {
          const data = await s3.upload(params).promise();
          return data;
      } catch (error) {
          throw new Error(`Error uploading file: ${error.message}`);
      }
  };
  

// createing prodact in DB 
export const addProduct = async (req, res) => {
   let url;
    try {
        console.log(req.body)
        console.log(req.file,"file");
    if(req.file!=undefined){

      // Assuming req.files is an array of files
    //   const imageProduct = await Promise.all(req.files.map(file => uploadFile(file)));
    //   console.log("imageProduct  ===>", imageProduct);
    const imageProduct = await uploadFile(req.file);
            console.log('imageProduct ===>', imageProduct);
            // const uploadedImage = {
            //     imageUrl: imageProduct.Location,
            //     imageName: imageProduct.Key,
            // };
            // console.log(uploadedImage);
            


      console.log('Uploaded Image:', imageProduct);
      const uploadedImagesUrl = {
          imageUrl: imageProduct.Location,
          imageName: imageProduct.Key
      }
      console.log(uploadedImagesUrl);
      url=uploadedImagesUrl.imageUrl;
      
    }
    console.log("url for s3 bucket image=======>",url);

        const status = await addProductSerivce(req.body,url);

        if (status === 'successfull') {
            res.status(201).json({success : true , message : "Successfully added product"});
        } else {
            res.status(400).json({success : false , message : "error while adding the product"});
            }
    } catch (error) {
        console.error('Error in controller adding product:', error);
        res.status(500).send('Error in controller adding product');
    }
};


//get prodact services 
export const getProduct = async (req, res) => {
    try {
        const products = await getProductService();
        res.status(200).json({success : true, products:products }); // Sending status and products as an object
    } catch (error) {
        console.error('Error in getting products:', error);
        res.status(500).json({ status: 'error', message: 'Error in getting products' });
    }
};



export const updateProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const updatedProduct = await productUpdateService(id, updatedData);

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            order: updatedProduct // assuming updatedProduct contains the updated document
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
export const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id
        const updateProduct = await productDeleteService(id)
        res.status(200).json({ success: true, message: "product deleted successfully" })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })

    }

}



