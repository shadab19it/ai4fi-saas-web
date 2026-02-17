import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import commonService from "../services/commonService";
import { toast } from "sonner";
import { LoadingSpinner } from "../components/ModelGenerator/ModelConfigForm/ModelConfigForm";

export interface IEmailConfig {
  name: string;
  company: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  defineYourSelf: string;
  howYouFoundUs: string;
  alreadyPhotoshoot: string;
}

const ContactForm: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<IEmailConfig>({
    name: "",
    company: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
    defineYourSelf: "",
    howYouFoundUs: "",
    alreadyPhotoshoot: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (
        !formData.name ||
        !formData.email ||
        !formData.message ||
        !formData.howYouFoundUs ||
        !formData.defineYourSelf ||
        !formData.alreadyPhotoshoot
      ) {
        setLoading(false);
        return toast.error("Please fill in all required fields.");
      }
      const emailRes = await commonService.sendEmail(formData);
      toast.success(emailRes.message);
      setLoading(false);
      setFormData({
        name: "",
        company: "",
        phone: "",
        email: "",
        subject: "",
        message: "",
        defineYourSelf: "",
        howYouFoundUs: "",
        alreadyPhotoshoot: "",
      });
    } catch (error: any) {
      setLoading(false);
      console.error("Error:", error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className='flex flex-col h-auto justify-center items-center dark:bg-gradient-to-br from-sky-950 to-gray-950 bg-background dark:bg-transparent pb-16 lg:pt-28'>
      <div className='max-w-7xl w-full flex flex-col md:flex-row justify-center items-center'>
        {/* Left Section */}
        <motion.div
          className='flex flex-col w-full md:w-1/2 justify-center items-center md:items-start text-center md:text-left px-4 py-8'
          initial={{ x: "-100vw", opacity: 0 }}
          animate={{ x: 0, opacity: 1, transition: { duration: 0.7 } }}>
          <h6 className='text-foreground text-2xl font-semibold mb-6'>Get in Touch</h6>
          <h2 className='text-lg text-brand-gradient sm:text-3xl md:text-4xl lg:text-5xl mb-6 leading-10'>Are you ready to talk to us?</h2>
          <div className='h-px w-3/4 bg-card mb-6'></div>
          <div className='flex items-center space-x-4'>
            <Mail className='text-3xl text-foreground' />
            <div>
              <a href='mainto:sales@apricityts.com' className='cursor-pointer text-foreground'>
                sales@apricityts.com
              </a>
            </div>
          </div>
        </motion.div>

        {/* Right Section */}
        <motion.div
          className='flex flex-col w-full md:w-2/5 shadow-lg py-8 px-10 bg-card rounded-lg'
          initial={{ x: "100vw", opacity: 0 }}
          animate={{ x: 0, opacity: 1, transition: { duration: 0.7 } }}>
          <h4 className='text-cyan-600 text-2xl font-semibold mb-6'>Send us a message</h4>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleChange}
                placeholder='Name'
                required
                className='w-full p-3 border border-border  rounded-md text-foreground'
              />
              <input
                type='text'
                name='company'
                value={formData.company}
                onChange={handleChange}
                placeholder='Company'
                className='w-full p-3 border border-border rounded-md text-foreground'
              />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <input
                type='tel'
                name='phone'
                value={formData.phone}
                onChange={handleChange}
                placeholder='Phone'
                className='w-full p-3 border border-border rounded-md text-foreground'
              />
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                placeholder='Email'
                className='w-full p-3 border border-border rounded-md text-foreground'
                required
              />
            </div>

            <div className='space-y-2'>
              <label className='block text-cyan-600 font-medium'>You are a</label>
              <div className='radio-buttons-container flex w-full gap-2 '>
                <div className='radio-button basis-1/2'>
                  <input
                    name='defineYourSelf'
                    id='radio2'
                    className='radio-button__input'
                    type='radio'
                    value='Clothes manufacturer'
                    onChange={handleChange}
                  />
                  <label htmlFor='radio2' className='radio-button__label'>
                    <span className='radio-button__custom'></span>
                    Clothes Manufacturer
                  </label>
                </div>
                <div className='radio-button basis-1/2'>
                  <input
                    name='defineYourSelf'
                    id='radio1'
                    className='radio-button__input'
                    type='radio'
                    value='Retailers'
                    onChange={handleChange}
                  />
                  <label htmlFor='radio1' className='radio-button__label'>
                    <span className='radio-button__custom'></span>
                    Retailers
                  </label>
                </div>
              </div>

              <div className='radio-buttons-container flex gap-2'>
                <div className='radio-button basis-1/2'>
                  <input
                    name='defineYourSelf'
                    id='radio3'
                    className='radio-button__input'
                    type='radio'
                    value='Brands Owner'
                    onChange={handleChange}
                  />
                  <label htmlFor='radio3' className='radio-button__label'>
                    <span className='radio-button__custom'></span>
                    Brands Owner
                  </label>
                </div>
                <div className='radio-button basis-1/2'>
                  <input
                    name='defineYourSelf'
                    id='radio4'
                    className='radio-button__input'
                    type='radio'
                    value='Others'
                    onChange={handleChange}
                  />
                  <label htmlFor='radio4' className='radio-button__label'>
                    <span className='radio-button__custom'></span>
                    Others
                  </label>
                </div>
              </div>
            </div>

            <div className='space-y-2'>
              <label className='block text-cyan-600 font-medium'>How did you find us?</label>
              <select
                name='howYouFoundUs'
                onChange={handleChange}
                value={formData.howYouFoundUs}
                className='w-full p-3 border border-border rounded-md text-foreground'
                required>
                <option value='' disabled selected>
                  Select an option
                </option>
                <option value='Google'>Google</option>
                <option value='Social Media'>Social Media</option>
                <option value='Friend/Colleague'>Friend/Colleague</option>
                <option value='Other'>Other</option>
              </select>
            </div>

            <textarea
              name='message'
              value={formData.message}
              onChange={handleChange}
              placeholder='Why are you interested in us?'
              className='w-full p-3 border border-border rounded-md text-foreground'
              rows={4}
              required
            />
            <div className='space-y-2'>
              <label className='block text-cyan-600 font-medium'>Have you had a photoshoot before?</label>
              <div className='radio-buttons-container flex w-full gap-2 '>
                <div className='radio-button basis-1/2'>
                  <input
                    name='alreadyPhotoshoot'
                    onChange={handleChange}
                    id='radio5'
                    value='Yes'
                    className='radio-button__input'
                    type='radio'
                  />
                  <label htmlFor='radio5' className='radio-button__label'>
                    <span className='radio-button__custom'></span>
                    Yes
                  </label>
                </div>
                <div className='radio-button basis-1/2'>
                  <input
                    name='alreadyPhotoshoot'
                    onChange={handleChange}
                    value='No'
                    id='radio6'
                    className='radio-button__input'
                    type='radio'
                  />
                  <label htmlFor='radio6' className='radio-button__label'>
                    <span className='radio-button__custom'></span>
                    No
                  </label>
                </div>
              </div>
            </div>
            <button
              type='submit'
              className='w-full p-3 flex items-center justify-center gap-2 bg-brand-color text-white rounded-md shadow-lg text-lg'>
              <span>Send Message</span> {loading && <LoadingSpinner size={20} />}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactForm;


