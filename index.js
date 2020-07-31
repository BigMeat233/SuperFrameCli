/**
 * 入口文件
 * 
 * Made By Douzi＂
 */
import Core from 'node-corejs';
import AppMain from '@/AppMain';

Core.ClusterCore.init(AppMain);
Core.ClusterCore.start();